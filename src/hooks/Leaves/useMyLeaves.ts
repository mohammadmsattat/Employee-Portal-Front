// hooks/Leaves/useMyLeaves.ts
import { useState, useEffect, useMemo } from "react";
import { useGetMyLeaveRequestsQuery } from "@/rtk/leaves/leaveRequestsApi";
import { useGetAllLeavesQuery } from "@/rtk/leaves/LeavesApi";
import { useGetMyLeaveLogsQuery } from "@/rtk/leaves/LeaveLogsApi";
import { LeaveRequest, LeaveStatus, IUser } from "@/rtk/interfaces";
import { differenceInCalendarDays, format } from "date-fns";
import { useTranslation } from "react-i18next";
import { calculateLeaveBalances } from "@/lib/leaveBalance";

type StatusFilter = "" | LeaveStatus;

export const useMyLeaves = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  // ============= Get User Info =============
  const [user, setUser] = useState<IUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const group = useMemo(() => {
    const storedGroup = localStorage.getItem("group");
    return storedGroup ? JSON.parse(storedGroup) : null;
  }, []);

  const leavePolicyId =
    group?.leavePolicy?._id ||
    group?.leavePolicy ||
    group?.policiesSnapshot?.leavePolicy?._id ||
    group?.policiesSnapshot?.leavePolicy ||
    "";

  // ============= API Queries =============
  const { data, isLoading: isLoadingRequests  } = useGetMyLeaveRequestsQuery({
    page,
    limit,
    status: statusFilter,
  });

  const { data: leaveTypesData, isLoading: isLoadingTypes } =
    useGetAllLeavesQuery(
      { page: 1, limit: 100, policyId: leavePolicyId },
      { skip: !leavePolicyId },
    );

  const { data: leaveLogsData, isLoading: isLoadingLogs } =
    useGetMyLeaveLogsQuery({ page: 1, limit: 1000 }, { skip: !leavePolicyId });

  // ============= Calculate Leave Balances =============
  const leaveBalances = useMemo(() => {
    if (!leaveTypesData?.data || !leaveLogsData?.data) return [];
    return calculateLeaveBalances(leaveTypesData.data, leaveLogsData.data);
  }, [leaveTypesData, leaveLogsData]);

  // ============= Calculate Counts =============
  const counts = useMemo(() => {
    return leaveBalances.reduce(
      (acc, balance) => ({
        total: acc.total + (balance.totalAllowed || 0),
        used: acc.used + (balance.usedDays || 0),
        remaining: acc.remaining + (balance.remainingDays || 0),
        pending: 0,
      }),
      { total: 0, used: 0, remaining: 0, pending: 0 },
    );
  }, [leaveBalances]);

  // ============= Pending Count from Requests =============
  const pendingCount = useMemo(() => {
    return (
      data?.data?.filter((r: LeaveRequest) => r.status === "pending").length ||
      0
    );
  }, [data]);

  // ============= Final Counts =============
  const finalCounts = useMemo(
    () => ({
      ...counts,
      pending: pendingCount,
    }),
    [counts, pendingCount],
  );

  // ============= Requests =============
  const requests: LeaveRequest[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // ============= Helper Functions =============
  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy") : "-";

  const calculateDays = (start: string, end: string) =>
    start && end
      ? differenceInCalendarDays(new Date(end), new Date(start)) + 1
      : "-";

  // ============= State =============
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);

  // ============= Effects =============
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // ============= Loading =============
  const isLoading = isLoadingRequests || isLoadingTypes || isLoadingLogs;

  return {
    requests,
    counts: finalCounts,
    leaveBalances,
    formatDate,
    calculateDays,
    isLoading,
    isLeaveModalOpen,
    setLeaveModalOpen,
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    totalPages,
    t,
  };
};
