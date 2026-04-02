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
    t,
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
                {t("myOvertimeRequestsPage.title")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("myOvertimeRequestsPage.subtitle")}
              </p>
            </div>
          </div>

          <Button onClick={() => openModal(null)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("buttons.newOvertimeRequest")}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title={t("myOvertimeRequestsPage.totalHours")} value={counts.total} />
          <SummaryCard title={t("myOvertimeRequestsPage.approved")} value={counts.approved} />
          <SummaryCard title={t("myOvertimeRequestsPage.pending")} value={counts.pending} />
          <SummaryCard title={t("myOvertimeRequestsPage.rejected")} value={counts.rejected} />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <PortalCard
            title={t("myOvertimeRequestsPage.history")}
            icon={<FileText className="h-5 w-5" />}
          >
            {requests.length > 0 ? (
              <div className="overflow-x-auto -mx-5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("overtimeModal.overtimeType")}</TableHead>
                      <TableHead>{t("overtimeModal.workDate")}</TableHead>
                      <TableHead>{t("overtimeModal.startTime")}</TableHead>
                      <TableHead>{t("overtimeModal.endTime")}</TableHead>
                      <TableHead className="text-center">{t("overtimeModal.hours")}</TableHead>
                      <TableHead className="text-center">{t("homePage.status")}</TableHead>
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
              <EmptyState onSubmit={() => openModal(null)} t={t} />
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
                    <MobileCardLabel>{t("overtimeModal.overtimeType")}</MobileCardLabel>
                    <MobileCardValue>{r.overtimeTypeId?.typeKey || "-"}</MobileCardValue>
                  </div>
                  <StatusBadge status={r.status} />
                </MobileCardHeader>
                <MobileCardContent>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>{t("overtimeModal.workDate")}</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.workDate)}</MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>{t("overtimeModal.hours")}</MobileCardLabel>
                      <MobileCardValue>{r.hours}</MobileCardValue>
                    </div>
                  </MobileCardRow>
                  <MobileCardRow>
                    <div>
                      <MobileCardLabel>{t("overtimeModal.startTime")}</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.startTime, true)}</MobileCardValue>
                    </div>
                    <div>
                      <MobileCardLabel>{t("overtimeModal.endTime")}</MobileCardLabel>
                      <MobileCardValue>{FormatTime(r.endTime, true)}</MobileCardValue>
                    </div>
                  </MobileCardRow>
                </MobileCardContent>
              </MobileCard>
            ))
          ) : !isLoading ? (
            <EmptyState onSubmit={() => openModal(null)} t={t} />
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
        <AddOvertimeRequestModal
          isOpen={isOvertimeModalOpen}
          onClose={closeModal}
        />
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

const EmptyState = ({ onSubmit, t }: { onSubmit: () => void; t: any }) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-portal-header mb-2">
      {t("myOvertimeRequestsPage.noRequests")}
    </h3>
    <p className="text-muted-foreground mb-4">
      {t("myOvertimeRequestsPage.noRequestsDesc")}
    </p>
    <Button onClick={onSubmit}>
      <FileText className="mr-2 h-4 w-4" />
      {t("myOvertimeRequestsPage.submitFirst")}
    </Button>
  </div>
);