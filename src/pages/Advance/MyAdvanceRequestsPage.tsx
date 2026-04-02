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
import { useMyAdvanceRequests } from "@/hooks/Advance/useMyAdvanceRequests";
import AddAdvanceRequestModal from "./AddAdvanceRequestModal";
import FormatTime from "@/lib/FormatTime";
import UnifiedPagination from "@/components/ui/pagination";

const MyAdvanceRequests = () => {
  const {
    requests,
    isLoading,
    totalAmount,
    approvedAmount,
    pendingCount,
    rejectedCount,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    t,
  } = useMyAdvanceRequests();

  const [isModalOpen, setModalOpen] = useState(false);

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
                {t("myAdvanceRequestsPage.title")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("myAdvanceRequestsPage.subtitle")}
              </p>
            </div>
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("myAdvanceRequestsPage.newRequest")}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            title={t("myAdvanceRequestsPage.totalAmount")}
            value={totalAmount}
          />
          <SummaryCard
            title={t("myAdvanceRequestsPage.approved")}
            value={approvedAmount}
          />
          <SummaryCard
            title={t("myAdvanceRequestsPage.pending")}
            value={pendingCount}
          />
          <SummaryCard
            title={t("myAdvanceRequestsPage.rejected")}
            value={rejectedCount}
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <PortalCard
            title={t("myAdvanceRequestsPage.history")}
            icon={<FileText className="h-5 w-5" />}
          >
            {requests.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("myAdvanceRequestsPage.type")}</TableHead>
                      <TableHead>{t("myAdvanceRequestsPage.amount")}</TableHead>
                      <TableHead>
                        {t("myAdvanceRequestsPage.installments")}
                      </TableHead>
                      <TableHead>
                        {t("myAdvanceRequestsPage.createdAt")}
                      </TableHead>
                      <TableHead>{t("myAdvanceRequestsPage.status")}</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {requests.map((r: any) => (
                      <TableRow key={r._id}>
                        <TableCell>{r.advanceTypeId?.typeKey || "-"}</TableCell>
                        <TableCell>{r.amount}</TableCell>
                        <TableCell>{r.installments || "-"}</TableCell>
                        <TableCell>{FormatTime(r.createdAt)}</TableCell>
                        <TableCell>
                          <StatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !isLoading ? (
              <EmptyState onSubmit={() => setModalOpen(true)} t={t} />
            ) : null}
          </PortalCard>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {requests.length > 0 ? (
            requests.map((r: any) => (
              <MobileCard key={r._id}>
                <MobileCardHeader>
                  <div>
                    <MobileCardLabel>
                      {t("myAdvanceRequestsPage.type")}
                    </MobileCardLabel>
                    <MobileCardValue>
                      {r.advanceTypeId?.typeKey || "-"}
                    </MobileCardValue>
                  </div>

                  <StatusBadge status={r.status} />
                </MobileCardHeader>

                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("myAdvanceRequestsPage.amount")}
                      </MobileCardLabel>
                      <MobileCardValue>{r.amount}</MobileCardValue>
                    </div>

                    <div>
                      <MobileCardLabel>
                        {t("myAdvanceRequestsPage.installments")}
                      </MobileCardLabel>
                      <MobileCardValue>{r.installments || "-"}</MobileCardValue>
                    </div>
                  </MobileCardRow>

                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>
                        {t("myAdvanceRequestsPage.createdAt")}
                      </MobileCardLabel>
                      <MobileCardValue>
                        {FormatTime(r.createdAt)}
                      </MobileCardValue>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : !isLoading ? (
            <EmptyState onSubmit={() => setModalOpen(true)} t={t} />
          ) : null}
        </div>
      </div>

      {isModalOpen && (
        <AddAdvanceRequestModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

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

export default MyAdvanceRequests;

/* ===== Subcomponents ===== */
const SummaryCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-card rounded-lg border border-portal-card-border p-4">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-portal-header">{value}</p>
  </div>
);

const EmptyState = ({ onSubmit, t }: { onSubmit: () => void; t: any }) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-portal-header mb-2">
      {t("myAdvanceRequestsPage.noRequests")}
    </h3>
    <p className="text-muted-foreground mb-4">
      {t("myAdvanceRequestsPage.noRequestsDesc")}
    </p>
    <Button onClick={onSubmit}>
      <FileText className="mr-2 h-4 w-4" />
      {t("myAdvanceRequestsPage.submitFirst")}
    </Button>
  </div>
);