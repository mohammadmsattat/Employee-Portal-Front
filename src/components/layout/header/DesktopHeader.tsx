import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  FileText,
  HandCoins,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import logo from "../../../../public/logo.png";
import NotificationsDropdown from "@/components/NotificationsDropdown";

const DesktopHeader = () => {
  const { t, userName, userInitials, isActive, handleLogout } = useTopbar();

  const navItems = [
    { label: t("navigation.home"), to: "/", icon: Home },
    { label: t("navigation.attendance"), to: "/attendance", icon: Clock3 },
    { label: t("navigation.leave"), to: "/leaves/Leaves", icon: CalendarDays },
    {
      label: t("navigation.advance"),
      to: "/advance/my-advance-requests",
      icon: HandCoins,
    },
    {
      label: t("navigation.overtime"),
      to: "/overtime/my-overtime-requests",
      icon: FileText,
    },
    { label: t("navigation.tasks"), to: "/tasks", icon: User },
    { label: t("navigation.myProfile"), to: "/profile", icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[104px] border-r border-slate-200/80 bg-white/95 px-3 py-4 shadow-[12px_0_40px_rgba(15,23,42,0.06)] backdrop-blur md:flex md:flex-col">
      <div className="flex flex-1 flex-col items-center">
        <Link
          to="/"
          className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600 shadow-[0_14px_28px_rgba(37,99,235,0.22)]"
          aria-label="Smart HR"
        >
          <img
            src={logo}
            alt="Smart Logo"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </Link>

        <nav className="flex w-full flex-1 flex-col items-stretch gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center transition ${
                  active
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate text-[11px] font-semibold leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
        <NotificationsDropdown />

        <Link
          to="/profile"
          className="flex flex-col items-center gap-2 rounded-lg p-2 transition hover:bg-slate-50"
          title={userName}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-blue-50 text-sm font-bold text-blue-700">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={t("navigation.signOut")}
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};

export default DesktopHeader;
