import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Search,
  UserRound,
  X,
  Filter,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import LeaveRequestModal from "./LeaveRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useManagerLeaves } from "@/hooks/Leaves/useManagerLeaves";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LeaveApprovalsPanel = () => {
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
  } = useManagerLeaves();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

  const formatDate = (date) => format(new Date(date), "PPP");

  const counts = {
    total: data?.paginationResult?.totalDocuments || data?.data?.length || 0,
    pending:
      data?.data?.filter((item) => item.status === "pending")?.length || 0,
    approved:
      data?.data?.filter((item) => item.status === "approved")?.length || 0,
    rejected:
      data?.data?.filter((item) => item.status === "rejected")?.length || 0,
  };

  if (isLoading) {
    return (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* ========== Filters ========== */}
        <PortalCard className="!p-0 overflow-hidden">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Filter className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-slate-700">Filters</h4>
                <p className="text-xs text-slate-400">Narrow down requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(searchInput ||
                statusFilter ||
                startDateFilter ||
                endDateFilter) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform duration-200",
                  showFilters && "rotate-180",
                )}
              />
            </div>
          </button>

          {showFilters && (
            <div className="border-t border-slate-100 px-5 py-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-slate-500">
                    {t("managerLeavesPage.search")}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t("managerLeavesPage.searchPlaceholder")}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    {t("managerLeavesPage.status")}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">{t("managerLeavesPage.allStatus")}</option>
                    <option value="pending">
                      {t("managerLeavesPage.pending")}
                    </option>
                    <option value="approved">
                      {t("managerLeavesPage.approved")}
                    </option>
                    <option value="rejected">
                      {t("managerLeavesPage.rejected")}
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    {t("managerLeavesPage.from")}
                  </label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    {t("managerLeavesPage.to")}
                  </label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          )}
        </PortalCard>

        {/* ========== Desktop Table ========== */}
        <div className="hidden md:block">
          <PortalCard className="!p-0 overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3.5 bg-gradient-to-r from-blue-50/30 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {t("managerLeavesPage.history")}
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
                    <TableRow className="text-start bg-slate-50/50 border-b border-slate-100">
                      <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                        Employee
                      </TableHead>
                      <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                        Leave Type
                      </TableHead>
                      <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                        From
                      </TableHead>
                      <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                        To
                      </TableHead>
                      <TableHead className="text-center text-center text-xs text-slate-500 tracking-wider">
                        Days
                      </TableHead>
                      <TableHead className="text-center text-center text-xs text-slate-500 tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="text-center text-center text-xs text-slate-500 tracking-wider">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.data.map((req) => (
                      <TableRow
                        key={req._id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="text-sm text-center font-medium text-slate-700 py-3">
                          {req.userId?.fullName || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-center text-slate-600">
                          {req.leaveType?.typeKey || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-center text-slate-600">
                          {formatDate(req.startDate)}
                        </TableCell>
                        <TableCell className="text-sm text-center text-slate-600">
                          {formatDate(req.endDate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            {req.days}
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
            data.data.map((req) => {
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
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {req.leaveType?.typeKey || "-"}
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
                          <span>Date Range</span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <p className="min-w-0 text-sm font-semibold leading-snug text-slate-900">
                            {formatDate(req.startDate)}
                          </p>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                          <p className="min-w-0 text-end text-sm font-semibold leading-snug text-slate-900">
                            {formatDate(req.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Days
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-700">
                            {req.days}
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
          perPage={isMobile ? mobileLimit : limit}
          setPerPage={isMobile ? undefined : setLimit}
          className="mt-2"
        />
      </div>

      {/* ========== Modal ========== */}
      {selectedRequest && (
        <LeaveRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          submitting={updating}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default LeaveApprovalsPanel;

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

const EmptyState = () => (
  <div className="px-5 py-12 text-center">
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100/60 text-slate-300">
      <CheckCircle2 className="h-6 w-6" />
    </div>
    <h4 className="text-sm font-medium text-slate-700">No requests</h4>
    <p className="mt-0.5 text-xs text-slate-400">
      All leave requests have been reviewed
    </p>
  </div>
);
