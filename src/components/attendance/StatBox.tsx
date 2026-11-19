// pages/attendance/components/StatBox.tsx

import { ReactNode } from "react";

interface StatBoxProps {
  label: string;
  value: number | string;
  valueColor?: string;
  icon?: ReactNode;
}

export const StatBox = ({ label, value, valueColor = "text-slate-900", icon }: StatBoxProps) => (
  <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-200/60 transition-all hover:shadow-sm hover:border-slate-300/80">
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      {icon && <span className="text-slate-400">{icon}</span>}
    </div>
    <p className={`mt-1.5 text-xl font-bold ${valueColor}`}>{value}</p>
  </div>
);