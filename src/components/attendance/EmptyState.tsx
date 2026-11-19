// pages/attendance/components/EmptyState.tsx

import { FilterType } from "@/hooks/Attendance/useAttendanceFilters";
import { Clock } from "lucide-react";

interface EmptyStateProps {
  filterType: FilterType;
  selectedMonth: number;
  selectedYear: number;
  startDate: string;
  endDate: string;
  i18n: any;
}

export const EmptyState = ({
  filterType,
  selectedMonth,
  selectedYear,
  startDate,
  endDate,
  i18n,
}: EmptyStateProps) => (
  <div className="px-5 py-16 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
      <Clock className="h-8 w-8" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">No attendance records</h3>
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