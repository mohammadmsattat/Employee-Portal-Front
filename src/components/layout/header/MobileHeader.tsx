import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import logo from "../../../../public/logo.png";
import { MobileHeaderConfig } from "@/interfaces/header";

interface MobileHeaderProps {
  config: MobileHeaderConfig;
}

const MobileHeader = ({ config }: MobileHeaderProps) => {
  const { userName, userInitials, i18n, t } = useTopbar();

  const isHomeVariant = !!config.showGreeting;

  if (isHomeVariant) {
    return (
      <header className="sticky top-0 z-50 md:hidden">
        <div className="border-b border-blue-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden px-4 pb-5 pt-4">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-36" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-[linear-gradient(90deg,#2563eb,#93c5fd,#2563eb)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {config.showBrand && (
                    <Link
                      to="/"
                      className="mb-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 ring-1 ring-blue-100"
                    >
                      <img src={logo} alt="Logo" className="h-6 w-auto" />
                      <span className="text-sm font-semibold text-slate-900">
                        Smart HR
                      </span>
                    </Link>
                  )}

                  {/* <p className="truncate text-sm font-medium text-slate-500">
                    {t("navigation.welcome") || "Welcome back"}
                  </p> */}

                  <div className="mt-2 flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarImage src={logo} alt={userName} />
                      <AvatarFallback className="bg-white text-blue-700 font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h1 className="truncate text-[24px] font-bold text-slate-950">
                        SmartHR
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {config.showLanguage && (
                    <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                      <Globe className="h-4 w-4" />
                      {i18n.language.toUpperCase()}
                    </button>
                  )}

                  {config.showNotifications && (
                    <button
                      aria-label="Notifications"
                      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500" />
                    </button>
                  )}

                  {config.rightActions?.map((action) => (
                    <button
                      key={action.key}
                      onClick={action.onClick}
                      aria-label={action.ariaLabel}
                      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50"
                    >
                      {action.icon}
                      {action.badgeCount ? (
                        <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                          {action.badgeCount}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {config.showSubtitle && config.subtitle
                      ? config.subtitle
                      : "Employee workspace"}
                  </p>
                  <p className="mt-1 text-3xl font-bold leading-tight text-slate-950">
                    Smart HR
                  </p>
                </div>
                <div className="rounded-lg bg-blue-600 px-4 py-3 text-right text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)]">
                  <p className="text-2xl font-bold leading-none">12</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase text-blue-100">
                    Days
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl md:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {config.showBack ? (
              <button
                onClick={config.onBack}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft
                  className={`h-5 w-5 ${
                    i18n.language === "ar" ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : null}

            {config.showBrand ? (
              <Link
                to="/"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
              >
                <img src={logo} alt="Logo" className="h-6 w-auto" />
                <span className="text-sm font-semibold text-slate-900">
                  Smart HR
                </span>
              </Link>
            ) : null}

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-900">
                {config.title}
              </h1>

              {config.showSubtitle && config.subtitle ? (
                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {config.subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {config.showNotifications && (
              <button
                aria-label="Notifications"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
              </button>
            )}

            {config.showLanguage && (
              <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Globe className="h-4 w-4" />
                {i18n.language.toUpperCase()}
              </button>
            )}

            {config.rightActions?.map((action) => (
              <button
                key={action.key}
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {action.icon}
                {action.badgeCount ? (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                    {action.badgeCount}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
