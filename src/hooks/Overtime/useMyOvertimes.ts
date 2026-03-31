import { useState, useMemo, useEffect } from "react";
import { useGetMyOvertimeRequestsQuery } from "@/rtk/Overtime/overtimeRequestsApi";
import { OvertimeRequest } from "@/rtk/interfaces";

export const useMyOvertimes = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); 
  const mobileLimit = 10;

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    setPage(1);
  }, [limit]);

  const { data, isLoading } = useGetMyOvertimeRequestsQuery({
    page,
    limit: isMobile ? mobileLimit : limit,
  });

  const [isOvertimeModalOpen, setOvertimeModalOpen] = useState(false);

  const requests: OvertimeRequest[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const counts = useMemo(() => {
    const totalHours = requests.reduce((acc, r) => acc + (r.hours || 0), 0);
    return {
      total: totalHours,
      approved: requests
        .filter((r) => r.status === "approved")
        .reduce((acc, r) => acc + (r.hours || 0), 0),
      pending: requests
        .filter((r) => r.status === "pending")
        .reduce((acc, r) => acc + (r.hours || 0), 0),
      rejected: requests
        .filter((r) => r.status === "rejected")
        .reduce((acc, r) => acc + (r.hours || 0), 0),
    };
  }, [requests]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

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
    mobileLimit,
    totalPages,
    isMobile,
  };
};