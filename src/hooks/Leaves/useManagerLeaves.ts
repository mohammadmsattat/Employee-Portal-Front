import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useChangeLeaveRequestStatusMutation,
  useGetApprovalRequestsQuery,
} from "@/rtk/leaves/leaveRequestsApi";
import { useTranslation } from "react-i18next";

export const useManagerLeaves = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // desktop adjustable
  const mobileLimit = 10;

  const [statusFilter, setStatusFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updating, setUpdating] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    const timer = setTimeout(() => setSearchFilter(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(
    () => setPage(1),
    [
      statusFilter,
      leaveTypeFilter,
      startDateFilter,
      endDateFilter,
      searchFilter,
      limit,
    ],
  );

  const { data, isLoading } = useGetApprovalRequestsQuery({
    page,
    limit: isMobile ? mobileLimit : limit,
    status: statusFilter,
  });
  console.log(data);

  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const [changeStatus] = useChangeLeaveRequestStatusMutation();

  const handleApprove = async (req) => {
    setUpdating(true);
    try {
      await changeStatus({ id: req._id, action: "approve" }).unwrap();
      toast({ title: "Leave approved", description: "Request approved." });
      setSelectedRequest(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to approve.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (req, reason) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Reason is required.",
        variant: "destructive",
      });
      return;
    }
    setUpdating(true);
    try {
      await changeStatus({ id: req._id, action: "reject", reason }).unwrap();
      toast({ title: "Leave rejected", description: "Request rejected." });
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const calculateDays = (
    start: string | undefined,
    end: string | undefined,
  ): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);

    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;

    return Math.max(
      1,
      Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );
  };
  const resetFilters = () => {
    setStatusFilter("");
    setLeaveTypeFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setSearchInput("");
  };

  return {
    data,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    mobileLimit,
    statusFilter,
    setStatusFilter,
    leaveTypeFilter,
    setLeaveTypeFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    searchInput,
    setSearchInput,
    selectedRequest,
    setSelectedRequest,
    updating,
    handleApprove,
    handleReject,
    calculateDays,
    resetFilters,
    totalPages,
    isMobile,
    t,
  };
};
