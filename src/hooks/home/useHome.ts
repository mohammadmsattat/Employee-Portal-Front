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

/**
 * Custom hook to handle Home page data
 * - User info
 * - Leave balances
 * - Pending requests (leave, advance, overtime)
 * - Geolocation tracking
 */
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

  // ===== Leave Data =====
  const { data: leaveTypesData } = useGetAllLeavesQuery(
    { page: 1, limit: 100, policyId: group?.leavePolicy?._id || "" },
    { skip: !group?.leavePolicy?._id },
  );

  const { data: leaveLogsData } = useGetMyLeaveLogsQuery({
    page: 1,
    limit: 200,
  });

  const { data: myLeaveRequests } = useGetMyLeaveRequestsQuery({
    page: 1,
    limit: 200,
    status: LEAVE_REQUEST_STATUS.PENDING,
  });

  const { data: myAdvanceRequests } = useGetMyAdvanceRequestsQuery({
    page: 1,
    limit: 200,
    status: LEAVE_REQUEST_STATUS.PENDING,
  });

  const { data: myOvertimeRequests } = useGetMyOvertimeRequestsQuery({
    page: 1,
    limit: 200,
    status: LEAVE_REQUEST_STATUS.PENDING,
  });

  // ===== Leave Balances =====
  const leaveBalances = useMemo(() => {
    if (!leaveTypesData?.data || !leaveLogsData?.data) return [];
    return calculateLeaveBalances(leaveTypesData.data, leaveLogsData.data);
  }, [leaveTypesData, leaveLogsData]);

  // ===== Pending Requests (Leave, Advance, Overtime) =====
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

    // Use previously stored location if available
    const storedLocation = localStorage.getItem("location");
    if (storedLocation)
      console.log("Using stored location:", JSON.parse(storedLocation));

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        };
        localStorage.setItem("location", JSON.stringify(location));
        console.log("Updated user location:", location);
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
    if (storedToken && storedUser) setUser(JSON.parse(storedUser));

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STAFF_LOGIN_TOKEN") {
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("user", JSON.stringify(event.data.user));
        setUser(event.data.user);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
