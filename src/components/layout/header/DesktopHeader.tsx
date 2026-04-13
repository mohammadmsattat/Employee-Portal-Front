import { Link } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import logo from "../../../../public/logo.png";

const DesktopHeader = () => {
  const { t, userName, userInitials, navLink } = useTopbar();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
              <img
                src={logo}
                alt="Smart Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-slate-900">
                Smart HR
              </p>
              <p className="text-xs text-slate-500">Employee Portal</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/" className={navLink("/")}>
              {t("navigation.home")}
            </Link>

            <Link to="/attendance" className={navLink("/attendance")}>
              {t("navigation.attendance")}
            </Link>

            <Link to="/profile" className={navLink("/profile")}>
              {t("navigation.myProfile")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Bell className="h-5 w-5" />
          </button>

          <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            EN
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-slate-50">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="text-left">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>
              <p className="text-xs text-slate-500">Employee</p>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
