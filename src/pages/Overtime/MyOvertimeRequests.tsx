import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Plus,
  TimerReset,
  Calendar,
  Filter,
  X,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Minus,
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
import { cn } from "@/lib/utils";

type RequestStatus = "" | "pending" | "approved" | "rejected";

interface MyOvertimeRequestsProps {
  embedded?: boolean;
}

// ============= Main Component =============
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

  // ============= Filter States =============
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<"week" | "month" | "custom">(
    "month",
  );
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ============= استخراج أنواع الأوفرتايم الفريدة =============
  const overtimeTypes = useMemo(() => {
    const types = new Set<string>();
    requests.forEach((r) => {
      if (r.overtimeTypeId?.typeKey) {
        types.add(r.overtimeTypeId.typeKey);
      }
    });
    return Array.from(types);
  }, [requests]);

  // ============= فلترة حسب التاريخ =============
  const filteredByDate = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (viewMode) {
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return requests.filter((r) => {
          const date = new Date(r.workDate);
          return date >= weekStart && date <= weekEnd;
        });
      }
      case "month": {
        const monthStart = new Date(selectedYear, selectedMonth, 1);
        const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        return requests.filter((r) => {
          const date = new Date(r.workDate);
          return date >= monthStart && date <= monthEnd;
        });
      }
      case "custom": {
        if (!customStartDate || !customEndDate) return requests;
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return requests.filter((r) => {
          const date = new Date(r.workDate);
          return date >= start && date <= end;
        });
      }
      default:
        return requests;
    }
  }, [
    requests,
    viewMode,
    selectedMonth,
    selectedYear,
    customStartDate,
    customEndDate,
  ]);

  // ============= فلترة حسب النوع =============
  const filteredByType = useMemo(() => {
    if (!filterType) return filteredByDate;
    return filteredByDate.filter(
      (r) => r.overtimeTypeId?.typeKey === filterType,
    );
  }, [filteredByDate, filterType]);

  // ============= فلترة حسب البحث =============
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return filteredByType;
    return filteredByType.filter(
      (r) =>
        r.overtimeTypeId?.typeKey
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        FormatTime(r.workDate)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [filteredByType, searchQuery]);

  // ============= فلترة حسب الحالة =============
  const filteredRequests = useMemo(() => {
    if (!statusFilter) return filteredBySearch;
    return filteredBySearch.filter((r) => r.status === statusFilter);
  }, [filteredBySearch, statusFilter]);

  // ============= إحصائيات الفترة =============
  const periodStats = useMemo(() => {
    const total = filteredRequests.reduce((sum, r) => sum + (r.hours || 0), 0);
    const approved = filteredRequests
      .filter((r) => r.status === "approved")
      .reduce((sum, r) => sum + (r.hours || 0), 0);
    const pending = filteredRequests
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + (r.hours || 0), 0);
    const rejected = filteredRequests
      .filter((r) => r.status === "rejected")
      .reduce((sum, r) => sum + (r.hours || 0), 0);
    return {
      total,
      approved,
      pending,
      rejected,
      count: filteredRequests.length,
    };
  }, [filteredRequests]);

  // ============= Get Type Icon =============
  const getTypeIcon = (typeKey: string) => {
    const type = typeKey?.toLowerCase() || "";
    if (type.includes("weekend") || type.includes("عطلة"))
      return <Calendar className="h-5 w-5" />;
    if (type.includes("holiday") || type.includes("عيد"))
      return <CalendarDays className="h-5 w-5" />;
    if (type.includes("emergency") || type.includes("طارئ"))
      return <Clock3 className="h-5 w-5" />;
    return <TimerReset className="h-5 w-5" />;
  };

  const getSmallTypeIcon = (typeKey: string) => {
    const type = typeKey?.toLowerCase() || "";
    if (type.includes("weekend") || type.includes("عطلة"))
      return <Calendar className="h-3.5 w-3.5" />;
    if (type.includes("holiday") || type.includes("عيد"))
      return <CalendarDays className="h-3.5 w-3.5" />;
    if (type.includes("emergency") || type.includes("طارئ"))
      return <Clock3 className="h-3.5 w-3.5" />;
    return <TimerReset className="h-3.5 w-3.5" />;
  };

  const statusOptions: Array<{ value: RequestStatus; label: string }> = [
    { value: "", label: "All" },
    { value: "pending", label: t("myOvertimeRequestsPage.pending") },
    { value: "approved", label: t("myOvertimeRequestsPage.approved") },
    { value: "rejected", label: t("myOvertimeRequestsPage.rejected") },
  ];

  // ============= Month Navigation =============
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  const openModal = () => setOvertimeModalOpen(true);
  const closeModal = () => setOvertimeModalOpen(false);

  const resetAllFilters = () => {
    setFilterType(null);
    setSearchQuery("");
    setViewMode("month");
    setCustomStartDate("");
    setCustomEndDate("");
    setStatusFilter("");
    goToCurrentMonth();
  };

  const getPeriodLabel = () => {
    if (viewMode === "week") return "This Week";
    if (viewMode === "month") {
      return new Date(selectedYear, selectedMonth).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    if (viewMode === "custom" && customStartDate && customEndDate) {
      return `${FormatTime(customStartDate)} - ${FormatTime(customEndDate)}`;
    }
    return "All Time";
  };

  if (isLoading) {
    const loader = (
      <LoadingFull titleLines={1} cardLines={4} className="min-h-[40vh]" />
    );
    return embedded ? loader : <Layout>{loader}</Layout>;
  }

  const content = (
    <>
      <div className="space-y-5">
        {/* ========== Header ========== */}
        {!embedded && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-lg hidden md:flex"
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {t("myOvertimeRequestsPage.title")}
                </h1>
                <p className="text-sm text-slate-500">
                  {t("myOvertimeRequestsPage.subtitle")}
                </p>
              </div>
            </div>

            <Button
              onClick={openModal}
              className="h-10 rounded-lg bg-blue-600 px-4 font-medium text-white shadow-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {t("buttons.newOvertimeRequest")}
            </Button>
          </div>
        )}

        {/* ========== Filters Section ========== */}
        <PortalCard className="!p-0 overflow-hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter
                className={cn(
                  "h-4 w-4 transition-colors",
                  filterType ||
                    searchQuery ||
                    viewMode !== "month" ||
                    statusFilter
                    ? "text-blue-500"
                    : "text-slate-400",
                )}
              />
              <span className="text-sm font-medium text-slate-700">
                Filters
              </span>
              {(filterType ||
                searchQuery ||
                viewMode !== "month" ||
                statusFilter) && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-[10px] font-medium text-blue-600">
                  {
                    [
                      filterType ? 1 : 0,
                      searchQuery ? 1 : 0,
                      viewMode !== "month" ? 1 : 0,
                      statusFilter ? 1 : 0,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(filterType ||
                searchQuery ||
                viewMode !== "month" ||
                statusFilter) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAllFilters();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform duration-200",
                  isFilterOpen && "rotate-180",
                )}
              />
            </div>
          </button>

          {isFilterOpen && (
            <div className="border-t border-slate-100 px-5 py-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">
                    Status
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {statusOptions.map((option) => {
                      const isActive = statusFilter === option.value;
                      return (
                        <button
                          key={option.value || "all"}
                          type="button"
                          onClick={() => setStatusFilter(option.value)}
                          className={cn(
                            "h-8 rounded-md px-2 text-xs font-medium transition",
                            isActive
                              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:w-64">
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by type or date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {overtimeTypes.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {overtimeTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setFilterType(filterType === type ? null : type)
                        }
                        className={cn(
                          "h-7 px-3 rounded-md text-xs font-medium transition flex items-center gap-1.5",
                          filterType === type
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                        )}
                      >
                        {getSmallTypeIcon(type)}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">
                  Period
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewMode("month")}
                    className={cn(
                      "h-7 px-3 rounded-md text-xs font-medium transition",
                      viewMode === "month"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode("week")}
                    className={cn(
                      "h-7 px-3 rounded-md text-xs font-medium transition",
                      viewMode === "week"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setViewMode("custom")}
                    className={cn(
                      "h-7 px-3 rounded-md text-xs font-medium transition",
                      viewMode === "custom"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    Custom
                  </button>

                  {viewMode === "month" && (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={goToPreviousMonth}
                        className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition"
                      >
                        <ChevronLeft className="h-4 w-4 text-slate-500" />
                      </button>
                      <span className="text-xs font-medium text-slate-700 min-w-[100px] text-center">
                        {new Date(selectedYear, selectedMonth).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition"
                      >
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </button>
                      <button
                        onClick={goToCurrentMonth}
                        className="h-6 px-2 rounded text-[10px] text-blue-600 hover:bg-blue-50 transition"
                      >
                        Today
                      </button>
                    </div>
                  )}

                  {viewMode === "custom" && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="h-7 rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-32"
                      />
                      <span className="text-xs text-slate-300">→</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="h-7 rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </PortalCard>

        {/* ========== Results Summary ========== */}

        {/* ========== Main Grid: Table + Stats Card ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left: Table */}
          <div className="lg:col-span-3">
            <PortalCard className="!p-0 overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-3.5 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <TimerReset className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {t("myOvertimeRequestsPage.history")}
                    </h3>
                  </div>
                </div>
              </div>

              {filteredRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-b border-slate-100">
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                         Date
                        </TableHead>
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                       Type
                        </TableHead>
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                       Start
                        </TableHead>
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                       End
                        </TableHead>
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                       Hours
                        </TableHead>
                        <TableHead className="text-center text-xs text-slate-500 tracking-wider">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow
                          key={request._id}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="text-sm text-center text-slate-700 py-3">
                            {FormatTime(request.workDate)}
                          </TableCell>
                          <TableCell className="text-sm text-center text-slate-700">
                            {request.overtimeTypeId?.typeKey || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-center text-slate-700">
                            {FormatTime(request.startTime, true)}
                          </TableCell>
                          <TableCell className="text-sm text-center text-slate-700">
                            {FormatTime(request.endTime, true)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                              {request.hours?.toFixed(1)}h
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={request.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>{" "}
                  {/* ========== Pagination ========== */}
                  <UnifiedPagination
                    currentPage={page}
                    totalPages={totalPages}
                    setCurrentPage={setPage}
                    perPage={limit}
                    setPerPage={setLimit}
                    className="mt-2"
                  />
                </div>
              ) : (
                <EmptyState t={t} />
              )}
            </PortalCard>
          </div>

          {/* ========== Right: Stats Card - Improved Layout ========== */}
          <div className="lg:col-span-1">
            <PortalCard className="!p-0 overflow-hidden sticky top-4">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-1 ring-blue-100">
                    <BarChart3 className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Overtime Summary
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {getPeriodLabel()}
                    </p>
                  </div>
                </div>

                {/* Total Hours - Featured */}
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 p-4 border border-blue-100/60 mb-4">
                  <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">
                    Total Hours
                  </p>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-3xl font-bold text-blue-700">
                      {periodStats.total.toFixed(1)}
                    </p>
                    <span className="text-sm font-medium text-slate-400 mb-1">
                      hrs
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-blue-100/40">
                    <span className="text-[10px] text-blue-500">
                      <span className="font-medium">
                        {filteredRequests.length}
                      </span>{" "}
                      entries
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-300" />
                    <span className="text-[10px] text-blue-500">
                      Avg:{" "}
                      <span className="font-medium">
                        {filteredRequests.length > 0
                          ? (
                              periodStats.total / filteredRequests.length
                            ).toFixed(1)
                          : 0}{" "}
                        hrs
                      </span>
                    </span>
                  </div>
                </div>

                {/* Stats Grid - 2x2 Layout */}
                <div className="grid grid-cols-2 gap-2">
                  <StatsCard
                    label="Approved"
                    value={periodStats.approved.toFixed(1)}
                    color="emerald"
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    percentage={
                      periodStats.total > 0
                        ? Math.round(
                            (periodStats.approved / periodStats.total) * 100,
                          )
                        : 0
                    }
                  />
                  <StatsCard
                    label="Pending"
                    value={periodStats.pending.toFixed(1)}
                    color="amber"
                    icon={<Clock3 className="h-3.5 w-3.5" />}
                    percentage={
                      periodStats.total > 0
                        ? Math.round(
                            (periodStats.pending / periodStats.total) * 100,
                          )
                        : 0
                    }
                  />
                  <StatsCard
                    label="Rejected"
                    value={periodStats.rejected.toFixed(1)}
                    color="rose"
                    icon={<X className="h-3.5 w-3.5" />}
                    percentage={
                      periodStats.total > 0
                        ? Math.round(
                            (periodStats.rejected / periodStats.total) * 100,
                          )
                        : 0
                    }
                  />
                  <StatsCard
                    label="Requests"
                    value={filteredRequests.length}
                    color="blue"
                    icon={<FileText className="h-3.5 w-3.5" />}
                    percentage={100}
                  />
                </div>
              </div>
            </PortalCard>
          </div>
        </div>

        {/* ========== Mobile View ========== */}
        <div className="space-y-3 md:hidden">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
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
                  className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-sm"
                >
                  <MobileCardHeader
                    noBorder={!isExpanded}
                    className="items-center gap-3 bg-white px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {getTypeIcon(request.overtimeTypeId?.typeKey || "")}
                      </div>
                      <div className="min-w-0">
                        <MobileCardValue className="truncate leading-tight text-sm">
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
                      <StatusBadge status={request.status} compact />
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </div>
                  </MobileCardHeader>

                  {isExpanded && (
                    <MobileCardContent className="space-y-3 px-4 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-md bg-slate-50 p-2.5">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Date
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-slate-700">
                            {FormatTime(request.workDate)}
                          </p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-2.5">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Hours
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-slate-700">
                            {request.hours?.toFixed(1)} hrs
                          </p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-2.5">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Start
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-slate-700">
                            {FormatTime(request.startTime, true)}
                          </p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-2.5">
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            End
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-slate-700">
                            {FormatTime(request.endTime, true)}
                          </p>
                        </div>
                      </div>
                      {/* ========== Pagination ========== */}
                      <UnifiedPagination
                        currentPage={page}
                        totalPages={totalPages}
                        setCurrentPage={setPage}
                        perPage={limit}
                        setPerPage={setLimit}
                        className="mt-2"
                      />
                    </MobileCardContent>
                  )}
                </MobileCard>
              );
            })
          ) : (
            <EmptyState t={t} />
          )}
        </div>
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

// ============= Sub-Components =============

const StatsCard = ({
  label,
  value,
  icon,
  color = "blue",
  percentage,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "blue" | "emerald" | "amber" | "rose";
  percentage?: number;
}) => {
  const colorMap = {
    blue: "bg-blue-50/50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50/50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50/50 text-amber-600 border-amber-100",
    rose: "bg-rose-50/50 text-rose-600 border-rose-100",
  };

  const bgMap = {
    blue: "bg-blue-100/40",
    emerald: "bg-emerald-100/40",
    amber: "bg-amber-100/40",
    rose: "bg-rose-100/40",
  };

  return (
    <div className={cn("rounded-lg border p-2.5", colorMap[color])}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={cn("p-1 rounded", bgMap[color])}>{icon}</div>
          <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
            {label}
          </p>
        </div>
        {percentage !== undefined && (
          <span className="text-[9px] font-medium text-slate-400">
            {percentage}%
          </span>
        )}
      </div>
      <p className="mt-0.5 text-base font-bold text-slate-800">
        {value}
        <span className="text-[9px] font-normal text-slate-400 ml-0.5">
          hrs
        </span>
      </p>
    </div>
  );
};

const EmptyState = ({ t }: { t: TFunction }) => (
  <div className="px-5 py-12 text-center">
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100/60 text-slate-300">
      <TimerReset className="h-6 w-6" />
    </div>
    <h3 className="text-sm font-semibold text-slate-800">
      {t("myOvertimeRequestsPage.noRequests")}
    </h3>
    <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
      {t("myOvertimeRequestsPage.noRequestsDesc")}
    </p>
  </div>
);
