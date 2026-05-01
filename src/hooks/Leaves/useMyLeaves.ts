import { useState, useEffect } from "react";
import { useGetMyLeaveRequestsQuery } from "@/rtk/leaves/leaveRequestsApi";
import { LeaveRequest, LeaveStatus } from "@/rtk/interfaces";
import { differenceInCalendarDays, format } from "date-fns";
import { useTranslation } from "react-i18next";

type StatusFilter = "" | LeaveStatus;

export const useMyLeaves = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const { data, isLoading } = useGetMyLeaveRequestsQuery({
    page,
    limit,
    status: statusFilter,
  });

  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);

  const requests: LeaveRequest[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const formatDate = (dateString: string) =>
    dateString ? format(new Date(dateString), "MMM dd, yyyy") : "-";

  const calculateDays = (start: string, end: string) =>
    start && end
      ? differenceInCalendarDays(new Date(end), new Date(start)) + 1
      : "-";

  const counts = {
    total: data?.summary?.totalBalance ?? 0,
    used: data?.summary?.used ?? 0,
    remaining: data?.summary?.remaining ?? 0,
    pending: data?.summary?.pending ?? 0,
  };

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return {
    requests,
    counts,
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
