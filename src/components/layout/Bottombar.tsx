import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Fingerprint,
  CalendarDays,
  Clock3,
  HandCoins,
  X,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface BottombarProps {
  openModal: (type: "leave" | "advance" | "overtime") => void;
  onAttendanceAction?: () => void;
  attendanceLabel?: string;
}

const Bottombar = ({
  openModal,
  onAttendanceAction,
  attendanceLabel,
}: BottombarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [requestsOpen, setRequestsOpen] = useState(false);

  const activeKey = useMemo(() => {
    const path = location.pathname;

    if (path === "/") return "home";
    if (path.startsWith("/profile") || path.startsWith("/settings"))
      return "profile";

    return "";
  }, [location.pathname]);

  const navItems = [
    {
      key: "home",
      label: t("navigation.home"),
      icon: Home,
      to: "/",
      type: "link" as const,
    },
    {
      key: "attendance",
      label: attendanceLabel || t("navigation.attendance"),
      icon: Fingerprint,
      type: "action" as const,
      onClick: onAttendanceAction,
    },
    {
      key: "requests",
      label: t("navigation.requests"),
      icon: ChevronUp,
      type: "action" as const,
      onClick: () => setRequestsOpen((prev) => !prev),
      forceActive: requestsOpen,
    },
    {
      key: "profile",
      label: t("navigation.myProfile"),
      icon: User,
      to: "/profile",
      type: "link" as const,
    },
  ];

  const requestActions = [
    {
      key: "leave",
      label: t("buttons.requestLeave"),
      icon: CalendarDays,
      onClick: () => openModal("leave"),
      iconClass: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    },
    {
      key: "advance",
      label: t("buttons.requestAdvance"),
      icon: HandCoins,
      onClick: () => openModal("advance"),
      iconClass: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    },
    {
      key: "overtime",
      label: t("buttons.requestOvertime"),
      icon: Clock3,
      onClick: () => openModal("overtime"),
      iconClass: "bg-orange-50 text-orange-600 ring-1 ring-orange-100",
    },
  ];

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${
          requestsOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setRequestsOpen(false)}
      />

      {/* requests sheet */}
      <div
        className={`fixed inset-x-4 bottom-24 z-50 transition-all duration-200 md:hidden ${
          requestsOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <p className="text-sm font-semibold text-slate-900">
              {t("navigation.requests")}
            </p>
            <button
              onClick={() => setRequestsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {requestActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.key}
                  onClick={() => {
                    setRequestsOpen(false);
                    setTimeout(() => action.onClick(), 120);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center transition active:scale-[0.98]"
                >
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${action.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[12px] font-semibold leading-4 text-slate-700">
                    {action.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* floating nav */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:hidden">
        <div className="flex w-full max-w-sm items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.forceActive || activeKey === item.key || false;

            const content = (
              <div
                className={`flex h-12 items-center transition-all duration-200 ${
                  isActive
                    ? "rounded-xl bg-blue-600 px-4 text-white shadow-[0_10px_20px_rgba(37,99,235,0.28)]"
                    : "w-12 justify-center rounded-xl text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "" : ""}`} />
                {isActive && (
                  <span className="ml-2 truncate text-sm font-semibold">
                    {item.label}
                  </span>
                )}
              </div>
            );

            if (item.type === "link" && item.to) {
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className="flex items-center"
                  onClick={() => setRequestsOpen(false)}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.key}
                onClick={item.onClick}
                className="flex items-center"
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Bottombar;
