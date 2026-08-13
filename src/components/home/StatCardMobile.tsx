import { cn } from "@/lib/utils";

interface StatCardMobileProps {
  icon: JSX.Element;
  label: string;
  value: string;
  color: "blue" | "emerald" | "purple" | "orange" | "red" | "gray";
  large?: boolean;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-slate-100 text-slate-600",
};

export const StatCardMobile = ({
  icon,
  label,
  value,
  color,
  large = false,
}: StatCardMobileProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-300/50 bg-transparent transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30",
        large ? "p-4" : "p-3",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium text-slate-500",
              large ? "text-sm" : "text-[10px]",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-semibold text-blue-900",
              large ? "mt-1 text-xl" : "mt-0.5 text-base",
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-xl",
            large ? "ml-2 p-2.5" : "ml-1.5 p-1.5",
            colorMap[color],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};