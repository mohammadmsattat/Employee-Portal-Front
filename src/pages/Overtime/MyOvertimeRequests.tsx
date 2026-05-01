import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Plus,
  TimerReset,
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
import AddOvertimeRequestModal from "./RequestOvertimeModal";
import FormatTime from "@/lib/FormatTime";
import { useMyOvertimes } from "@/hooks/Overtime/useMyOvertimes";
import UnifiedPagination from "@/components/ui/pagination";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import type { TFunction } from "i18next";

type RequestStatus = "" | "pending" | "approved" | "rejected";

interface MyOvertimeRequestsProps {
  embedded?: boolean;
}

const MyOvertimeRequests = ({ embedded = false }: MyOvertimeRequestsProps) => {
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
    statusFilter,
    setStatusFilter,
    totalPages,
    t,
  } = useMyOvertimes();

  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);

  const statusOptions: Array<{ value: RequestStatus; label: string }> = [
    { value: "", label: "All" },
    { value: "pending", label: t("myOvertimeRequestsPage.pending") },
    { value: "approved", label: t("myOvertimeRequestsPage.approved") },
    { value: "rejected", label: t("myOvertimeRequestsPage.rejected") },
  ];

  const openModal = () => setOvertimeModalOpen(true);
  const closeModal = () => setOvertimeModalOpen(false);

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
                className="rounded-2xl hidden md:block"
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {t("myOvertimeRequestsPage.title")}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {t("myOvertimeRequestsPage.subtitle")}
                </p>
              </div>
            </div>

            <Button
              onClick={openModal}
              className="h-11 rounded-2xl bg-blue-600 px-5 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {t("buttons.newOvertimeRequest")}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard
            title={t("myOvertimeRequestsPage.totalHours")}
            value={counts.total?.toFixed(2)}
          />
          <SummaryCard
            title={t("myOvertimeRequestsPage.approved")}
            value={counts.approved?.toFixed(2)}
          />
          <SummaryCard
            title={t("myOvertimeRequestsPage.pending")}
            value={counts.pending?.toFixed(2)}
          />
          <SummaryCard
            title={t("myOvertimeRequestsPage.rejected")}
            value={counts.rejected?.toFixed(2)}
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t("myOvertimeRequestsPage.history")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("myOvertimeRequestsPage.subtitle")}
                </p>
              </div>
            </div>

            {requests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("overtimeModal.overtimeType")}</TableHead>
                      <TableHead>{t("overtimeModal.workDate")}</TableHead>
                      <TableHead>{t("overtimeModal.startTime")}</TableHead>
                      <TableHead>{t("overtimeModal.endTime")}</TableHead>
                      <TableHead className="text-center">
                        {t("overtimeModal.hours")}
                      </TableHead>
                      <TableHead className="text-end">
                        {t("homePage.status")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          {request.overtimeTypeId?.typeKey || "-"}
                        </TableCell>
                        <TableCell>{FormatTime(request.workDate)}</TableCell>
                        <TableCell>
                          {FormatTime(request.startTime, true)}
                        </TableCell>
                        <TableCell>
                          {FormatTime(request.endTime, true)}
                        </TableCell>
                        <TableCell className="text-center">
                          {request.hours?.toFixed(2) ?? "-"}
                        </TableCell>
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
                  className="overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <TimerReset className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight">
                          {request.overtimeTypeId?.typeKey || "-"}
                        </MobileCardValue>
                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {FormatTime(request.workDate)}
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
                          label={t("overtimeModal.workDate")}
                          value={FormatTime(request.workDate)}
                        />
                        <InfoTile
                          label={t("overtimeModal.hours")}
                          value={request.hours?.toFixed(2) ?? "-"}
                          icon={<Clock3 className="h-4 w-4 text-slate-400" />}
                        />
                      </MobileCardRow>

                      <MobileCardRow className="grid-cols-2">
                        <InfoTile
                          label={t("overtimeModal.startTime")}
                          value={FormatTime(request.startTime, true)}
                        />
                        <InfoTile
                          label={t("overtimeModal.endTime")}
                          value={FormatTime(request.endTime, true)}
                        />
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

      {!embedded && isOvertimeModalOpen && (
        <AddOvertimeRequestModal
          isOpen={isOvertimeModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );

  return embedded ? content : <Layout>{content}</Layout>;
};

export default MyOvertimeRequests;

const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
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
  <div className="rounded-[22px] border border-slate-200/70 bg-slate-50 p-1">
    <div className="grid grid-cols-4 gap-1">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-10 rounded-[18px] px-2 text-xs font-semibold transition sm:text-sm ${
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
  icon,
  label,
  value,
}: {
  icon?: JSX.Element;
  label: string;
  value: string | number;
}) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <MobileCardLabel>{label}</MobileCardLabel>
    <MobileCardValue className="mt-1 flex items-center gap-1.5">
      {icon}
      <span>{value}</span>
    </MobileCardValue>
  </div>
);

const EmptyState = ({ t }: { t: TFunction }) => (
  <div className="px-5 py-12 text-center">
    <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
    <h3 className="mb-2 text-lg font-semibold text-slate-900">
      {t("myOvertimeRequestsPage.noRequests")}
    </h3>
    <p className="mx-auto mb-4 max-w-md text-sm text-slate-500">
      {t("myOvertimeRequestsPage.noRequestsDesc")}
    </p>
  </div>
);
