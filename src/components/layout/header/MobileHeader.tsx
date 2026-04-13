import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Globe, Search } from "lucide-react";
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
        <div className="overflow-hidden rounded-b-[32px] border-b border-white/40 bg-[linear-gradient(135deg,#eaf2ff_0%,#eef2ff_42%,#f8fbff_100%)] shadow-[0_10px_30px_rgba(37,99,235,0.10)]">
          <div className="relative px-4 pt-4 pb-6">
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-8 top-16 h-28 w-28 rounded-full bg-blue-200/25 blur-2xl" />
              <div className="absolute right-[-20px] top-[-10px] h-36 w-36 rounded-full bg-violet-200/20 blur-2xl" />
              <div className="absolute bottom-[-18px] right-10 h-24 w-24 rounded-full bg-sky-200/20 blur-2xl" />

              <div className="absolute right-0 top-0 h-full w-[46%] opacity-[0.08]">
                <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(59,130,246,0.25)_100%)]" />
              </div>
            </div>

            <div className="relative">
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {config.showBrand && (
                    <Link
                      to="/"
                      className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white/70 backdrop-blur"
                    >
                      <img src={logo} alt="Logo" className="h-6 w-auto" />
                      <span className="text-sm font-semibold text-slate-900">
                        Smart HR
                      </span>
                    </Link>
                  )}

                  <p className="truncate text-sm font-medium text-slate-500">
                    {t("navigation.welcome") || "Welcome back"}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-1 ring-white/70 shadow-sm">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="bg-white text-blue-700 font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h1 className="truncate text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                        {userName || config.title}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {config.showLanguage && (
                    <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/70 px-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-white/70 backdrop-blur transition hover:bg-white/80">
                      <Globe className="h-4 w-4" />
                      {i18n.language.toUpperCase()}
                    </button>
                  )}

                  {config.showNotifications && (
                    <button
                      aria-label="Notifications"
                      className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-slate-800 shadow-sm ring-1 ring-white/70 backdrop-blur transition hover:bg-white/80"
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
                      className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-slate-800 shadow-sm ring-1 ring-white/70 backdrop-blur transition hover:bg-white/80"
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

              {/* Hero content */}
              <div className="mt-8">
                <div className="max-w-[220px]">
                  <div className="text-[40px] font-bold leading-none tracking-[-0.05em] text-slate-900">
                    12 <span className="text-slate-400">Days</span>
                  </div>

                  <p className="mt-2 text-base font-medium text-slate-700">
                    Available Leave Balance
                  </p>

                  {config.showSubtitle && config.subtitle ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {config.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl md:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {config.showBack ? (
              <button
                onClick={config.onBack}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
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
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
              </button>
            )}

            {config.showLanguage && (
              <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Globe className="h-4 w-4" />
                {i18n.language.toUpperCase()}
              </button>
            )}

            {config.rightActions?.map((action) => (
              <button
                key={action.key}
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
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
