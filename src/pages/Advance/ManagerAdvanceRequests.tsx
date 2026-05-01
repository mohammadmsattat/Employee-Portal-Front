// pages/ManagerAdvanceRequests.tsx
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  HandCoins,
  Search,
  X,
} from "lucide-react";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import ManagerAdvanceRequestModal from "./ManagerAdvanceRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import { useManagerAdvances } from "@/hooks/Advance/useManagerAdvances";
import { format } from "date-fns";
import type { AdvanceRequest } from "@/rtk/interfaces";

interface ManagerAdvanceRequestsProps {
  embedded?: boolean;
}

const ManagerAdvanceRequests = ({
  embedded = false,
}: ManagerAdvanceRequestsProps) => {
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

  const {
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
    selectedRequest,
    setSelectedRequest,
    updating,
    handleApprove,
    handleReject,
    totalPages,
    isMobile,
    t,
  } = useManagerAdvances();

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "P");
  };

  const statuses = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  if (isLoading) {
    const loader = (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

    return embedded ? loader : <Layout>{loader}</Layout>;
  }

  const content = (
    <>
      <div className="space-y-6">
        {!embedded && (
          <div>
            <h1 className="text-2xl font-bold text-portal-header">
              {t("managerAdvanceRequestsPage.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("managerAdvanceRequestsPage.subtitle")}
            </p>
          </div>
        )}

        {/* Filters */}
        <PortalCard>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">
                  {t("managerAdvanceRequestsPage.filters")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("managerAdvanceRequestsPage.subtitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[200px]">
              <label className="text-xs text-muted-foreground">
                {t("managerLeavesPage.search")}
              </label>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t(
                    "managerAdvanceRequestsPage.searchPlaceholder",
                  )}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white ps-9 pe-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 md:flex-1 md:min-w-[260px]">
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("managerAdvanceRequestsPage.status")}
              </label>

              <div className="flex flex-wrap gap-2">
                {statuses.map((item) => {
                  const isActive = statusFilter === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => setStatusFilter(item.value)}
                      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("");
                  setSearchInput("");
                }}
                className="h-11 rounded-lg border-slate-200"
              >
                <X className="h-4 w-4" />{" "}
                {t("managerAdvanceRequestsPage.reset")}
              </Button>
            </div>
          </div>
        </PortalCard>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <PortalCard>
            <div className="mb-4 flex items-center gap-3 px-5 pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">
                  {t("managerAdvanceRequestsPage.history")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("managerAdvanceRequestsPage.subtitle")}
                </p>
              </div>
            </div>
            {data?.data?.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.employee")}
                      </TableHead>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.date")}
                      </TableHead>
                      <TableHead>
                        {t("managerAdvanceRequestsPage.amount")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("managerAdvanceRequestsPage.status")}
                      </TableHead>
                      <TableHead className="text-center">
                        {t("managerAdvanceRequestsPage.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((req: AdvanceRequest) => (
                      <TableRow key={req._id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell>{req.userId?.fullName || "-"}</TableCell>
                        <TableCell>{formatDate(req.createdAt)}</TableCell>
                        <TableCell>{req.amount || "-"}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center h-full">
                            <Eye
                              className="h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-900"
                              onClick={() => setSelectedRequest(req)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                {t("managerAdvanceRequestsPage.noRequests")}
              </div>
            )}
          </PortalCard>
        </div>

        {/* Mobile Cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {data?.data?.length ? (
            data.data.map((req: AdvanceRequest) => {
              const isExpanded = expandedMobileCardId === req._id;

              return (
                <MobileCard
                  key={req._id}
                  compact
                  interactive
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedMobileCardId(isExpanded ? null : req._id)
                  }
                  className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <HandCoins className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight">
                          {req.userId?.fullName || "-"}
                        </MobileCardValue>
                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={req.status} />
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </MobileCardHeader>

                  {isExpanded && (
                    <MobileCardContent className="space-y-3 px-4 py-4">
                      <MobileCardRow className="grid-cols-2">
                        <InfoTile
                          label={t("managerAdvanceRequestsPage.employee")}
                          value={req.userId?.fullName || "-"}
                        />
                        <InfoTile
                          label={t("managerAdvanceRequestsPage.amount")}
                          value={req.amount || "-"}
                        />
                      </MobileCardRow>

                      <MobileCardRow className="grid-cols-2">
                        <InfoTile
                          label={t("managerAdvanceRequestsPage.date")}
                          value={formatDate(req.createdAt)}
                        />
                        <div className="rounded-md bg-slate-50 p-3">
                          <MobileCardLabel>
                            {t("managerAdvanceRequestsPage.status")}
                          </MobileCardLabel>
                          <div className="mt-2">
                            <StatusBadge status={req.status} />
                          </div>
                        </div>
                      </MobileCardRow>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRequest(req);
                        }}
                      >
                        <Eye className="me-2 h-4 w-4" />
                        {t("managerAdvanceRequestsPage.view")}
                      </Button>
                    </MobileCardContent>
                  )}
                </MobileCard>
              );
            })
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {t("managerAdvanceRequestsPage.noRequests")}
            </div>
          )}
        </div>

        {/* Pagination */}
        <UnifiedPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
          perPage={isMobile ? mobileLimit : limit}
          setPerPage={isMobile ? undefined : setLimit}
          className="mt-4"
        />
      </div>
      {/* Modal */}
      {selectedRequest && (
        <ManagerAdvanceRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          submitting={updating}
        />
      )}
    </>
  );

  return embedded ? content : <Layout>{content}</Layout>;
};

export default ManagerAdvanceRequests;

const InfoTile = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-md bg-slate-50 p-3">
    <MobileCardLabel>{label}</MobileCardLabel>
    <MobileCardValue className="mt-1">{value}</MobileCardValue>
  </div>
);

