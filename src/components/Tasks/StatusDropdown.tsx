import { useEffect, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

// ==================== TYPES ====================
export type TaskStatus =
  | "todo"
  | "in_progress"
  | "review"
  | "pending"
  | "on_hold"
  | "done"
  | "cancelled";

interface StatusOption {
  value: TaskStatus;
  label: string;
  bg: string;
  text: string;
  dot: string;
  hover: string;
}

interface StatusDropdownProps {
  status: TaskStatus;
  onChange?: (newStatus: TaskStatus) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md";
}

// ==================== CONFIG ====================
const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "todo",
    label: "To Do",
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    hover: "hover:bg-slate-50",
  },
  {
    value: "in_progress",
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    hover: "hover:bg-blue-50",
  },
  {
    value: "review",
    label: "Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    hover: "hover:bg-amber-50",
  },
  {
    value: "pending",
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
    hover: "hover:bg-yellow-50",
  },
  {
    value: "on_hold",
    label: "On Hold",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    hover: "hover:bg-purple-50",
  },
  {
    value: "done",
    label: "Done",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    hover: "hover:bg-emerald-50",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    hover: "hover:bg-red-50",
  },
];

const getConfig = (status: TaskStatus): StatusOption => {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
};

// ==================== COMPONENT ====================
const StatusDropdown = ({
  status,
  onChange,
  disabled = false,
  loading = false,
  size = "sm",
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = getConfig(status);

  // ======================================
  // COMPUTE DROPDOWN POSITION
  // ======================================
  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 280; // max height
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenUp = spaceBelow < dropdownHeight + 20;

    setDropdownStyle({
      position: "fixed",
      top: shouldOpenUp ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
      transform: shouldOpenUp ? "translateY(-100%)" : "translateY(0)",
      zIndex: 9999,
      minWidth: Math.max(rect.width, 180),
    });
  };

  // ======================================
  // TOGGLE
  // ======================================
  const handleToggle = () => {
    if (disabled || loading) return;

    if (!isOpen) {
      updatePosition();
    }

    setIsOpen((p) => !p);
  };

  // ======================================
  // UPDATE POSITION ON SCROLL/RESIZE
  // ======================================
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updatePosition();

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen]);

  // ======================================
  // CLOSE ON OUTSIDE CLICK
  // ======================================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ======================================
  // CLOSE ON ESCAPE
  // ======================================
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // ======================================
  // SELECT
  // ======================================
  const handleSelect = (newStatus: TaskStatus) => {
    setIsOpen(false);

    if (newStatus === status) return;

    onChange?.(newStatus);
  };

  const sizeClasses =
    size === "md" ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]";

  return (
    <>
      {/* TRIGGER */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`
          inline-flex items-center gap-1.5 rounded-full border
          ${currentConfig.bg} ${currentConfig.text}
          border-transparent
          ${sizeClasses}
          font-semibold whitespace-nowrap
          transition-all
          ${
            disabled || loading
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:shadow-sm active:scale-95"
          }
        `}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${currentConfig.dot}`} />
        <span>{currentConfig.label}</span>

        {!disabled && !loading && (
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}

        {loading && (
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
      </button>

      {/* DROPDOWN - Rendered via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="
              bg-white border border-slate-200 rounded-xl
              shadow-2xl overflow-hidden
            "
          >
            <div className="max-h-[280px] overflow-y-auto py-1">
              {STATUS_OPTIONS.map((option) => {
                const isCurrent = option.value === status;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center gap-2.5
                      px-3 py-2 text-left text-sm
                      transition-colors whitespace-nowrap
                      ${option.hover}
                      ${isCurrent ? "bg-slate-50" : ""}
                    `}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${option.dot} shrink-0`}
                    />
                    <span
                      className={`flex-1 ${
                        isCurrent
                          ? "font-semibold text-slate-800"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isCurrent && (
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default memo(StatusDropdown);
