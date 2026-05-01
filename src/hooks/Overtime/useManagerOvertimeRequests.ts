import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useChangeOvertimeRequestStatusMutation,
  useGetMyApprovalOvertimeRequestsQuery,
} from "@/rtk/Overtime/overtimeRequestsApi";
import { useTranslation } from "react-i18next";

export const useManagerOvertimeRequests = () => {
  const {t} =useTranslation();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const mobileLimit = 10;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchFilter(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // reset page on filter/search change
  useEffect(() => setPage(1), [statusFilter, searchFilter]);

  const { data, isLoading } = useGetMyApprovalOvertimeRequestsQuery({
    page,
    limit: isMobile ? mobileLimit : limit,
    status: statusFilter,
    search: searchFilter,
  });

  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const [changeStatus] = useChangeOvertimeRequestStatusMutation();

  const handleApprove = async (req: any) => {
    setUpdating(true);
    try {
      await changeStatus({ id: req._id, action: "approve" }).unwrap();
      toast({
        title: "Overtime approved",
        description: "Request approved successfully.",
      });
      setSelectedRequest(null);
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "Failed to approve request.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (req: any, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Rejection reason is required.",
        variant: "destructive",
      });
      return;
    }
    setUpdating(true);
    try {
      await changeStatus({ id: req._id, action: "reject", reason }).unwrap();
      toast({
        title: "Overtime rejected",
        description: "Request rejected successfully.",
      });
      setSelectedRequest(null);
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "Failed to reject request.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setSearchInput("");
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    searchInput,
    setSearchInput,
    searchFilter,
    data,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    updating,
    handleApprove,
    handleReject,
    resetFilters,
    totalPages,
    t,
  };
};
