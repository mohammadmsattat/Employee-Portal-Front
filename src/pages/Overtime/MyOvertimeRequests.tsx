import { useState } from "react";
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
import AddOvertimeRequestModal from "./RequestOvertimeModal";
import FormatTime from "@/lib/FormatTime";
import { useMyOvertimes } from "@/hooks/Overtime/useMyOvertimes";
import UnifiedPagination from "@/components/ui/pagination";

const MyOvertimeRequests = () => {
  const {
    requests,
    counts,
    isLoading,
    isOvertimeModalOpen,
    setOvertimeModalOpen,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
  } = useMyOvertimes();


  const openModal = (request = null) => {
    setOvertimeModalOpen(true);
  };

  const closeModal = () => {
    setOvertimeModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-portal-header">
                My Overtime Requests
              </h1>
              <p className="text-muted-foreground mt-1">
                View and track your overtime requests
              </p>
            </div>
          </div>

          <Button onClick={() => openModal(null)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Hours" value={counts.total} />
          <SummaryCard title="Approved" value={counts.approved} />
          <SummaryCard title="Pending" value={counts.pending} />
          <SummaryCard title="Rejected" value={counts.rejected} />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <PortalCard title="Request History" icon={<FileText className="h-5 w-5" />}>
            {requests.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Overtime Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead className="text-center">Hours</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.overtimeTypeId?.typeKey || "-"}</TableCell>
                        <TableCell>{FormatTime(r.workDate)}</TableCell>
                        <TableCell>{FormatTime(r.startTime, true)}</TableCell>
                        <TableCell>{FormatTime(r.endTime, true)}</TableCell>
                        <TableCell className="text-center">{r.hours}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !isLoading ? (
              <EmptyState onSubmit={() => openModal(null)} />
            ) : null}
          </PortalCard>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {requests.length > 0 ? (
            requests.map((r) => (
              <MobileCard key={r._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>Overtime Type</MobileCardLabel>
                    <MobileCardValue>{r.overtimeTypeId?.typeKey || "-"}</MobileCardValue>
                  </div>
                  <StatusBadge status={r.status} />
                </MobileCardHeader>
                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Date</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.workDate)}</MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>Hours</MobileCardLabel>
                      <MobileCardValue>{r.hours}</MobileCardValue>
                    </div>
                  </MobileCardRow>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>Start Time</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.startTime, true)}</MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>End Time</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.endTime, true)}</MobileCardValue>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : !isLoading ? (
            <EmptyState onSubmit={() => openModal(null)} />
          ) : null}
        </div>

        {/* Pagination */}
        <UnifiedPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
          perPage={limit}
          setPerPage={setLimit}
          className="mt-4"
        />
      </div>

      {isOvertimeModalOpen && (
        <AddOvertimeRequestModal isOpen={isOvertimeModalOpen} onClose={closeModal} />
      )}
    </Layout>
  );
};

export default MyOvertimeRequests;

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
    <h3 className="text-lg font-medium text-portal-header mb-2">No requests yet</h3>
    <p className="text-muted-foreground mb-4">
      You haven't submitted any overtime requests.
    </p>
    <Button onClick={onSubmit}>
      <FileText className="mr-2 h-4 w-4" />
      Submit Your First Request
    </Button>
  </div>
);