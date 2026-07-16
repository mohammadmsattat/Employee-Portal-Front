import { ReactNode, useMemo, useState, Fragment, useEffect } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Fingerprint,
  LogIn,
  LogOut,
  Minus,
  Timer,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Layers,
  TrendingUp,
  Award,
  ArrowRight,
  TrendingDown,
  Zap,
  BarChart3,
  User,
  Briefcase,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import { useGetMyDailyFingerprintsQuery } from "@/rtk/Fingerprint/fingerprintApi";
import { AttendanceFingerprint } from "@/interfaces/attendance";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// ============= Types & Interfaces =============
interface DailyFingerprintGroup {
  date?: string;
  day?: string;
  logs?: AttendanceFingerprint[];
  records?: AttendanceFingerprint[];
  fingerprints?: AttendanceFingerprint[];
  attendance?: AttendanceFingerprint[];
  total?: number;
}

type AttendanceDayGroup = {
  date: string;
  logs: AttendanceFingerprint[];
};

type FilterType = "all" | "month" | "custom";

// ============= Utility Functions =============
const normalizeDailyFingerprints = (
  items: DailyFingerprintGroup[],
): AttendanceDayGroup[] => {
  const grouped = new Map<string, AttendanceFingerprint[]>();

  items.forEach((item) => {
    const nestedLogs =
      item.logs || item.records || item.fingerprints || item.attendance;
    const date = item.date || item.day || "";

    if (Array.isArray(nestedLogs) && nestedLogs.length > 0) {
      const normalizedDate = date || nestedLogs[0]?.date || "";
      if (!normalizedDate) return;
      grouped.set(normalizedDate, [
        ...(grouped.get(normalizedDate) || []),
        ...nestedLogs,
      ]);
      return;
    }

    if ((item as any).Time && (item as any).type && (item as any).date) {
      const dateKey = (item as any).date;
      if (!dateKey) return;
      grouped.set(dateKey, [
        ...(grouped.get(dateKey) || []),
        item as any as AttendanceFingerprint,
      ]);
    }
  });

  return Array.from(grouped.entries())
    .map(([date, logs]) => ({
      date,
      logs: [...logs].sort((a, b) => a.Time.localeCompare(b.Time)),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// ============= Sub-components =============

// ============= Pagination Components =============

// Pagination Button - Improved
const PaginationButton = ({
  children,
  onClick,
  disabled,
  isActive,
  className,
  size = "md",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  className?: string;
  size?: "sm" | "md";
  "aria-label"?: string;
}) => {
  const sizeClasses = {
    sm: "min-w-[32px] h-8 text-xs",
    md: "min-w-[36px] h-9 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        sizeClasses[size],
        isActive
          ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm hover:bg-blue-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
};

// Unified Pagination - Max 4 pages with ellipsis
const UnifiedPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  className,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  className?: string;
}) => {
  const prevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const nextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const total = totalPages;
    const current = currentPage;

    if (total <= 4) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (current <= 2) {
      pages.push(1);
      pages.push(2);
      pages.push(3);
      pages.push('…');
      pages.push(total);
    }
    else if (current >= total - 1) {
      pages.push(1);
      pages.push('…');
      pages.push(total - 2);
      pages.push(total - 1);
      pages.push(total);
    }
    else {
      pages.push(1);
      pages.push('…');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('…');
      pages.push(total);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={cn(
        "flex items-center justify-center gap-1 py-2",
        className,
      )}
      role="navigation"
      aria-label="Pagination"
    >
      <PaginationButton
        onClick={prevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        size="sm"
        className="sm:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      <PaginationButton
        onClick={prevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="hidden sm:flex gap-1 px-3"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </PaginationButton>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {visiblePages.map((page, index) => {
          if (page === '…') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm text-slate-400 select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;
          const pageNumber = page as number;

          return isCurrent ? (
            <span
              key={pageNumber}
              className="min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50/80 rounded-lg border border-blue-200/60 select-none"
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <PaginationButton
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              size="md"
            >
              {pageNumber}
            </PaginationButton>
          );
        })}
      </div>

      <PaginationButton
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        size="sm"
        className="sm:hidden"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>

      <PaginationButton
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="hidden sm:flex gap-1 px-3"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
};

// Attendance Type Badge
const AttendanceTypeBadge = ({
  type,
}: {
  type: AttendanceFingerprint["type"];
}) => {
  const isCheckIn = type === "Check-in";
  const Icon = isCheckIn ? LogIn : LogOut;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        isCheckIn
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {type}
    </span>
  );
};

// Attendance Log Row
const AttendanceLogRow = ({
  record,
  compact,
}: {
  record: AttendanceFingerprint;
  compact?: boolean;
}) => (
  <div
    className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white ${
      compact ? "p-3" : "px-4 py-3"
    }`}
  >
    <AttendanceTypeBadge type={record.type} />
    <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 px-3 py-2 font-semibold text-slate-900">
      <Timer className="h-4 w-4 text-slate-500" />
      {record.Time}
    </div>
  </div>
);

// ============= Main Component =============
const Attendance = () => {
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();

  // State Management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Filter States
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // ============= API Queries =============
  // 1. Query for history with pagination
  const { data, isLoading, error } = useGetMyDailyFingerprintsQuery(page, {
    skip: !token,
  });

  // 2. Query for today's data (independent from pagination)
  const { data: todayData, isLoading: todayLoading } = useGetMyDailyFingerprintsQuery(
    page,
    { skip: !token }
  );

  console.log("History Data:", data);
  console.log("Today Data:", todayData);

  // Formatters
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // ============= Derived Data for History (مع Pagination) =============
  const allDayGroups = useMemo(
    () => normalizeDailyFingerprints(data?.data || []),
    [data?.data],
  );

  const filteredDayGroups = useMemo(() => {
    if (filterType === "all") return allDayGroups;

    if (filterType === "month") {
      return allDayGroups.filter((group) => {
        const date = new Date(group.date);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
    }

    if (filterType === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      return allDayGroups.filter((group) => {
        const date = new Date(group.date);
        return date >= start && date <= end;
      });
    }

    return allDayGroups;
  }, [
    allDayGroups,
    filterType,
    selectedMonth,
    selectedYear,
    startDate,
    endDate,
  ]);

  // ============= Today's Data (مستقل عن Pagination) =============
  const todayAllGroups = useMemo(
    () => normalizeDailyFingerprints(todayData?.data || []),
    [todayData?.data],
  );

  const todayDate = new Date().toLocaleDateString("en-CA");
  const todayGroup = todayAllGroups.find((group) => group.date === todayDate);
  const todayCheckIn = todayGroup?.logs.find((log) => log.type === "Check-in");
  const todayCheckOut = todayGroup?.logs.find(
    (log) => log.type === "Check-out",
  );
  const todayLogs = todayGroup?.logs || [];

  // ============= Monthly Summary Data (مستقل عن Pagination) =============
  // نستخدم todayAllGroups (البيانات الكاملة) لحساب إحصائيات الشهر
  const monthlyGroups = useMemo(() => {
    return todayAllGroups.filter((group) => {
      const date = new Date(group.date);
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [todayAllGroups, selectedMonth, selectedYear]);

  // ============= Statistics (من monthlyGroups المستقلة) =============
  const totalWorkedDays = monthlyGroups.length;
  const completedDays = monthlyGroups.filter(
    (g) =>
      g.logs.some((l) => l.type === "Check-in") &&
      g.logs.some((l) => l.type === "Check-out"),
  ).length;
  const absentDays = totalWorkedDays - completedDays;

  const completionRate = totalWorkedDays > 0
    ? Math.round((completedDays / totalWorkedDays) * 100)
    : 0;

  const lateArrivals = monthlyGroups.filter((group) => {
    const checkIn = group.logs.find((l) => l.type === "Check-in");
    if (!checkIn) return false;
    const time = new Date(`2000-01-01T${checkIn.Time}`);
    return (
      time.getHours() > 9 || (time.getHours() === 9 && time.getMinutes() > 0)
    );
  }).length;

  // ============= Working Hours (من todayData) =============
  const calculateWorkingHours = () => {
    if (todayCheckIn && todayCheckOut) {
      const start = new Date(`2000-01-01T${todayCheckIn.Time}`);
      const end = new Date(`2000-01-01T${todayCheckOut.Time}`);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      }
    }
    return "—";
  };

  // ============= Total Hours (من monthlyGroups المستقلة) =============
  let totalHours = 0;
  monthlyGroups.forEach((group) => {
    const checkIn = group.logs.find((l) => l.type === "Check-in");
    const checkOut = group.logs.find((l) => l.type === "Check-out");
    if (checkIn && checkOut) {
      const start = new Date(`2000-01-01T${checkIn.Time}`);
      const end = new Date(`2000-01-01T${checkOut.Time}`);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs > 0) {
        totalHours += diffMs / (1000 * 60 * 60);
      }
    }
  });

  const totalHoursFormatted = `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;
  const avgPerDay = totalWorkedDays > 0 ? totalHours / totalWorkedDays : 0;
  const avgPerDayFormatted = `${Math.floor(avgPerDay)}h ${Math.round((avgPerDay % 1) * 60)}m`;

  const totalPages = Math.max(1, data?.Pages || 1);
  const today = new Date().toISOString().split("T")[0];

  // Effects
  useEffect(() => {
    setPage(1);
  }, [filterType, selectedMonth, selectedYear, startDate, endDate]);

  useEffect(() => {
    if (filterType !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  }, [filterType]);

  // Loading & Error States
  if (!token || isLoading || todayLoading) {
    return (
      <Layout>
        <LoadingFull
          titleLines={token ? 2 : 1}
          cardLines={token ? 4 : 2}
          className="min-h-[60vh]"
        />
      </Layout>
    );
  }

  console.log("Filtered Groups:", filteredDayGroups);
  console.log("Monthly Groups:", monthlyGroups);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="space-y-6">
            {/* ========== Header Section ========== */}
            <HeaderSection
              filterType={filterType}
              setFilterType={setFilterType}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              filteredDayGroups={filteredDayGroups}
              i18n={i18n}
              today={today}
            />

            {/* ========== Main Grid: Left Cards + Right Table ========== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Cards Stacked */}
              <div className="lg:col-span-2">
                <AttendanceHistorySection
                  filteredDayGroups={filteredDayGroups}
                  expandedDay={expandedDay}
                  setExpandedDay={setExpandedDay}
                  dateFormatter={dateFormatter}
                  filterType={filterType}
                  startDate={startDate}
                  endDate={endDate}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  i18n={i18n}
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              </div>
              <div className="space-y-4 lg:col-span-1">
                {/* Right Column - Today Timeline (مستقل) */}
                <TodayTimelineCard
                  dateFormatter={dateFormatter}
                  todayCheckIn={todayCheckIn}
                  todayCheckOut={todayCheckOut}
                  calculateWorkingHours={calculateWorkingHours}
                  todayLogs={todayLogs}
                />
                {/* Month Summary (مستقل) */}
                <MonthSummaryCard
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  i18n={i18n}
                  totalWorkedDays={totalWorkedDays}
                  absentDays={absentDays}
                  lateArrivals={lateArrivals}
                  completionRate={completionRate}
                  totalHoursFormatted={totalHoursFormatted}
                  avgPerDayFormatted={avgPerDayFormatted}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;

// ============= Section Components =============

// Header Section
const HeaderSection = ({
  filterType,
  setFilterType,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filteredDayGroups,
  i18n,
  today,
}: any) => (
  <div className="flex flex-col gap-5">
    {/* Title Row */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Fingerprint className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            Attendance Overview
          </h1>
          <p className="text-sm text-slate-500">
            Track your daily attendance records
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200/60 shadow-sm">
        {[
          { value: "all", label: "All", icon: <Layers className="h-4 w-4" /> },
          {
            value: "month",
            label: "Month",
            icon: <CalendarDays className="h-4 w-4" />,
          },
          {
            value: "custom",
            label: "Custom",
            icon: <Calendar className="h-4 w-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
              filterType === tab.value
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/80"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* Filter Controls */}
    <div className="flex flex-wrap items-center gap-3">
      {filterType === "month" && (
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm hover:border-blue-200 transition-colors">
          <CalendarDays className="h-4 w-4 text-blue-500" />
          <div className="flex items-center gap-1">
            <select
              className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 py-1 cursor-pointer hover:text-blue-600 transition-colors"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i, 1).toLocaleString(i18n.language, {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <span className="text-slate-300 text-sm">|</span>
            <select
              className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 py-1 cursor-pointer hover:text-blue-600 transition-colors"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {filterType === "custom" && (
        <div className="flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm hover:border-blue-200 transition-colors">
          <Calendar className="h-4 w-4 text-blue-500" />
          <div className="flex items-center gap-2">
            <DateInput
              value={startDate}
              onChange={setStartDate}
              max={endDate || today}
              placeholder="From"
            />
            <span className="text-xs text-slate-400 font-medium">→</span>
            <DateInput
              value={endDate}
              onChange={setEndDate}
              min={startDate}
              max={today}
              placeholder="To"
            />
          </div>
          {startDate && endDate && (
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <span className="text-[10px] font-medium text-blue-700 whitespace-nowrap">
                {new Date(startDate).toLocaleDateString(i18n.language, {
                  day: "numeric",
                  month: "short",
                })}
                <span className="mx-1 text-blue-300">—</span>
                {new Date(endDate).toLocaleDateString(i18n.language, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Badge */}
      {filterType !== "all" && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100/60 shadow-sm">
          <Filter className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-medium">
            {filterType === "month"
              ? new Date(selectedYear, selectedMonth).toLocaleString(
                  i18n.language,
                  {
                    month: "long",
                    year: "numeric",
                  },
                )
              : `${filteredDayGroups.length} day${filteredDayGroups.length > 1 ? "s" : ""} selected`}
          </span>
        </div>
      )}

      {/* Clear Filter */}
      {filterType !== "all" && (
        <button
          onClick={() => setFilterType("all")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 px-3 py-1.5 rounded-full transition-all"
        >
          <X className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  </div>
);

// Date Input Component
const DateInput = ({ value, onChange, max, min, placeholder }: any) => (
  <div className="relative">
    <input
      type="date"
      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-36"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      max={max}
      min={min}
      placeholder={placeholder}
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

// ============= Today Timeline Card (مستقل) =============
const TodayTimelineCard = ({
  dateFormatter,
  todayCheckIn,
  todayCheckOut,
  calculateWorkingHours,
  todayLogs = [],
}: any) => {
  const sortedLogs = [...todayLogs].sort((a, b) =>
    a.Time.localeCompare(b.Time),
  );

  const totalLogs = sortedLogs.length;

  return (
    <PortalCard>
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-1 ring-blue-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Today Timeline</h3>
              <p className="text-sm text-slate-500">
                {dateFormatter.format(new Date())}
              </p>
            </div>
          </div>
          {totalLogs > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              <Fingerprint className="h-3 w-3" />
              {totalLogs} {totalLogs === 1 ? "record" : "records"}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Current Status Summary */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Timer className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Current Working Time</p>
              <p className="text-sm font-semibold text-slate-900">
                {calculateWorkingHours()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              todayCheckIn && todayCheckOut
                ? 'bg-emerald-50 text-emerald-700'
                : todayCheckIn
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-50 text-slate-400'
            }`}>
              {todayCheckIn && todayCheckOut ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : todayCheckIn ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {todayCheckIn && todayCheckOut
                ? 'Complete'
                : todayCheckIn
                ? 'Partial'
                : 'Absent'}
            </span>
          </div>
        </div>

        {/* Timeline - تصميم الخطوط فقط */}
        {totalLogs > 0 ? (
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-0">
              {sortedLogs.map((record, index) => {
                const isCheckIn = record.type === "Check-in";
                const isFirst = index === 0;
                const isLast = index === totalLogs - 1;
                const IconComponent = isCheckIn ? LogIn : LogOut;

                return (
                  <div key={record._id} className="relative">
                    {!isLast && (
                      <div className="absolute left-[7px] top-[20px] bottom-0 w-0.5 bg-slate-200" />
                    )}

                    <div className="flex gap-4 py-3 relative">
                      <div className="relative z-10 flex-shrink-0 pt-0.5">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 bg-white transition-all hover:scale-110",
                            isCheckIn
                              ? "border-emerald-500"
                              : "border-rose-500",
                          )}
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mx-auto mt-[2px]",
                              isCheckIn ? "bg-emerald-500" : "bg-rose-500",
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-700">
                              {record.type}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isFirst
                                ? "Start"
                                : isLast
                                  ? "Latest"
                                  : `#${index + 1}`}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-600 tabular-nums">
                            {record.Time}
                          </span>
                        </div>

                        {!isLast && (
                          <div className="mt-2 border-t border-slate-100/80" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-500">
                  {todayLogs.filter((l: any) => l.type === "Check-in").length}{" "}
                  IN
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] text-slate-500">
                  {todayLogs.filter((l: any) => l.type === "Check-out").length}{" "}
                  OUT
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100/60 text-slate-300">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              No records today
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your check-ins and check-outs will appear here
            </p>
          </div>
        )}
      </div>
    </PortalCard>
  );
};

// ============= Month Summary Card (مستقل) =============
const MonthSummaryCard = ({
  selectedYear,
  selectedMonth,
  i18n,
  totalWorkedDays,
  absentDays,
  lateArrivals,
  completionRate,
  totalHoursFormatted,
  avgPerDayFormatted,
}: any) => (
  <PortalCard>
    <div className="px-5 py-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 ring-1 ring-purple-100">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Monthly Summary</h3>
          <p className="text-sm text-slate-500">
            {new Date(selectedYear, selectedMonth).toLocaleString(
              i18n.language,
              {
                month: "long",
                year: "numeric",
              },
            )}
          </p>
        </div>
      </div>
    </div>

    <div className="p-5 space-y-4">
      {/* Stats Grid - 2 columns with icons */}
      <div className="grid grid-cols-2 gap-3">
        <StatBox
          label="Worked Days"
          value={totalWorkedDays}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />
        <StatBox
          label="Absent Days"
          value={absentDays}
          valueColor="text-rose-600"
          icon={<XCircle className="h-3.5 w-3.5" />}
        />
        <StatBox
          label="Late Arrivals"
          value={lateArrivals}
          valueColor="text-amber-600"
          icon={<AlertCircle className="h-3.5 w-3.5" />}
        />
        <StatBox
          label="Completion Rate"
          value={`${completionRate}%`}
          valueColor="text-emerald-600"
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Working Hours Summary with icon */}
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 p-4 border border-blue-100/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100/60 p-2 text-blue-600">
              <Timer className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Working Hours</p>
              <p className="text-lg font-bold text-slate-900">
                {totalHoursFormatted}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Average Per Day</p>
            <p className="text-sm font-semibold text-blue-600">
              {avgPerDayFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* View Details Button with hover effect */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm group">
        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
          View Full Details
        </span>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" />
      </button>
    </div>
  </PortalCard>
);

// Updated StatBox component with icon support
const StatBox = ({
  label,
  value,
  valueColor = "text-slate-900",
  icon,
}: {
  label: string;
  value: number | string;
  valueColor?: string;
  icon?: ReactNode;
}) => (
  <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-200/60 transition-all hover:shadow-sm hover:border-slate-300/80">
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      {icon && <span className="text-slate-400">{icon}</span>}
    </div>
    <p className={`mt-1.5 text-xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

// ============= Attendance History Section =============
const AttendanceHistorySection = ({
  filteredDayGroups,
  expandedDay,
  setExpandedDay,
  dateFormatter,
  filterType,
  startDate,
  endDate,
  selectedMonth,
  selectedYear,
  i18n,
  page,
  totalPages,
  setPage,
  limit,
  setLimit,
}: any) => (
  <PortalCard>
    <div className="border-b border-slate-100 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-1 ring-blue-100">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Attendance History</h3>
            <p className="text-sm text-slate-500 flex items-center gap-2 flex-wrap">
              {filteredDayGroups.length} day
              {filteredDayGroups.length > 1 ? "s" : ""} of attendance records
              {filterType === "custom" && startDate && endDate && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <Calendar className="h-3 w-3" />
                  {new Date(startDate).toLocaleDateString(i18n.language, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" — "}
                  {new Date(endDate).toLocaleDateString(i18n.language, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {filterType === "month" && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(selectedYear, selectedMonth).toLocaleString(
                    i18n.language,
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              )}
            </p>
          </div>
        </div>
        {filteredDayGroups.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>

    {filteredDayGroups.length > 0 ? (
      <>
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/80">
                {[
                  "Date",
                  "Check-in",
                  "Check-out",
                  "Duration",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="text-center text-xs text-slate-500 tracking-wider"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDayGroups.map((group: AttendanceDayGroup) => (
                <AttendanceTableRow
                  key={group.date}
                  group={group}
                  expandedDay={expandedDay}
                  setExpandedDay={setExpandedDay}
                  dateFormatter={dateFormatter}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 px-4 pb-4 md:hidden">
          {filteredDayGroups.map((group: AttendanceDayGroup) => (
            <AttendanceMobileCard
              key={group.date}
              group={group}
              expandedDay={expandedDay}
              setExpandedDay={setExpandedDay}
              dateFormatter={dateFormatter}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 pb-4">
          <UnifiedPagination
            currentPage={page}
            totalPages={totalPages}
            setCurrentPage={setPage}
            className="mt-4"
          />
        </div>
      </>
    ) : (
      <EmptyState
        filterType={filterType}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        startDate={startDate}
        endDate={endDate}
        i18n={i18n}
      />
    )}
  </PortalCard>
);

// Attendance Table Row
const AttendanceTableRow = ({
  group,
  expandedDay,
  setExpandedDay,
  dateFormatter,
}: any) => {
  const isExpanded = expandedDay === group.date;
  const checkInLog = group.logs.find(
    (log: AttendanceFingerprint) => log.type === "Check-in",
  );
  const checkOutLog = group.logs.find(
    (log: AttendanceFingerprint) => log.type === "Check-out",
  );
  const hasCheckIn = !!checkInLog;
  const hasCheckOut = !!checkOutLog;
  const isComplete = hasCheckIn && hasCheckOut;

  const duration = getDuration(checkInLog, checkOutLog);

  return (
    <Fragment>
      <TableRow
        onClick={() => setExpandedDay(isExpanded ? null : group.date)}
        className="cursor-pointer border-slate-100 transition hover:bg-slate-50/70 group"
      >
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <p className="font-semibold text-slate-900 text-sm">
                {dateFormatter.format(new Date(group.date))}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          {hasCheckIn ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <LogIn className="h-3 w-3" />
              {checkInLog.Time}
            </span>
          ) : (
            <span className="text-xs text-slate-300">—</span>
          )}
        </TableCell>
        <TableCell className="text-center">
          {hasCheckOut ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <LogOut className="h-3 w-3" />
              {checkOutLog.Time}
            </span>
          ) : (
            <span className="text-xs text-slate-300">—</span>
          )}
        </TableCell>
        <TableCell className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
            <Timer className="h-3.5 w-3.5 text-slate-400" />
            {duration}
          </span>
        </TableCell>
        <TableCell className="text-center">
          <StatusBadge isComplete={isComplete} hasCheckIn={hasCheckIn} />
        </TableCell>
        <TableCell className="text-center">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setExpandedDay(isExpanded ? null : group.date);
            }}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-slate-50/30">
          <TableCell colSpan={6} className="p-0">
            <div className="border-t border-slate-100 p-4">
              <div className="mb-3 flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>All logs for</span>
                  <span className="text-blue-600 font-semibold">
                    {dateFormatter.format(new Date(group.date))}
                  </span>
                </div>
                <span className="text-xs font-normal text-slate-400">
                  {group.logs.length} record{group.logs.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-2">
                {group.logs.map((record: AttendanceFingerprint) => (
                  <AttendanceLogRow key={record._id} record={record} />
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

// Attendance Mobile Card
const AttendanceMobileCard = ({
  group,
  expandedDay,
  setExpandedDay,
  dateFormatter,
}: any) => {
  const isExpanded = expandedDay === group.date;
  const checkInLog = group.logs.find(
    (log: AttendanceFingerprint) => log.type === "Check-in",
  );
  const checkOutLog = group.logs.find(
    (log: AttendanceFingerprint) => log.type === "Check-out",
  );
  const hasCheckIn = !!checkInLog;
  const hasCheckOut = !!checkOutLog;
  const isComplete = hasCheckIn && hasCheckOut;
  const duration = getDuration(checkInLog, checkOutLog);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpandedDay(isExpanded ? null : group.date)}
        className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-start transition-colors hover:bg-slate-50/50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-1 ring-blue-100">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {dateFormatter.format(new Date(group.date))}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Fingerprint className="h-3 w-3" />
                {group.logs.length} log{group.logs.length > 1 ? "s" : ""}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">
                {duration !== "—" ? `⏱ ${duration}` : "No duration"}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <StatusBadge
                isComplete={isComplete}
                hasCheckIn={hasCheckIn}
                compact
              />
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            All logs for this day
          </div>
          <div className="space-y-2">
            {group.logs.map((record: AttendanceFingerprint) => (
              <AttendanceLogRow key={record._id} record={record} compact />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

// Status Badge
const StatusBadge = ({ isComplete, hasCheckIn, compact = false }: any) => {
  const className = compact
    ? "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
    : "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold";

  const styles = isComplete
    ? "bg-emerald-50 text-emerald-700"
    : hasCheckIn
      ? "bg-amber-50 text-amber-700"
      : "bg-slate-50 text-slate-400";

  const icon = isComplete ? (
    <CheckCircle2 className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
  ) : hasCheckIn ? (
    <AlertCircle className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
  ) : (
    <XCircle className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
  );

  const label = isComplete ? "Complete" : hasCheckIn ? "Partial" : "Absent";

  return (
    <span className={`${className} ${styles}`}>
      {icon}
      {label}
    </span>
  );
};

// Helper Functions
const getDuration = (
  checkInLog: AttendanceFingerprint | undefined,
  checkOutLog: AttendanceFingerprint | undefined,
) => {
  if (!checkInLog || !checkOutLog) return "—";
  const start = new Date(`2000-01-01T${checkInLog.Time}`);
  const end = new Date(`2000-01-01T${checkOutLog.Time}`);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return "—";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

// Empty State
const EmptyState = ({
  filterType,
  selectedMonth,
  selectedYear,
  startDate,
  endDate,
  i18n,
}: any) => (
  <div className="px-5 py-16 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
      <Clock className="h-8 w-8" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">
      No attendance records
    </h3>
    <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
      {filterType === "month"
        ? `No records found for ${new Date(
            selectedYear,
            selectedMonth,
          ).toLocaleString(i18n.language, {
            month: "long",
            year: "numeric",
          })}`
        : filterType === "custom" && startDate && endDate
          ? `No records found from ${new Date(startDate).toLocaleDateString(
              i18n.language,
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )} to ${new Date(endDate).toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}`
          : "Your check-in and check-out records will appear here."}
    </p>
  </div>
);