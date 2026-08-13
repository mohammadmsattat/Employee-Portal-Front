import { cn } from "@/lib/utils";

interface StatCardWebProps {
  icon: JSX.Element;
  label: string;
  value: string;
  color: "blue" | "emerald" | "purple" | "orange" | "red" | "gray";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-slate-100 text-slate-600",
};

export const StatCardWeb = ({ icon, label, value, color }: StatCardWebProps) => {
  return (
    <div className="group rounded-2xl bg-whte p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-md hover:ring-blue-300/50">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-blue-900">{value}</p>
        </div>
        <div className={`ml-3 shrink-0 rounded-xl p-2.5 ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};