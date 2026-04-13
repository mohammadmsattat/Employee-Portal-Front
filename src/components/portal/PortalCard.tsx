import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PortalCardProps {
  children: ReactNode;
  className?: string;
}

const PortalCard = ({ children, className }: PortalCardProps) => {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PortalCard;
