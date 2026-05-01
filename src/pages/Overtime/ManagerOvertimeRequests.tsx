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

interface ManagerOvertimeRequestsProps {
  embedded?: boolean;
}

const ManagerOvertimeRequests = ({
  embedded = false,
}: ManagerOvertimeRequestsProps) => {
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

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

        {/* Filters */}
        <PortalCard title={t("managerOvertimeRequestsPage.filters")} icon={<Search className="h-5 w-5" />}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("managerOvertimeRequestsPage.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="text-xs text-muted-foreground mb-1 block">
                {t("managerOvertimeRequestsPage.status")}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">{t("managerOvertimeRequestsPage.allStatus")}</option>
                <option value="pending">{t("managerOvertimeRequestsPage.pending")}</option>
                <option value="approved">{t("managerOvertimeRequestsPage.approved")}</option>
                <option value="rejected">{t("managerOvertimeRequestsPage.rejected")}</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> {t("managerOvertimeRequestsPage.reset")}
              </Button>
            </div>
          </div>
        </PortalCard>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <PortalCard title={t("managerOvertimeRequestsPage.history")} icon={<FileText className="h-5 w-5" />}>
            {data?.data?.length ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("managerOvertimeRequestsPage.employee")}</TableHead>
                      <TableHead>{t("managerOvertimeRequestsPage.date")}</TableHead>
                      <TableHead>{t("managerOvertimeRequestsPage.hours")}</TableHead>
                      <TableHead className="text-center">{t("managerOvertimeRequestsPage.status")}</TableHead>
                      <TableHead className="text-center">{t("managerOvertimeRequestsPage.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((req: OvertimeRequest) => (
                      <TableRow key={req._id} className="hover:bg-gray-50">
                        <TableCell>{req.userId?.fullName || "-"}</TableCell>
                        <TableCell>{formatDate(req.workDate || req.createdAt)}</TableCell>
                        <TableCell>{req.hours || "-"}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center h-full">
                            <Eye
                              className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer"
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
                {t("managerOvertimeRequestsPage.noRequests")}
              </div>
            )}
          </PortalCard>
        </div>

        {/* Mobile Cards */}
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
                  className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <TimerReset className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight">
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
                          label={t("managerOvertimeRequestsPage.employee")}
                          value={req.userId?.fullName || "-"}
                        />
                        <InfoTile
                          label={t("managerOvertimeRequestsPage.hours")}
                          value={req.hours || "-"}
                          icon={<Clock3 className="h-4 w-4 text-slate-400" />}
                        />
                      </MobileCardRow>

                      <MobileCardRow className="grid-cols-2">
                        <InfoTile
                          label={t("managerOvertimeRequestsPage.date")}
                          value={formatDate(req.workDate || req.createdAt)}
                        />
                        <div className="rounded-xl bg-slate-50 p-3">
                          <MobileCardLabel>
                            {t("managerOvertimeRequestsPage.status")}
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
                        {t("managerOvertimeRequestsPage.view")}
                      </Button>
                    </MobileCardContent>
                  )}
                </MobileCard>
              );
            })
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {t("managerOvertimeRequestsPage.noRequests")}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <ManagerOvertimeRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          submitting={updating}
        />
      )}

      <UnifiedPagination
        currentPage={page}
        totalPages={totalPages}
        setCurrentPage={setPage}
        perPage={limit}
        setPerPage={setLimit}
        className="mt-4"
      />
    </>
  );

  return embedded ? content : <Layout>{content}</Layout>;
};

export default ManagerOvertimeRequests;

const InfoTile = ({
  icon,
  label,
  value,
}: {
  icon?: JSX.Element;
  label: string;
  value: string | number;
}) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <MobileCardLabel>{label}</MobileCardLabel>
    <MobileCardValue className="mt-1 flex items-center gap-1.5">
      {icon}
      <span>{value}</span>
    </MobileCardValue>
  </div>
);
