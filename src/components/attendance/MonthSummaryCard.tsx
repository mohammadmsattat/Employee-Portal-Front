import {
  CalendarDays,
  XCircle,
  AlertCircle,
  Timer,
  BarChart3,
  ArrowRight,
  Calendar,
  CalendarPlus,
} from "lucide-react";

import PortalCard from "@/components/portal/PortalCard";
import { StatBox } from "./StatBox";

interface MonthSummaryCardProps {
  selectedYear: number;
  selectedMonth: number;
  i18n: any;

  totalWorkedDays: number;
  absentDays: number;
  lateArrivals: number;
  extraWorkedDays: number;

  totalHoursFormatted: string;
  avgPerDayFormatted: string;

  totalCalendarDays?: number;
  totalWorkingDays?: number;
  totalNonWorkingDays?: number;
}

export const MonthSummaryCard = ({
  selectedYear,
  selectedMonth,
  i18n,
  totalWorkedDays,
  absentDays,
  lateArrivals,
  extraWorkedDays,
  totalHoursFormatted,
  avgPerDayFormatted,
  totalCalendarDays,
  totalWorkingDays,
  totalNonWorkingDays,
}: MonthSummaryCardProps) => {
  const monthName = new Date(selectedYear, selectedMonth).toLocaleString(
    i18n.language,
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <PortalCard>
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 ring-1 ring-purple-100">
            <BarChart3 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Monthly Summary</h3>

            <p className="text-sm text-slate-500">{monthName}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats Grid */}
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
            label="Extra Worked Days"
            value={extraWorkedDays}
            valueColor="text-emerald-600"
            icon={<CalendarPlus className="h-3.5 w-3.5" />}
          />
        </div>

        {/* Working Hours Summary */}
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

        {/* Calendar Days Info */}
        {(totalCalendarDays !== undefined ||
          totalWorkingDays !== undefined) && (
          <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />

              <span className="text-xs text-slate-500">
                {totalCalendarDays || 0} Calendar Days
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-600">
                {totalWorkingDays || 0} Working
              </span>

              <span className="text-slate-300">|</span>

              <span className="text-slate-400">
                {totalNonWorkingDays || 0} Non-Working
              </span>
            </div>
          </div>
        )}

        {/* View Details Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm group">
          <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
            View Full Details
          </span>

          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" />
        </button>
      </div>
    </PortalCard>
  );
};
