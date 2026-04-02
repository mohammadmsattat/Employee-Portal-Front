import { useState, useEffect } from "react";
import { useGetMyAdvanceRequestsQuery } from "@/rtk/Advance/advanceRequestApi";
import { useTranslation } from "react-i18next";

export const useMyAdvanceRequests = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, error } = useGetMyAdvanceRequestsQuery({
    page,
    limit,
  });

  const requests = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const totalAmount = requests.reduce(
    (sum: number, r: any) => sum + r.amount,
    0,
  );

  const approvedAmount = requests
    .filter((r: any) => r.status === "approved")
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  const pendingCount = requests.filter(
    (r: any) => r.status === "pending",
  ).length;

  const rejectedCount = requests.filter(
    (r: any) => r.status === "rejected",
  ).length;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

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
    totalPages,
    t,
  };
};
