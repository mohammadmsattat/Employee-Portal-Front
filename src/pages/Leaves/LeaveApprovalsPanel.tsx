import { FileText, Search, X, Eye, CheckCircle2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard title="Total Requests" value={counts.total} />
        <SummaryCard
          title={t("managerLeavesPage.pending")}
          value={counts.pending}
        />
        <SummaryCard
          title={t("managerLeavesPage.approved")}
          value={counts.approved}
        />
        <SummaryCard
          title={t("managerLeavesPage.rejected")}
          value={counts.rejected}
        />
      </div>

      {/* Filters */}
      <PortalCard>
        <div className="mb-4 flex items-center gap-3 px-5 pt-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {t("managerLeavesPage.filters")}
            </h3>
            <p className="text-sm text-slate-500">
              Narrow down requests quickly
            </p>
          </div>
        </div>

        <div className="grid gap-4 px-5 pb-5 md:grid-cols-5">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-slate-500">
              {t("managerLeavesPage.search")}
            </label>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t("managerLeavesPage.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white ps-9 pe-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">
              {t("managerLeavesPage.status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">{t("managerLeavesPage.allStatus")}</option>
              <option value="pending">{t("managerLeavesPage.pending")}</option>
              <option value="approved">
                {t("managerLeavesPage.approved")}
              </option>
              <option value="rejected">
                {t("managerLeavesPage.rejected")}
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">
              {t("managerLeavesPage.from")}
            </label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">
              {t("managerLeavesPage.to")}
            </label>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="px-5 pb-5">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-2xl"
          >
            <X className="me-2 h-4 w-4" />
            {t("managerLeavesPage.reset")}
          </Button>
        </div>
      </PortalCard>

      {/* Desktop */}
      <div className="hidden md:block">
        <PortalCard>
          <div className="mb-4 flex items-center gap-3 px-5 pt-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("managerLeavesPage.history")}
              </h3>
              <p className="text-sm text-slate-500">
                Requests waiting for review
              </p>
            </div>
          </div>

          {data?.data?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("managerLeavesPage.employee")}</TableHead>
                    <TableHead>{t("managerLeavesPage.leaveType")}</TableHead>
                    <TableHead>{t("managerLeavesPage.from")}</TableHead>
                    <TableHead>{t("managerLeavesPage.to")}</TableHead>
                    <TableHead className="text-center">
                      {t("managerLeavesPage.days")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("managerLeavesPage.status")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("managerLeavesPage.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.data.map((req) => (
                    <TableRow key={req._id}>
                      <TableCell>{req.userId?.fullName || "-"}</TableCell>
                      <TableCell>{req.leaveType?.typeKey || "-"}</TableCell>
                      <TableCell>{formatDate(req.startDate)}</TableCell>
                      <TableCell>{formatDate(req.endDate)}</TableCell>
                      <TableCell className="text-center">
                        {calculateDays(req.startDate, req.endDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-slate-500">
              {t("managerLeavesPage.noRequests")}
            </div>
          )}
        </PortalCard>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {data?.data?.length ? (
          data.data.map((req) => (
            <MobileCard key={req._id}>
              <MobileCardHeader>
                <div>
                  <MobileCardLabel>
                    {t("managerLeavesPage.employee")}
                  </MobileCardLabel>
                  <MobileCardValue>
                    {req.userId?.fullName || "-"}
                  </MobileCardValue>
                </div>
                <StatusBadge status={req.status} />
              </MobileCardHeader>

              <MobileCardContent>
                <MobileCardRow>
                  <div>
                    <MobileCardLabel>
                      {t("managerLeavesPage.leaveType")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {req.leaveType?.typeKey || "-"}
                    </MobileCardValue>
                  </div>
                </MobileCardRow>

                <MobileCardRow>
                  <div>
                    <MobileCardLabel>
                      {t("managerLeavesPage.from")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {formatDate(req.startDate)}
                    </MobileCardValue>
                  </div>
                  <div>
                    <MobileCardLabel>
                      {t("managerLeavesPage.to")}
                    </MobileCardLabel>
                    <MobileCardValue>{formatDate(req.endDate)}</MobileCardValue>
                  </div>
                </MobileCardRow>

                <MobileCardRow>
                  <div>
                    <MobileCardLabel>
                      {t("managerLeavesPage.days")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {calculateDays(req.startDate, req.endDate)}
                    </MobileCardValue>
                  </div>
                </MobileCardRow>

                <MobileCardRow>
                  <Button
                    size="sm"
                    onClick={() => setSelectedRequest(req)}
                    className="rounded-xl"
                  >
                    {t("managerLeavesPage.view")}
                  </Button>
                </MobileCardRow>
              </MobileCardContent>
            </MobileCard>
          ))
        ) : (
          <div className="px-5 py-12 text-center text-slate-500">
            {t("managerLeavesPage.noRequests")}
          </div>
        )}
      </div>

      <UnifiedPagination
        currentPage={page}
        totalPages={totalPages}
        setCurrentPage={setPage}
        perPage={isMobile ? mobileLimit : limit}
        setPerPage={isMobile ? undefined : setLimit}
        className="mt-2"
      />

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

const SummaryCard = ({ title, value }) => (
  <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </p>
  </div>
);
