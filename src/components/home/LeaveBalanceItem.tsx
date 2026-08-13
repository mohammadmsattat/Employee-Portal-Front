import { AlertCircle } from "lucide-react";

interface LeaveBalanceItemProps {
  type: string;
  used: number;
  total: number;
  remaining: number;
}

export const LeaveBalanceItem = ({
  type,
  used,
  total,
  remaining,
}: LeaveBalanceItemProps) => {
  const percentage = (used / total) * 100;
  const isLow = remaining <= 2;

  return (
    <div className="group rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm active:scale-[0.99] sm:p-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            <p className="text-sm font-medium text-slate-700 sm:text-sm truncate">
              {type}
            </p>
            {isLow && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 sm:px-2 sm:py-0.5 sm:text-[10px]">
                <AlertCircle className="h-3 w-3 sm:h-3 sm:w-3" />
                Low
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 sm:mt-1.5 sm:gap-2 sm:text-xs">
            <span>{used}d used</span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300 sm:h-1 sm:w-1" />
            <span>{total}d total</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLow ? "bg-red-400" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex min-w-[58px] shrink-0 flex-col items-center rounded-lg bg-slate-50 px-2.5 py-2 sm:min-w-[58px] sm:px-2.5 sm:py-2">
          <p
            className={`text-lg font-semibold ${isLow ? "text-red-500" : "text-slate-800"} sm:text-lg`}
          >
            {remaining}
          </p>
          <p className="text-xs text-slate-500 sm:text-[10px]">days left</p>
        </div>
      </div>
    </div>
  );
};