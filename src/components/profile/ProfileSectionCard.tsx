import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const ProfileSectionCard = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
}: ProfileSectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 rounded-[24px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
};

export default ProfileSectionCard;
