import { Link } from "react-router-dom";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
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
import AddLeaveRequestModal from "./AddLeavesRequestModal";
import UnifiedPagination from "@/components/ui/pagination";
import { useMyLeaves } from "@/hooks/Leaves/useMyLeaves";
import LoadingFull from "@/components/ui/LoadingSkeleton";

const MyLeavesRequests = () => {
  const {
    requests,
    counts,
    formatDate,
    calculateDays,
    isLoading,
    isLeaveModalOpen,
    setLeaveModalOpen,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
  } = useMyLeaves();

  if (isLoading)
    return (
      <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
    );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-portal-header">
                My Leave Requests
              </h1>
              <p className="text-muted-foreground mt-1">
                View and track your leave requests
              </p>
            </div>
          </div>

          <Button onClick={() => setLeaveModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Balance" value={counts.total} />
          <SummaryCard title="Used" value={counts.used} />
          <SummaryCard title="Remaining" value={counts.remaining} />
          <SummaryCard title="Pending" value={counts.pending} />
        </div>

        {/* ===== Desktop Version ===== */}
        <div className="hidden md:block">
          <PortalCard
            title="Request History"
            icon={<FileText className="h-5 w-5" />}
          >
            {requests.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-center">Days</TableHead>
                      <TableHead className="text-center">Status</TableHead>
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
                        <TableCell className="text-center">
                          <StatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !isLoading ? (
              <EmptyState onSubmit={() => setLeaveModalOpen(true)} />
            ) : null}
          </PortalCard>
        </div>

        {/* ===== Mobile Version ===== */}
        <div className="md:hidden space-y-4">
          {requests.length > 0 ? (
            requests.map((r) => (
              <MobileCard key={r._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>Leave Type</MobileCardLabel>
                    <MobileCardValue>
                      {r.leaveType?.typeKey || "-"}
                    </MobileCardValue>
                  </div>
                  <StatusBadge status={r.status} />
                </MobileCardHeader>
                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>From</MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(r.startDate)}
                      </MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>To</MobileCardLabel>
                      <MobileCardValue>{formatDate(r.endDate)}</MobileCardValue>
                    </div>
                  </MobileCardRow>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Days</MobileCardLabel>
                      <MobileCardValue>
                        {calculateDays(r.startDate, r.endDate)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : !isLoading ? (
            <EmptyState onSubmit={() => setLeaveModalOpen(true)} />
          ) : null}
        </div>
      </div>

      <AddLeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
      />

      {/* Pagination */}

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

export default MyLeavesRequests;

/* ===== Subcomponents ===== */
const SummaryCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-card rounded-lg border border-portal-card-border p-4">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-portal-header">{value}</p>
  </div>
);

const EmptyState = ({ onSubmit }: { onSubmit: () => void }) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-portal-header mb-2">
      No requests yet
    </h3>
    <p className="text-muted-foreground mb-4">
      You haven't submitted any leave requests.
    </p>
    <Button onClick={onSubmit}>
      <FileText className="mr-2 h-4 w-4" />
      Submit Your First Request
    </Button>
  </div>
);
