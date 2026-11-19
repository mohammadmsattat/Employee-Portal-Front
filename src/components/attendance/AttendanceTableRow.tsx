// pages/attendance/components/AttendanceTableRow.tsx

import { Fragment } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, LogIn, LogOut, Timer, Clock } from "lucide-react";
import { AttendanceFingerprint } from "@/interfaces/attendance";
import { StatusBadge } from "./StatusBadge";
import { AttendanceLogRow } from "./AttendanceLogRow";
import { AttendanceDayGroup, getDuration } from "@/lib/attendanceHelpers";

interface AttendanceTableRowProps {
  group: AttendanceDayGroup;
  expandedDay: string | null;
  setExpandedDay: (day: string | null) => void;
  dateFormatter: (date: Date) => string;
}

export const AttendanceTableRow = ({
  group,
  expandedDay,
  setExpandedDay,
  dateFormatter,
}: AttendanceTableRowProps) => {
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
                {dateFormatter(new Date(group.date))}
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
                    {dateFormatter(new Date(group.date))}
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