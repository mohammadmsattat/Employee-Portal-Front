import { FileText } from "lucide-react";
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
import {
  MobileCard,
  MobileCardHeader,
  MobileCardContent,
  MobileCardRow,
  MobileCardLabel,
  MobileCardValue,
} from "@/components/ui/MobileCard";
import UnifiedPagination from "@/components/ui/pagination";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useMyLeaves } from "@/hooks/Leaves/useMyLeaves";

const MyLeavesPanel = () => {
  const {
    requests,
    counts,
    formatDate,
    calculateDays,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    t,
  } = useMyLeaves();

  if (isLoading) {
    return (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          title={t("myLeavesPage.totalBalance")}
          value={counts.total}
        />
        <SummaryCard title={t("myLeavesPage.used")} value={counts.used} />
        <SummaryCard
          title={t("myLeavesPage.remaining")}
          value={counts.remaining}
        />
        <SummaryCard title={t("myLeavesPage.pending")} value={counts.pending} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <PortalCard>
          <div className="mb-4 flex items-center gap-3 px-5 pt-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("myLeavesPage.history")}
              </h3>
              <p className="text-sm text-slate-500">
                Your submitted leave requests
              </p>
            </div>
          </div>

          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("myLeavesPage.leaveType")}</TableHead>
                    <TableHead>{t("myLeavesPage.from")}</TableHead>
                    <TableHead>{t("myLeavesPage.to")}</TableHead>
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
                      <TableCell>{r.leaveType?.typeKey || "-"}</TableCell>
                      <TableCell>{formatDate(r.startDate)}</TableCell>
                      <TableCell>{formatDate(r.endDate)}</TableCell>
                      <TableCell className="text-center">
                        {calculateDays(r.startDate, r.endDate)}
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
            <EmptyState t={t} />
          )}
        </PortalCard>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
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
                    <MobileCardLabel>{t("myLeavesPage.from")}</MobileCardLabel>
                    <MobileCardValue>{formatDate(r.startDate)}</MobileCardValue>
                  </div>
                  <div>
                    <MobileCardLabel>{t("myLeavesPage.to")}</MobileCardLabel>
                    <MobileCardValue>{formatDate(r.endDate)}</MobileCardValue>
                  </div>
                </MobileCardRow>

                <MobileCardRow>
                  <div>
                    <MobileCardLabel>{t("myLeavesPage.days")}</MobileCardLabel>
                    <MobileCardValue>
                      {calculateDays(r.startDate, r.endDate)}
                    </MobileCardValue>
                  </div>
                </MobileCardRow>
              </MobileCardContent>
            </MobileCard>
          ))
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
  );
};

export default MyLeavesPanel;

const SummaryCard = ({ title, value }) => (
  <div className="rounded-[24px] border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </p>
  </div>
);

const EmptyState = ({ t }) => (
  <div className="px-5 py-12 text-center">
    <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
    <h3 className="mb-2 text-lg font-semibold text-slate-900">
      {t("myLeavesPage.noRequests")}
    </h3>
    <p className="mx-auto max-w-md text-sm text-slate-500">
      {t("myLeavesPage.noRequestsDesc")}
    </p>
  </div>
);
