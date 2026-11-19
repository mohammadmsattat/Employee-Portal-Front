import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Layout from "@/components/layout/Layout";
import LoadingFull from "@/components/ui/LoadingSkeleton";

// Import hooks
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useAttendanceFilters } from "@/hooks/Attendance/useAttendanceFilters";

// Import utilities
import {
  formatDate,
  getTodayDate,
  normalizeDailyFingerprints,
} from "@/lib/attendanceHelpers";

// Import components
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { TodayTimelineCard } from "@/components/attendance/TodayTimelineCard";
import { MonthSummaryCard } from "@/components/attendance/MonthSummaryCard";

// Import attendance calculator
import {
  type Period,
  type FingerprintRecord,
} from "@/lib/attendanceCalculator";

const Attendance = () => {
  const token = localStorage.getItem("token");

  const { i18n } = useTranslation();

  // ===== State =====
  const [page, setPage] = useState(1);

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // ===== Filters Hook =====
  const filters = useAttendanceFilters();

  // ===== Attendance Hook (with period) =====
  const attendance = useAttendance({
    startDate: filters.periodStartDate,
    endDate: filters.periodEndDate,
  });

  // ===== Derived Data =====
  const allDayGroups = normalizeDailyFingerprints(attendance.dailyRecords);

  // ===== Filter day groups based on filter type =====
  const filteredDayGroups = useMemo(() => {
    const { filterType, selectedMonth, selectedYear, startDate, endDate } =
      filters;

    if (filterType === "all") {
      return allDayGroups;
    }

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
  }, [allDayGroups, filters]);

  // ===== Today's Data =====
  const todayDate = getTodayDate(
    attendance.groupSettings?.locationId?.timezone || "Asia/Damascus",
  );

  const todayGroup = allDayGroups.find((group) => group.date === todayDate);

  const todayLogs = todayGroup?.logs || [];

  // ===== Monthly Statistics using Attendance Calculator =====
  const monthlyStats = useMemo(() => {
    const summary = attendance.summary;

    if (!summary) {
      return {
        totalCalendarDays: 0,
        totalWorkingDays: 0,
        totalNonWorkingDays: 0,
        workedDays: 0,
        absentDays: 0,
        lateArrivals: 0,
        extraWorkedDays: 0,
        totalHoursFormatted: "0h 0m",
        avgPerDayFormatted: "0h 0m",
      };
    }

    /**
     * IMPORTANT:
     *
     * Use the calculator's dailyDetails as the
     * single source of truth.
     *
     * Do NOT calculate hours again from
     * allDayGroups because that would create
     * a second attendance calculation.
     */
    const elapsedWorkingDays = summary.dailyDetails.filter(
      (day) =>
        day.isWorkingDay &&
        day.date <=
          getTodayDate(
            attendance.groupSettings?.locationId?.timezone || "Asia/Damascus",
          ),
    );

    const totalWorkedMinutes = elapsedWorkingDays.reduce(
      (total, day) => total + Math.round(day.workedHours * 60),
      0,
    );

    const totalHours = Math.floor(totalWorkedMinutes / 60);

    const totalMinutes = totalWorkedMinutes % 60;

    const totalHoursFormatted = `${totalHours}h ${totalMinutes}m`;

    const avgMinutes =
      elapsedWorkingDays.length > 0
        ? Math.round(totalWorkedMinutes / elapsedWorkingDays.length)
        : 0;

    const avgHours = Math.floor(avgMinutes / 60);

    const avgRemainingMinutes = avgMinutes % 60;

    const avgPerDayFormatted = `${avgHours}h ${avgRemainingMinutes}m`;

    return {
      totalCalendarDays: summary.totalCalendarDays,

      totalWorkingDays: summary.totalWorkingDays,

      totalNonWorkingDays: summary.totalNonWorkingDays,

      workedDays: summary.workedDays,

      absentDays: summary.absentDays,

      lateArrivals: summary.lateArrivals,

      // New metric: worked days during additional holidays.
      extraWorkedDays: summary.extraWorkedDays,

      totalHoursFormatted,

      avgPerDayFormatted,
    };
  }, [attendance.summary, attendance.groupSettings]);

  // ===== Reset page when filters change =====
  useEffect(() => {
    setPage(1);
  }, [
    filters.filterType,
    filters.selectedMonth,
    filters.selectedYear,
    filters.startDate,
    filters.endDate,
  ]);

  // ===== Loading State =====
  if (!token || attendance.isLoading) {
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

  const dateFormatter = (date: Date) =>
    formatDate(date.toISOString().split("T")[0], i18n.language);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <AttendanceHeader
              {...filters}
              filteredCount={filteredDayGroups.length}
              i18n={i18n}
              today={todayDate}
            />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - History */}
              <div className="lg:col-span-2">
                <AttendanceHistory
                  filteredDayGroups={filteredDayGroups}
                  expandedDay={expandedDay}
                  setExpandedDay={setExpandedDay}
                  dateFormatter={dateFormatter}
                  i18n={i18n}
                  filters={filters}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4 lg:col-span-1">
                <TodayTimelineCard
                  dateFormatter={dateFormatter}
                  todayLogs={todayLogs}
                  calculateWorkingHours={() => attendance.workedTimeText}
                />

                <MonthSummaryCard
                  selectedYear={filters.selectedYear}
                  selectedMonth={filters.selectedMonth}
                  i18n={i18n}
                  totalWorkedDays={monthlyStats.workedDays}
                  absentDays={monthlyStats.absentDays}
                  lateArrivals={monthlyStats.lateArrivals}
                  extraWorkedDays={monthlyStats.extraWorkedDays}
                  totalHoursFormatted={monthlyStats.totalHoursFormatted}
                  avgPerDayFormatted={monthlyStats.avgPerDayFormatted}
                  totalCalendarDays={monthlyStats.totalCalendarDays}
                  totalWorkingDays={monthlyStats.totalWorkingDays}
                  totalNonWorkingDays={monthlyStats.totalNonWorkingDays}
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
