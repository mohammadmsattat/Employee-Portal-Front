import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FileText, Search, X, Eye } from "lucide-react";
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

const ManagerOvertimeRequests = () => {
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
  } = useManagerOvertimeRequests();

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "PPP");
  };

  if (isLoading)
    return (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-portal-header">
            Team Overtime Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage overtime requests from your team
          </p>
        </div>

        <PortalCard title="Filters" icon={<Search className="h-5 w-5" />}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
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

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </PortalCard>

        <div className="hidden md:block">
          <PortalCard
            title="Overtime Requests History"
            icon={<FileText className="h-5 w-5" />}
          >
            {data?.data?.length ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((req: any) => (
                      <TableRow key={req._id} className="hover:bg-gray-50">
                        <TableCell>{req.userId?.fullName || "-"}</TableCell>
                        <TableCell>
                          {formatDate(req.workDate || req.createdAt)}
                        </TableCell>
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
                No overtime requests found
              </div>
            )}
          </PortalCard>
        </div>

        <div className="md:hidden space-y-4">
          {data?.data?.length ? (
            data.data.map((req: any) => (
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
                      <MobileCardLabel>Date</MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(req.workDate || req.createdAt)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Hours</MobileCardLabel>
                      <MobileCardValue>{req.hours || "-"}</MobileCardValue>
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
              No overtime requests found
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
    </Layout>
  );
};

export default ManagerOvertimeRequests;
