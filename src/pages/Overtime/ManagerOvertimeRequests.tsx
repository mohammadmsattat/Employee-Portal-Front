import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Search,
  TimerReset,
  X,
  Filter,
  UserRound,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import ManagerOvertimeRequestModal from "./ManagerOvertimeRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import { useManagerOvertimeRequests } from "@/hooks/Overtime/useManagerOvertimeRequests";
import type { OvertimeRequest } from "@/rtk/interfaces";
import { cn } from "@/lib/utils";

interface ManagerOvertimeRequestsProps {
  embedded?: boolean;
}

const ManagerOvertimeRequests = ({
  embedded = false,
}: ManagerOvertimeRequestsProps) => {
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
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
  } = useManagerOvertimeRequests();

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "PPP");
  };

  // حساب الإحصائيات
  const counts = {
    total: data?.data?.length || 0,
    pending:
      data?.data?.filter((item) => item.status === "pending")?.length || 0,
    approved:
      data?.data?.filter((item) => item.status === "approved")?.length || 0,
    rejected:
      data?.data?.filter((item) => item.status === "rejected")?.length || 0,
  };

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
              {t("managerOvertimeRequestsPage.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("managerOvertimeRequestsPage.subtitle")}
            </p>
          </div>
        )}

        {/* ========== Summary Cards ========== */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard
            title="Total Requests"
            value={counts.total}
            icon={<FileText className="h-4 w-4 text-blue-500" />}
            bordered
          />
          <SummaryCard
            title={t("managerOvertimeRequestsPage.pending")}
            value={counts.pending}
            icon={<Clock className="h-4 w-4 text-amber-500" />}
            color="amber"
          />
          <SummaryCard
            title={t("managerOvertimeRequestsPage.approved")}
            value={counts.approved}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            color="emerald"
          />
          <SummaryCard
            title={t("managerOvertimeRequestsPage.rejected")}
            value={counts.rejected}
            icon={<X className="h-4 w-4 text-rose-500" />}
            color="rose"
          />
        </div>

        {/* ========== Filters ========== */}
        <PortalCard className="!p-0 overflow-hidden">
          {/* Filter Header */}
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  searchInput || statusFilter
                    ? "bg-blue-100 text-blue-600 ring-1 ring-blue-200"
                    : "bg-blue-50 text-blue-500 ring-1 ring-blue-100",
                )}
              >
                <Filter className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Filters
                  {(searchInput || statusFilter) && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-[10px] font-medium text-blue-600">
                      {
                        [searchInput ? 1 : 0, statusFilter ? 1 : 0].filter(
                          Boolean,
                        ).length
                      }
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400">
                  {showFilters
                    ? "Hide filter options"
                    : "Click to filter requests"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(searchInput || statusFilter) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600",
                  showFilters && "rotate-180",
                )}
              />
            </div>
          </button>

          {/* Filter Content */}
          {showFilters && (
            <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-5">
              <div className="grid gap-5 md:grid-cols-3">
                {/* Search Field */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    {t("managerOvertimeRequestsPage.search") || "Search"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t(
                        "managerOvertimeRequestsPage.searchPlaceholder",
                      )}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-4 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                    {searchInput && (
                      <button
                        onClick={() => setSearchInput("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Search by employee name or date
                  </p>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                    {t("managerOvertimeRequestsPage.status")}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value="">
                      {t("managerOvertimeRequestsPage.allStatus")}
                    </option>
                    <option value="pending">
                      {" "}
                      {t("managerOvertimeRequestsPage.pending")}
                    </option>
                    <option value="approved">
                      {" "}
                      {t("managerOvertimeRequestsPage.approved")}
                    </option>
                    <option value="rejected">
                      {" "}
                      {t("managerOvertimeRequestsPage.rejected")}
                    </option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchInput || statusFilter) && (
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Active filters:
                  </span>
                  {searchInput && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-100">
                      Search: "{searchInput}"
                      <button
                        onClick={() => setSearchInput("")}
                        className="hover:text-blue-800 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {statusFilter && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-100">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("")}
                        className="hover:text-blue-800 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </PortalCard>

        {/* ========== Desktop Table ========== */}
        <div className="hidden md:block">
          <PortalCard className="!p-0 overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3.5 bg-gradient-to-r from-blue-50/30 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <TimerReset className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {t("managerOvertimeRequestsPage.history")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {data?.data?.length || 0} requests waiting for review
                  </p>
                </div>
              </div>
            </div>

            {data?.data?.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-100">
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                        <div className="flex items-center gap-1.5">
                          <UserRound className="h-3 w-3" />
                          Employee
                        </div>
                      </TableHead>
                      <TableHead className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <Clock3 className="h-3 w-3" />
                          Hours
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                        Status
                      </TableHead>
                      <TableHead className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider py-2.5">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.data.map((req: OvertimeRequest) => (
                      <TableRow
                        key={req._id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="text-sm font-medium text-slate-700 py-3">
                          {req.userId?.fullName || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {formatDate(req.workDate || req.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            {req.hours || "-"}h
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState />
            )}
          </PortalCard>
        </div>

        {/* ========== Mobile Cards ========== */}
        <div className="space-y-3 md:hidden">
          {data?.data?.length ? (
            data.data.map((req: OvertimeRequest) => {
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
                  className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-sm"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-white px-4 py-3 border-l-4 border-l-blue-600"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight text-sm">
                          {req.userId?.fullName || "-"}
                        </MobileCardValue>
                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {formatDate(req.workDate || req.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={req.status} compact />
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </div>
                  </MobileCardHeader>

                  {isExpanded && (
                    <MobileCardContent className="space-y-3 px-4 py-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                          <span>Date & Time</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(req.workDate || req.createdAt)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>
                              {FormatTime(req.startTime, true)} -{" "}
                              {FormatTime(req.endTime, true)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Hours
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-700">
                            {req.hours || "-"}h
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Status
                          </p>
                          <div className="mt-1">
                            <StatusBadge status={req.status} />
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="h-10 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </MobileCardContent>
                  )}
                </MobileCard>
              );
            })
          ) : (
            <EmptyState />
          )}
        </div>

        {/* ========== Pagination ========== */}
        <UnifiedPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
          perPage={limit}
          setPerPage={setLimit}
          className="mt-2"
        />
      </div>

      {/* ========== Modal ========== */}
      {selectedRequest && (
        <ManagerOvertimeRequestModal
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

export default ManagerOvertimeRequests;

// ============= Sub-Components =============

const SummaryCard = ({
  title,
  value,
  icon,
  color = "blue",
  bordered = false,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: "blue" | "amber" | "emerald" | "rose";
  bordered?: boolean;
}) => {
  const colorMap = {
    blue: "border-l-blue-600",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    rose: "border-l-rose-500",
  };

  return (
    <div
      className={`rounded-lg border border-slate-200 ${bordered ? `border-l-4 ${colorMap[color]}` : ""} bg-white p-4 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
};

const InfoTile = ({
  icon,
  label,
  value,
}: {
  icon?: JSX.Element;
  label: string;
  value: string | number;
}) => (
  <div className="rounded-md bg-slate-50 p-3">
    <MobileCardLabel>{label}</MobileCardLabel>
    <MobileCardValue className="mt-1 flex items-center gap-1.5">
      {icon}
      <span>{value}</span>
    </MobileCardValue>
  </div>
);

const EmptyState = () => (
  <div className="px-5 py-12 text-center">
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100/60 text-slate-300">
      <TimerReset className="h-6 w-6" />
    </div>
    <h4 className="text-sm font-medium text-slate-700">No requests</h4>
    <p className="mt-0.5 text-xs text-slate-400">
      All overtime requests have been reviewed
    </p>
  </div>
);
