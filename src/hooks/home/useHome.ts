// hooks/useHome.ts
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetAllLeavesQuery } from "@/rtk/leaves/LeavesApi";
import { useGetMyLeaveLogsQuery } from "@/rtk/leaves/LeaveLogsApi";
import { useGetMyLeaveRequestsQuery } from "@/rtk/leaves/leaveRequestsApi";
import { useGetMyAdvanceRequestsQuery } from "@/rtk/Advance/advanceRequestApi";
import { useGetMyOvertimeRequestsQuery } from "@/rtk/Overtime/overtimeRequestsApi";

import { IUser, LEAVE_REQUEST_STATUS } from "@/interfaces";
import { calculateLeaveBalances } from "@/lib/leaveBalance";

export const useHome = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // ===== User State =====
  const [user, setUser] = useState<IUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ===== Mobile Tabs State =====
  const [activeTab, setActiveTab] = useState<
    "attendance" | "Balance" | "leaves"
  >("attendance");

  // ===== Group Info =====
  const group = useMemo(() => {
    const storedGroup = localStorage.getItem("group");
    return storedGroup ? JSON.parse(storedGroup) : null;
  }, []);

  const leavePolicyId = useMemo(() => {
    const policyId =
      group?.leavePolicy?._id ||
      group?.leavePolicy ||
      group?.policiesSnapshot?.leavePolicy?._id ||
      group?.policiesSnapshot?.leavePolicy ||
      user?.groupId?.leavePolicy?._id ||
      user?.groupId?.leavePolicy ||
      user?.payrollGroupId?.policiesSnapshot?.leavePolicy?._id ||
      user?.payrollGroupId?.policiesSnapshot?.leavePolicy ||
      "";

    return policyId;
  }, [group, user]);

  // ===== Leave Data =====
  const { 
    data: leaveTypesData, 
    refetch: refetchLeaveTypes,
    isFetching: isFetchingLeaveTypes 
  } = useGetAllLeavesQuery(
    { page: 1, limit: 100, policyId: leavePolicyId },
    { 
      skip: !leavePolicyId,
      refetchOnMountOrArgChange: true, 
      refetchOnFocus: true, 
    },
  );

  const { 
    data: leaveLogsData, 
    refetch: refetchLeaveLogs,
    isFetching: isFetchingLeaveLogs 
  } = useGetMyLeaveLogsQuery(
    { page: 1, limit: 200 },
    { 
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const { 
    data: myLeaveRequests, 
    refetch: refetchLeaveRequests 
  } = useGetMyLeaveRequestsQuery(
    { page: 1, limit: 200, status: LEAVE_REQUEST_STATUS.PENDING },
    { 
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const { 
    data: myAdvanceRequests, 
    refetch: refetchAdvanceRequests 
  } = useGetMyAdvanceRequestsQuery(
    { page: 1, limit: 200, status: LEAVE_REQUEST_STATUS.PENDING },
    { 
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const { 
    data: myOvertimeRequests, 
    refetch: refetchOvertimeRequests 
  } = useGetMyOvertimeRequestsQuery(
    { page: 1, limit: 200, status: LEAVE_REQUEST_STATUS.PENDING },
    { 
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  // ===== Debug Logs =====
  console.log("leavePolicyId:", leavePolicyId);
  console.log("leaveTypesData:", leaveTypesData);
  console.log("leaveLogsData:", leaveLogsData);
  console.log("isFetchingLeaveTypes:", isFetchingLeaveTypes);

  // ===== leavePolicyId =====
  useEffect(() => {
    if (leavePolicyId) {
      refetchLeaveTypes();
      refetchLeaveLogs();
      refetchLeaveRequests();
      refetchAdvanceRequests();
      refetchOvertimeRequests();
    }
  }, [leavePolicyId]);

  // ===== Leave Balances =====
  const leaveBalances = useMemo(() => {
    if (!leaveTypesData?.data || !leaveLogsData?.data) return [];
    return calculateLeaveBalances(leaveTypesData.data, leaveLogsData.data);
  }, [leaveTypesData, leaveLogsData]);

  // ===== Pending Requests =====
  const pendingRequests = useMemo(() => {
    const now = new Date();

    const leavePending = (myLeaveRequests?.data || [])
      .filter(
        (req) =>
          req.status === LEAVE_REQUEST_STATUS.PENDING &&
          new Date(req.endDate) >= now,
      )
      .map((req) => ({ ...req, requestType: "Leave" as const }));

    const advancePending = (myAdvanceRequests?.data || [])
      .filter((req) => req.status === LEAVE_REQUEST_STATUS.PENDING)
      .map((req) => ({ ...req, requestType: "Advance" as const }));

    const overtimePending = (myOvertimeRequests?.data || [])
      .filter((req) => req.status === LEAVE_REQUEST_STATUS.PENDING)
      .map((req) => ({ ...req, requestType: "Overtime" as const }));

    return [...leavePending, ...advancePending, ...overtimePending];
  }, [myLeaveRequests, myAdvanceRequests, myOvertimeRequests]);

  // ===== Geolocation Tracking =====
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        };
        localStorage.setItem("location", JSON.stringify(location));
      },
      (err) => console.error("Error getting location:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ===== Listen for Login Messages =====
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (leavePolicyId) {
        refetchLeaveTypes();
        refetchLeaveLogs();
        refetchLeaveRequests();
        refetchAdvanceRequests();
        refetchOvertimeRequests();
      }
    }

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STAFF_LOGIN_TOKEN") {
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("user", JSON.stringify(event.data.user));
        setUser(event.data.user);
        
        setTimeout(() => {
          refetchLeaveTypes();
          refetchLeaveLogs();
          refetchLeaveRequests();
          refetchAdvanceRequests();
          refetchOvertimeRequests();
        }, 100);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [leavePolicyId]);

  // ===== Return Hook State & Actions =====
  return {
    user,
    setUser,
    leaveBalances,
    pendingRequests,
    activeTab,
    setActiveTab,
    navigate,
    t,
    i18n,
  };
};