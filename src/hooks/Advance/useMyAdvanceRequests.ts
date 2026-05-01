import { useState, useEffect } from "react";
import { useGetMyAdvanceRequestsQuery } from "@/rtk/Advance/advanceRequestApi";
import { AdvanceStatus } from "@/rtk/interfaces";
import { useTranslation } from "react-i18next";

type StatusFilter = "" | Extract<AdvanceStatus, "pending" | "approved" | "rejected">;

export const useMyAdvanceRequests = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const { data, isLoading, isError, error } = useGetMyAdvanceRequestsQuery({
    page,
    limit,
    status: statusFilter,
  });

  const requests = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const totalAmount = data?.summary?.totalAmount ?? 0;
  const approvedAmount = data?.summary?.approvedAmount ?? 0;
  const pendingCount = data?.summary?.pending ?? 0;
  const rejectedCount = data?.summary?.rejected ?? 0;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return {
    requests,
    isLoading,
    isError,
    error,
    totalAmount,
    approvedAmount,
    pendingCount,
    rejectedCount,
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
