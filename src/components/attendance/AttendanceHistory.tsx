// pages/attendance/components/AttendanceHistory.tsx

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PortalCard from "@/components/portal/PortalCard";
import { Clock, Calendar, CalendarDays } from "lucide-react";
import { AttendanceDayGroup } from "@/lib/attendanceHelpers";
import { FilterType } from "@/hooks/Attendance/useAttendanceFilters";
import { AttendanceTableRow } from "./AttendanceTableRow";
import { AttendanceMobileCard } from "./AttendanceMobileCard";
import { EmptyState } from "./EmptyState";


interface AttendanceHistoryProps {
  filteredDayGroups: AttendanceDayGroup[];
  expandedDay: string | null;
  setExpandedDay: (day: string | null) => void;
  dateFormatter: (date: Date) => string;
  i18n: any;
  filters: {
    filterType: FilterType;
    selectedMonth: number;
    selectedYear: number;
    startDate: string;
    endDate: string;
  };
}

export const AttendanceHistory = ({
  filteredDayGroups,
  expandedDay,
  setExpandedDay,
  dateFormatter,
  i18n,
  filters,
}: AttendanceHistoryProps) => {
  const { filterType, selectedMonth, selectedYear, startDate, endDate } = filters;

  return (
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
                      }
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
       
        </div>
      </div>

      {filteredDayGroups.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 bg-slate-50/80">
                  {["Date", "Check-in", "Check-out", "Duration", "Status", "Actions"].map(
                    (header) => (
                      <TableHead
                        key={header}
                        className="text-center text-xs text-slate-500 tracking-wider"
                      >
                        {header}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDayGroups.map((group) => (
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
            {filteredDayGroups.map((group) => (
              <AttendanceMobileCard
                key={group.date}
                group={group}
                expandedDay={expandedDay}
                setExpandedDay={setExpandedDay}
                dateFormatter={dateFormatter}
              />
            ))}
          </div>

      
        </>
      ) : (
        <EmptyState {...filters} i18n={i18n} />
      )}
    </PortalCard>
  );
};