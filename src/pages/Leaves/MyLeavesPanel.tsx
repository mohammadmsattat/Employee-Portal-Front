import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
} from "lucide-react";
import { useState } from "react";
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
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import UnifiedPagination from "@/components/ui/pagination";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import { useMyLeaves } from "@/hooks/Leaves/useMyLeaves";

const MyLeavesPanel = () => {
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

  const {
    requests,
    counts,
    formatDate,
    calculateDays,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    totalPages,
    t,
  } = useMyLeaves();

  const statusOptions: Array<{
    value: "" | "pending" | "approved" | "rejected";
    label: string;
  }> = [
    { value: "", label: "All" },
    { value: "pending", label: t("myLeavesPage.pending") },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  if (isLoading) {
    return (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          title={t("myLeavesPage.totalBalance")}
          value={counts.total}
        />
        <SummaryCard title={t("myLeavesPage.used")} value={counts.used} />
        <SummaryCard
          title={t("myLeavesPage.remaining")}
          value={counts.remaining}
        />
        <SummaryCard title={t("myLeavesPage.pending")} value={counts.pending} />
      </div>

      <div className="rounded-[22px] border border-slate-200/70 bg-slate-50 p-1">
        <div className="grid grid-cols-4 gap-1">
          {statusOptions.map((option) => {
            const isActive = statusFilter === option.value;

            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`h-10 rounded-[18px] px-2 text-xs font-semibold transition sm:text-sm ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <PortalCard>
          <div className="mb-4 flex items-center gap-3 px-5 pt-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("myLeavesPage.history")}
              </h3>
              <p className="text-sm text-slate-500">
                Your submitted leave requests
              </p>
            </div>
          </div>

          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("myLeavesPage.leaveType")}</TableHead>
                    <TableHead>{t("myLeavesPage.from")}</TableHead>
                    <TableHead>{t("myLeavesPage.to")}</TableHead>
                    <TableHead className="text-center">
                      {t("myLeavesPage.days")}
                    </TableHead>
                    <TableHead className="text-end">
                      {t("myLeavesPage.status")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{r.leaveType?.typeKey || "-"}</TableCell>
                      <TableCell>{formatDate(r.startDate)}</TableCell>
                      <TableCell>{formatDate(r.endDate)}</TableCell>
                      <TableCell className="text-center">
                        {calculateDays(r.startDate, r.endDate)}
                      </TableCell>
                      <TableCell className="text-end">
                        <StatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState t={t} />
          )}
        </PortalCard>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {requests.length > 0 ? (
          requests.map((r) => {
            const isExpanded = expandedMobileCardId === r._id;

            return (
              <MobileCard
                key={r._id}
                compact
                interactive
                aria-expanded={isExpanded}
                onClick={() =>
                  setExpandedMobileCardId(isExpanded ? null : r._id)
                }
                className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <MobileCardHeader
                  noBorder={!isExpanded}
                  className="items-center gap-3 bg-slate-50/80 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <MobileCardValue className="truncate leading-tight">
                        {r.leaveType?.typeKey || "-"}
                      </MobileCardValue>
                      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {formatDate(r.startDate)} - {formatDate(r.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={r.status} />
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </MobileCardHeader>

                {isExpanded && (
                  <MobileCardContent className="space-y-3 px-4 py-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        <span>
                          {t("myLeavesPage.from")} - {t("myLeavesPage.to")}
                        </span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <p className="min-w-0 text-sm font-semibold leading-snug text-slate-900">
                          {formatDate(r.startDate)}
                        </p>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        <p className="min-w-0 text-end text-sm font-semibold leading-snug text-slate-900">
                          {formatDate(r.endDate)}
                        </p>
                      </div>
                    </div>

                    <MobileCardRow className="grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <MobileCardLabel>
                          {t("myLeavesPage.days")}
                        </MobileCardLabel>
                        <MobileCardValue className="mt-1 flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4 text-slate-400" />
                          <span>{calculateDays(r.startDate, r.endDate)}</span>
                        </MobileCardValue>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <MobileCardLabel>
                          {t("myLeavesPage.status")}
                        </MobileCardLabel>
                        <div className="mt-2">
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                    </MobileCardRow>
                  </MobileCardContent>
                )}
              </MobileCard>
            );
          })
        ) : (
          <EmptyState t={t} />
        )}
      </div>

      <UnifiedPagination
        currentPage={page}
        totalPages={totalPages}
        setCurrentPage={setPage}
        perPage={limit}
        setPerPage={setLimit}
        className="mt-2"
      />
    </div>
  );
};

export default MyLeavesPanel;

const SummaryCard = ({ title, value }) => (
  <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </p>
  </div>
);

const EmptyState = ({ t }) => (
  <div className="px-5 py-12 text-center">
    <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
    <h3 className="mb-2 text-lg font-semibold text-slate-900">
      {t("myLeavesPage.noRequests")}
    </h3>
    <p className="mx-auto max-w-md text-sm text-slate-500">
      {t("myLeavesPage.noRequestsMatchFilters")}
    </p>
  </div>
);
