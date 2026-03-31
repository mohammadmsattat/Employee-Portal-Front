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
    leaveTypeFilter,
    setLeaveTypeFilter,
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
  } = useManagerLeaves();

  const formatDate = (date: string) => format(new Date(date), "PPP");

  if (isLoading)
    return (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-portal-header">
            Team Leave Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage leave requests from your team
          </p>
        </div>

        {/* ===== Filters ===== */}
        <PortalCard title="Filters" icon={<Search className="h-5 w-5" />}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between flex-wrap">
            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[200px]">
              <label className="text-xs text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[120px]">
              <label className="text-xs text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[140px]">
              <label className="text-xs text-muted-foreground">From</label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 w-full md:flex-1 md:min-w-[140px]">
              <label className="text-xs text-muted-foreground">To</label>
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
                <X className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </PortalCard>

        {/* ===== Desktop Requests ===== */}
        <div className="hidden md:block">
          <PortalCard
            title="Requests History"
            icon={<FileText className="h-5 w-5" />}
          >
            {data?.data?.length ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-center">Days</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((req) => (
                      <TableRow key={req._id} className="hover:bg-gray-50">
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
                No leave requests found
              </div>
            )}
          </PortalCard>
        </div>

        {/* ===== Mobile Requests ===== */}
        <div className="md:hidden space-y-4">
          {data?.data?.length ? (
            data.data.map((req) => (
              <MobileCard key={req._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>Employee</MobileCardLabel>
                    <MobileCardValue>
                      {req.userId?.fullName || "-"}
                    </MobileCardValue>
                  </div>
                  <StatusBadge status={req.status} />
                </MobileCardHeader>

                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Leave Type</MobileCardLabel>
                      <MobileCardValue>
                        {req.leaveType?.typeKey || "-"}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>From</MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(req.startDate)}
                      </MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>To</MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(req.endDate)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Days</MobileCardLabel>
                      <MobileCardValue>
                        {calculateDays(req.startDate, req.endDate)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setSelectedRequest(req)}>
                        View
                      </Button>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No leave requests found
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
