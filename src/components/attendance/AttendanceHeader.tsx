// pages/attendance/components/AttendanceHeader.tsx

import { ReactNode } from "react";
import {
  Fingerprint,
  Layers,
  CalendarDays,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterType } from "@/hooks/Attendance/useAttendanceFilters";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  max?: string;
  min?: string;
  placeholder?: string;
}

const DateInput = ({ value, onChange, max, min, placeholder }: DateInputProps) => (
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

interface AttendanceHeaderProps {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  filteredCount: number;
  i18n: any;
  today: string;
  resetFilters: () => void;
  getFilterLabel: (locale: string) => string;
}

export const AttendanceHeader = ({
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
  filteredCount,
  i18n,
  today,
  resetFilters,
  getFilterLabel,
}: AttendanceHeaderProps) => {
  const isFilterActive = filterType !== "all";

  return (
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
            { value: "all" as FilterType, label: "All", icon: <Layers className="h-4 w-4" /> },
            {
              value: "month" as FilterType,
              label: "Month",
              icon: <CalendarDays className="h-4 w-4" />,
            },
            {
              value: "custom" as FilterType,
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
        {isFilterActive && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100/60 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-medium">{getFilterLabel(i18n.language)}</span>
            <span className="text-blue-400">·</span>
            <span>{filteredCount} days</span>
          </div>
        )}

        {/* Clear Filter */}
        {isFilterActive && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 px-3 py-1.5 rounded-full transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};