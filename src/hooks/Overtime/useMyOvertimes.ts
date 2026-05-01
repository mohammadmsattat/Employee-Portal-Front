import { useState, useMemo, useEffect } from "react";
import { useGetMyOvertimeRequestsQuery } from "@/rtk/Overtime/overtimeRequestsApi";
import { OvertimeRequest, OvertimeStatus } from "@/rtk/interfaces";
import { useTranslation } from "react-i18next";

type StatusFilter = "" | Extract<OvertimeStatus, "pending" | "approved" | "rejected">;

export const useMyOvertimes = () => {
  const {t} = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); 
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const mobileLimit = 10;

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    setPage(1);
  }, [limit]);

  const { data, isLoading } = useGetMyOvertimeRequestsQuery({
    page,
    limit: isMobile ? mobileLimit : limit,
    status: statusFilter,
  });

  const [isOvertimeModalOpen, setOvertimeModalOpen] = useState(false);

  const requests: OvertimeRequest[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const counts = useMemo(
    () => ({
      total: data?.summary?.total ?? 0,
      approved: data?.summary?.approved ?? 0,
      pending: data?.summary?.pending ?? 0,
      rejected: data?.summary?.rejected ?? 0,
    }),
    [data?.summary],
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return {
    requests,
    counts,
    isLoading,
    isOvertimeModalOpen,
    setOvertimeModalOpen,
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    mobileLimit,
    totalPages,
    isMobile,
    t,
  };
};
