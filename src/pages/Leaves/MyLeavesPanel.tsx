// components/MyLeavesPanel.tsx
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Plus,
  Minus,
  Eye,
} from "lucide-react";
import { useState, useMemo } from "react";
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
import LoadingFull from "@/components/ui/LoadingSkeleton";
import { useMyLeaves } from "@/hooks/Leaves/useMyLeaves";
import { Button } from "@/components/ui/button";
import LeaveRequestModal from "./LeaveRequestModal";
import LeaveRequestViewModal from "./LeaveRequestViewModal";

const MyLeavesPanel = () => {
  const [expandedMobileCardId, setExpandedMobileCardId] = useState<
    string | null
  >(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const {
    requests,
    counts,
    leaveBalances,
    formatDate,
    calculateDays,
    isLoading,
    t,
  } = useMyLeaves();

  // ============= Group Requests by Leave Type =============
  const groupedRequests = useMemo(() => {
    const groups: Record<string, typeof requests> = {};

    requests.forEach((request) => {
      const typeKey = request.leaveType?.typeKey || "Other";
      if (!groups[typeKey]) {
        groups[typeKey] = [];
      }
      groups[typeKey].push(request);
    });

    return groups;
  }, [requests]);

  // ============= Get Status Icon =============
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5 text-rose-500" />;
      case "pending":
        return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  // ============= Get Status Badge Color =============
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ============= Get Type Icon =============
  const getTypeIcon = (typeKey: string) => {
    const type = typeKey.toLowerCase();
    if (type.includes("annual") || type.includes("سنوية")) {
      return <Calendar className="h-3.5 w-3.5" />;
    }
    if (type.includes("sick") || type.includes("مرضية")) {
      return <AlertCircle className="h-3.5 w-3.5" />;
    }
    if (type.includes("personal") || type.includes("شخصية")) {
      return <User className="h-3.5 w-3.5" />;
    }
    return <FileText className="h-3.5 w-3.5" />;
  };

  if (isLoading) {
    return (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard
            title={t("myLeavesPage.totalBalance")}
            value={counts.total}
            icon={<FileText className="h-4 w-4 text-blue-500" />}
            bordered
          />
          <SummaryCard
            title={t("myLeavesPage.used")}
            value={counts.used}
            icon={<Clock3 className="h-4 w-4 text-amber-500" />}
          />
          <SummaryCard
            title={t("myLeavesPage.remaining")}
            value={counts.remaining}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          />
          <SummaryCard
            title={t("myLeavesPage.pending")}
            value={counts.pending}
            icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
          />
        </div>

        {/* Desktop View - Accordion Cards */}
        <div className="hidden md:block">
          <PortalCard className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {t("myLeavesPage.history")}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {requests.length}{" "}
                    {requests.length === 1 ? "request" : "requests"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  {Object.keys(groupedRequests).length} types
                </span>
              </div>
            </div>

            {requests.length > 0 ? (
              <div className="p-4 space-y-4">
                {Object.entries(groupedRequests).map(
                  ([typeKey, typeRequests]) => {
                    const isExpanded = expandedType === typeKey;
                    const pendingCount = typeRequests.filter(
                      (r) => r.status === "pending",
                    ).length;
                    const approvedCount = typeRequests.filter(
                      (r) => r.status === "approved",
                    ).length;
                    const rejectedCount = typeRequests.filter(
                      (r) => r.status === "rejected",
                    ).length;

                    return (
                      <div
                        key={typeKey}
                        className="rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      >
                        <button
                          onClick={() =>
                            setExpandedType(isExpanded ? null : typeKey)
                          }
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-1 ring-blue-100">
                              {getTypeIcon(typeKey)}
                            </div>
                            <div className="text-left">
                              <h4 className="text-base font-semibold text-slate-800">
                                {typeKey}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">
                                  {typeRequests.length}{" "}
                                  {typeRequests.length === 1
                                    ? "request"
                                    : "requests"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {pendingCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs">
                                  <AlertCircle className="h-2.5 w-2.5" />
                                  {pendingCount}
                                </span>
                              )}
                              {approvedCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  {approvedCount}
                                </span>
                              )}
                              {rejectedCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs">
                                  <XCircle className="h-2.5 w-2.5" />
                                  {rejectedCount}
                                </span>
                              )}
                            </div>

                            <div
                              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            >
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/30 p-4 space-y-2">
                            {typeRequests.map((r) => (
                              <div
                                key={r._id}
                                className="flex items-center justify-between rounded-lg bg-white p-3 border border-slate-200/60 hover:border-blue-200 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>{formatDate(r.startDate)}</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                                    <span>{formatDate(r.endDate)}</span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                    <Clock3 className="h-3 w-3" />
                                    {r.days} {r.days === 1 ? "day" : "days"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${getStatusColor(r.status)}`}
                                  >
                                    {getStatusIcon(r.status)}
                                    {r.status.charAt(0).toUpperCase() +
                                      r.status.slice(1)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRequest(r);
                                    }}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <EmptyState t={t} />
            )}
          </PortalCard>
        </div>

        {/* Mobile View */}
        <div className="space-y-3 md:hidden">
          {requests.length > 0 ? (
            Object.entries(groupedRequests).map(([typeKey, typeRequests]) => {
              const isExpanded = expandedType === typeKey;

              return (
                <div
                  key={typeKey}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() => setExpandedType(isExpanded ? null : typeKey)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {getTypeIcon(typeKey)}
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-slate-800">
                          {typeKey}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {typeRequests.length} requests
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/30 p-3 space-y-2">
                      {typeRequests.map((r) => (
                        <div
                          key={r._id}
                          className="rounded-lg bg-white p-3 border border-slate-200/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{formatDate(r.startDate)}</span>
                              <ArrowRight className="h-3 w-3 text-slate-300" />
                              <span>{formatDate(r.endDate)}</span>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${getStatusColor(r.status)}`}
                            >
                              {getStatusIcon(r.status)}
                              {r.status.charAt(0).toUpperCase() +
                                r.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              <span>
                                {r.days} {r.days === 1 ? "day" : "days"}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(r);
                              }}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <EmptyState t={t} />
          )}
        </div>
      </div>
      
      {selectedRequest && (
        <LeaveRequestViewModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default MyLeavesPanel;

// ============= Summary Card Component =============
const SummaryCard = ({
  title,
  value,
  icon,
  color = "blue",
  bordered = false,
}: {
  title: string;
  value: number;
  icon?: ReactNode;
  color?: "blue" | "amber" | "emerald" | "rose";
  bordered?: boolean;
}) => {
  const colorMap = {
    blue: "border-l-blue-700",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    rose: "border-l-rose-500",
  };

  return (
    <div
      className={`rounded-lg border border-slate-200 ${bordered ? `border-l-4 ${colorMap[color]}` : ""} bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
};

// ============= Empty State Component =============
const EmptyState = ({ t }: { t: any }) => (
  <div className="px-5 py-12 text-center">
    <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
    <h3 className="mb-2 text-lg font-semibold text-slate-900">
      {t("myLeavesPage.noRequests")}
    </h3>
    <p className="mx-auto max-w-md text-sm text-slate-500">
      {t("myLeavesPage.noRequestsMatchFilters")}
    </p>
  </div>
);
