// pages/attendance/components/TodayTimelineCard.tsx

import {
  Clock,
  Timer,
  LogIn,
  LogOut,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PortalCard from "@/components/portal/PortalCard";
import { AttendanceFingerprint } from "@/interfaces/attendance";

interface TodayTimelineCardProps {
  dateFormatter: (date: Date) => string;
  todayLogs: AttendanceFingerprint[];
  calculateWorkingHours: () => string;
}

export const TodayTimelineCard = ({
  dateFormatter,
  todayLogs = [],
  calculateWorkingHours,
}: TodayTimelineCardProps) => {
  const sortedLogs = [...todayLogs].sort((a, b) => a.Time.localeCompare(b.Time));
  const totalLogs = sortedLogs.length;

  const hasCheckIn = sortedLogs.some((l) => l.type === "Check-in");
  const hasCheckOut = sortedLogs.some((l) => l.type === "Check-out");
  const isComplete = hasCheckIn && hasCheckOut;

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
                {dateFormatter(new Date())}
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
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : hasCheckIn
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-50 text-slate-400"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : hasCheckIn ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isComplete ? "Complete" : hasCheckIn ? "Partial" : "Absent"}
            </span>
          </div>
        </div>

        {/* Timeline */}
        {totalLogs > 0 ? (
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-0">
              {sortedLogs.map((record, index) => {
                const isCheckIn = record.type === "Check-in";
                const isFirst = index === 0;
                const isLast = index === totalLogs - 1;

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
                            isCheckIn ? "border-emerald-500" : "border-rose-500",
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
                              {isFirst ? "Start" : isLast ? "Latest" : `#${index + 1}`}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-600 tabular-nums">
                            {record.Time}
                          </span>
                        </div>

                        {!isLast && <div className="mt-2 border-t border-slate-100/80" />}
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
                  {todayLogs.filter((l) => l.type === "Check-in").length} IN
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] text-slate-500">
                  {todayLogs.filter((l) => l.type === "Check-out").length} OUT
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100/60 text-slate-300">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">No records today</p>
            <p className="text-xs text-slate-400 mt-1">
              Your check-ins and check-outs will appear here
            </p>
          </div>
        )}
      </div>
    </PortalCard>
  );
};