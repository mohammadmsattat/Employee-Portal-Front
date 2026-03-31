import { useState, useEffect } from "react";
import { useGetMyLeaveRequestsQuery } from "@/rtk/leaves/leaveRequestsApi";
import { LeaveRequest } from "@/rtk/interfaces";
import { differenceInCalendarDays, format } from "date-fns";

export const useMyLeaves = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useGetMyLeaveRequestsQuery({
    page,
    limit,
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
    total: requests.length,
    used: requests
      .filter((r) => r.status === "approved")
      .reduce(
        (acc, r) =>
          acc +
          (r.startDate && r.endDate
            ? differenceInCalendarDays(new Date(r.endDate), new Date(r.startDate)) + 1
            : 0),
        0
      ),
    remaining: 0,
    pending: requests.filter((r) => r.status === "pending").length,
  };

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

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
    totalPages,
  };
};