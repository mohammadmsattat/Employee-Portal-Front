// pages/attendance/components/AttendanceMobileCard.tsx

import { ChevronDown, CalendarDays, Fingerprint, Clock } from "lucide-react";
import { AttendanceFingerprint } from "@/interfaces/attendance";
import { StatusBadge } from "./StatusBadge";
import { AttendanceLogRow } from "./AttendanceLogRow";
import { AttendanceDayGroup, getDuration } from "@/lib/attendanceHelpers";

interface AttendanceMobileCardProps {
  group: AttendanceDayGroup;
  expandedDay: string | null;
  setExpandedDay: (day: string | null) => void;
  dateFormatter: (date: Date) => string;
}

export const AttendanceMobileCard = ({
  group,
  expandedDay,
  setExpandedDay,
  dateFormatter,
}: AttendanceMobileCardProps) => {
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
              {dateFormatter(new Date(group.date))}
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