import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  HandCoins,
  Plus,
} from "lucide-react";
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
import LoadingFull from "@/components/ui/LoadingSkeleton";
import type { TFunction } from "i18next";

type RequestStatus = "" | "pending" | "approved" | "rejected";

interface MyAdvanceRequestsProps {
  embedded?: boolean;
}

const MyAdvanceRequests = ({ embedded = false }: MyAdvanceRequestsProps) => {
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
    statusFilter,
    setStatusFilter,
    totalPages,
    t,
  } = useMyAdvanceRequests();

  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

  const statusOptions: Array<{ value: RequestStatus; label: string }> = [
    { value: "", label: "All" },
    { value: "pending", label: t("myAdvanceRequestsPage.pending") },
    { value: "approved", label: t("myAdvanceRequestsPage.approved") },
    { value: "rejected", label: t("myAdvanceRequestsPage.rejected") },
  ];

  if (isLoading) {
    const loader = (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );

    return embedded ? loader : <Layout>{loader}</Layout>;
  }

  const content = (
    <>
      <div className="space-y-6">
        {!embedded && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-lg hidden md:block"
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {t("myAdvanceRequestsPage.title")}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {t("myAdvanceRequestsPage.subtitle")}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setModalOpen(true)}
              className="h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {t("myAdvanceRequestsPage.newRequest")}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

        <StatusFilter
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="hidden md:block">
          <PortalCard>
            <div className="mb-4 flex items-center gap-3 px-5 pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t("myAdvanceRequestsPage.history")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("myAdvanceRequestsPage.subtitle")}
                </p>
              </div>
            </div>

            {requests.length > 0 ? (
              <div className="overflow-x-auto">
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
                      <TableHead className="text-end">
                        {t("myAdvanceRequestsPage.status")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          {request.advanceTypeId?.typeKey || "-"}
                        </TableCell>
                        <TableCell>{request.amount ?? "-"}</TableCell>
                        <TableCell>{request.installments || "-"}</TableCell>
                        <TableCell>{FormatTime(request.createdAt)}</TableCell>
                        <TableCell className="text-end">
                          <StatusBadge status={request.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState t={t} />
            )}
          </PortalCard>
        </div>

        <div className="space-y-3 md:hidden">
          {requests.length > 0 ? (
            requests.map((request) => {
              const isExpanded = expandedMobileCardId === request._id;

              return (
                <MobileCard
                  key={request._id}
                  compact
                  interactive
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedMobileCardId(isExpanded ? null : request._id)
                  }
                  className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-white px-4 py-3 border-l-4 border-l-blue-600"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <HandCoins className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight">
                          {request.advanceTypeId?.typeKey || "-"}
                        </MobileCardValue>
                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                          <span className="truncate">
                            {t("myAdvanceRequestsPage.amount")}:{" "}
                            {request.amount ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={request.status} />
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
                          label={t("myAdvanceRequestsPage.amount")}
                          value={request.amount ?? "-"}
                        />
                        <InfoTile
                          label={t("myAdvanceRequestsPage.installments")}
                          value={request.installments || "-"}
                        />
                      </MobileCardRow>

                      <MobileCardRow className="grid-cols-2">
                        <InfoTile
                          label={t("myAdvanceRequestsPage.createdAt")}
                          value={FormatTime(request.createdAt)}
                        />
                        <div className="rounded-md bg-slate-50 p-3">
                          <MobileCardLabel>
                            {t("myAdvanceRequestsPage.status")}
                          </MobileCardLabel>
                          <div className="mt-2">
                            <StatusBadge status={request.status} />
                          </div>
                        </div>
                      </MobileCardRow>
                    </MobileCardContent>
                  )}
                </MobileCard>
              );
            })
          ) : (
            <EmptyState t={t} />
          )}
        </div>

        <UnifiedPagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
          perPage={limit}
          setPerPage={setLimit}
          className="mt-2"
        />
      </div>

      {!embedded && isModalOpen && (
        <AddAdvanceRequestModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );

  return embedded ? content : <Layout>{content}</Layout>;
};

export default MyAdvanceRequests;

const SummaryCard = ({ title, value }: { title: string; value: number }) => (
  <div className="rounded-lg border border-slate-200 border-l-4 border-l-blue-600 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </p>
  </div>
);

const StatusFilter = ({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: RequestStatus; label: string }>;
  value: RequestStatus;
  onChange: (value: RequestStatus) => void;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
    <div className="grid grid-cols-4 gap-1">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-10 rounded-md px-2 text-xs font-semibold transition sm:text-sm ${
              isActive
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

const InfoTile = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-md bg-slate-50 p-3">
    <MobileCardLabel>{label}</MobileCardLabel>
    <MobileCardValue className="mt-1">{value}</MobileCardValue>
  </div>
);

const EmptyState = ({ t }: { t: TFunction }) => (
  <div className="px-5 py-12 text-center">
    <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
    <h3 className="mb-2 text-lg font-semibold text-slate-900">
      {t("myAdvanceRequestsPage.noRequests")}
    </h3>
    <p className="mx-auto mb-4 max-w-md text-sm text-slate-500">
      {t("myAdvanceRequestsPage.noRequestsDesc")}
    </p>
  </div>
);


