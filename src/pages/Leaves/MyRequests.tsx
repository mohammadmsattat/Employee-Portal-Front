import { Plus, FileText } from "lucide-react";
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
    t,
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
          <div className="text-start">
            <h1 className="text-2xl font-bold text-portal-header">
              {t("myLeavesPage.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("myLeavesPage.subtitle")}
            </p>
          </div>

          <Button onClick={() => setLeaveModalOpen(true)}>
            <Plus className="me-2 h-4 w-4" />
            {t("myLeavesPage.newRequest")}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            title={t("myLeavesPage.totalBalance")}
            value={counts.total}
          />
          <SummaryCard title={t("myLeavesPage.used")} value={counts.used} />
          <SummaryCard
            title={t("myLeavesPage.remaining")}
            value={counts.remaining}
          />
          <SummaryCard
            title={t("myLeavesPage.pending")}
            value={counts.pending}
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <PortalCard
            title={t("myLeavesPage.history")}
            icon={<FileText className="h-5 w-5" />}
          >
            {requests.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">
                        {t("myLeavesPage.leaveType")}
                      </TableHead>
                      <TableHead className="text-start">
                        {t("myLeavesPage.from")}
                      </TableHead>
                      <TableHead className="text-start">
                        {t("myLeavesPage.to")}
                      </TableHead>
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
                        <TableCell className="text-start">
                          {r.leaveType?.typeKey || "-"}
                        </TableCell>
                        <TableCell>{formatDate(r.startDate)}0</TableCell>
                        <TableCell>{formatDate(r.endDate)}</TableCell>
                        <TableCell className="text-center">
                          {calculateDays(r.startDate, r.endDate)}0
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
              <EmptyState t={t} onSubmit={() => setLeaveModalOpen(true)} />
            )}
          </PortalCard>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {requests.length > 0 ? (
            requests.map((r) => (
              <MobileCard key={r._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>
                      {t("myLeavesPage.leaveType")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {r.leaveType?.typeKey || "-"}
                    </MobileCardValue>
                  </div>
                  <StatusBadge status={r.status} />
                </MobileCardHeader>

                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("myLeavesPage.from")}
                      </MobileCardLabel>
                      <MobileCardValue>
                        {formatDate(r.startDate)}
                      </MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>{t("myLeavesPage.to")}</MobileCardLabel>
                      <MobileCardValue>{formatDate(r.endDate)}</MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("myLeavesPage.days")}
                      </MobileCardLabel>
                      <MobileCardValue>
                        {calculateDays(r.startDate, r.endDate)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : (
            <EmptyState t={t} onSubmit={() => setLeaveModalOpen(true)} />
          )}
        </div>
      </div>

      <AddLeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
      />

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

/* Subcomponents */

const SummaryCard = ({ title, value }) => (
  <div className="bg-card rounded-lg border p-4">
    <p className="text-sm text-muted-foreground text-start">{title}</p>
    <p className="text-2xl font-bold text-portal-header">{value}</p>
  </div>
);

const EmptyState = ({ onSubmit, t }) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-portal-header mb-2">
      {t("myLeavesPage.noRequests")}
    </h3>
    <p className="text-muted-foreground mb-4">
      {t("myLeavesPage.noRequestsDesc")}
    </p>
    <Button onClick={onSubmit}>
      <FileText className="me-2 h-4 w-4" />
      {t("myLeavesPage.submitFirst")}
    </Button>
  </div>
);
