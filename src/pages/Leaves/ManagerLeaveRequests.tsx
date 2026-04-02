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
import { FileText, Search, X, Eye } from "lucide-react";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import LeaveRequestModal from "./LeaveRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import { useManagerLeaves } from "@/hooks/Leaves/useManagerLeaves";
import { format } from "date-fns";

const ManagerLeaveRequests = () => {
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

  if (isLoading)
    return (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-start">
          <h1 className="text-2xl font-bold text-portal-header">
            {t("managerLeavesPage.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("managerLeavesPage.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <PortalCard
          title={t("managerLeavesPage.filters")}
          icon={<Search className="h-5 w-5" />}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between flex-wrap">
            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[200px]">
              <label className="text-xs text-muted-foreground">
                {t("managerLeavesPage.search")}
              </label>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("managerLeavesPage.searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[120px]">
              <label className="text-xs text-muted-foreground">
                {t("managerLeavesPage.status")}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
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

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[140px]">
              <label className="text-xs text-muted-foreground">
                {t("managerLeavesPage.from")}
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[140px]">
              <label className="text-xs text-muted-foreground">
                {t("managerLeavesPage.to")}
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="w-full flex justify-end md:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1 w-full md:w-auto"
              >
                <X className="h-4 w-4" />
                {t("managerLeavesPage.reset")}
              </Button>
            </div>
          </div>
        </PortalCard>

        {/* Desktop */}
        <div className="hidden md:block">
          <PortalCard
            title={t("managerLeavesPage.history")}
            icon={<FileText className="h-5 w-5" />}
          >
            {data?.data?.length ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">
                        {t("managerLeavesPage.employee")}
                      </TableHead>
                      <TableHead className="text-start">
                        {t("managerLeavesPage.leaveType")}
                      </TableHead>
                      <TableHead className="text-start">
                        {t("managerLeavesPage.from")}
                      </TableHead>
                      <TableHead className="text-start">
                        {t("managerLeavesPage.to")}
                      </TableHead>
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
                        <TableCell className="text-start">
                          {req.userId?.fullName || "-"}
                        </TableCell>
                        <TableCell className="text-start">
                          {req.leaveType?.typeKey || "-"}
                        </TableCell>
                        <TableCell className="text-start">
                          {formatDate(req.startDate)}
                        </TableCell>
                        <TableCell className="text-start">
                          {formatDate(req.endDate)}
                        </TableCell>
                        <TableCell className="text-center">
                          {calculateDays(req.startDate, req.endDate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center justify-center h-full space-y-1">
                            <Eye
                              className="w-5 h-5 cursor-pointer"
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
                {t("managerLeavesPage.noRequests")}
              </div>
            )}
          </PortalCard>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
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
                      <MobileCardValue>
                        {formatDate(req.endDate)}
                      </MobileCardValue>
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
                    <Button size="sm" onClick={() => setSelectedRequest(req)}>
                      {t("managerLeavesPage.view")}
                    </Button>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              {t("managerLeavesPage.noRequests")}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <LeaveRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          submitting={updating}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <UnifiedPagination
        currentPage={page}
        totalPages={totalPages}
        setCurrentPage={setPage}
        perPage={isMobile ? mobileLimit : limit}
        setPerPage={isMobile ? undefined : setLimit}
        className="mt-4"
      />
    </Layout>
  );
};

export default ManagerLeaveRequests;
