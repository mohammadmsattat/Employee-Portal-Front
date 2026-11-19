// pages/attendance/components/AttendanceLogRow.tsx

import { LogIn, LogOut, Timer } from "lucide-react";
import { AttendanceFingerprint } from "@/interfaces/attendance";

interface AttendanceLogRowProps {
  record: AttendanceFingerprint;
  compact?: boolean;
}

export const AttendanceLogRow = ({ record, compact = false }: AttendanceLogRowProps) => {
  const isCheckIn = record.type === "Check-in";
  const Icon = isCheckIn ? LogIn : LogOut;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white ${
        compact ? "p-3" : "px-4 py-3"
      }`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          isCheckIn
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {record.type}
      </span>
      <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 px-3 py-2 font-semibold text-slate-900">
        <Timer className="h-4 w-4 text-slate-500" />
        {record.Time}
      </div>
    </div>
  );
};