// hooks/Advance/useManagerAdvances.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMyApprovalRequestsQuery,
  useHandleAdvanceStatusMutation,
} from "@/rtk/Advance/advanceRequestApi";
import { useTranslation } from "react-i18next";

export const useManagerAdvances = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const mobileLimit = 10;

  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchFilter(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchFilter, limit]);

  const { data, isLoading } = useGetMyApprovalRequestsQuery({
    page,
    limit: isMobile ? mobileLimit : limit,
    status: statusFilter,
  });

  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const [handleStatus] = useHandleAdvanceStatusMutation();

  const handleApprove = async (req: any) => {
    setUpdating(true);
    try {
      await handleStatus({ id: req._id, action: "approve" }).unwrap();
      toast({ title: "Advance approved", description: "Request approved." });
      setSelectedRequest(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to approve.",
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
      await handleStatus({
        id: req._id,
        action: "reject",
        rejectionReason: reason,
      }).unwrap();
      toast({ title: "Advance rejected", description: "Request rejected." });
      setSelectedRequest(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to reject.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
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
    searchInput,
    setSearchInput,
    searchFilter,
    selectedRequest,
    setSelectedRequest,
    updating,
    handleApprove,
    handleReject,
    totalPages,
    isMobile,
    t,
  };
};