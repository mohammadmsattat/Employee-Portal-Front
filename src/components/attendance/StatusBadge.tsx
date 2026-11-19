// pages/attendance/components/StatusBadge.tsx

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isComplete: boolean;
  hasCheckIn: boolean;
  compact?: boolean;
}

export const StatusBadge = ({ isComplete, hasCheckIn, compact = false }: StatusBadgeProps) => {
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