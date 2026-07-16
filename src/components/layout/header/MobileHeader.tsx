import { useState } from "react";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import { Link } from "react-router-dom";
import { MobileHeaderConfig } from "@/interfaces/header";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import logo from "../../../../public/logo.png";

import {
  Globe,
  Menu,
  Home,
  X,
  Clock3,
  CalendarDays,
  HandCoins,
  FileText,
  User,
  Settings,
} from "lucide-react";

interface MobileHeaderProps {
  config: MobileHeaderConfig;
}

const MobileHeader = ({ config }: MobileHeaderProps) => {
  const {
    t,
    userName,
    userEmail,
    userInitials,
    userSubtitle,
    isActive,
    handleLogout,
    i18n,
  } = useTopbar();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      to: "/",
      icon: Home,
    },
    { label: "Attendance", to: "/attendance", icon: Clock3 },
    { label: "Leave", to: "/leaves/Leaves", icon: CalendarDays },
    {
      label: "Advance",
      to: "/advance/my-advance-requests",
      icon: HandCoins,
    },
    {
      label: "Overtime",
      to: "/overtime/my-overtime-requests",
      icon: FileText,
    },
    {
      label: "Tasks",
      to: "/tasks",
      icon: User,
    },
    {
      label: "Settings",
      // to: "/settings",
      icon: Settings,
    },
  ];

  return (
    <header
      className={`sticky top-0 ${menuOpen ? "z-[100]" : "z-50"} border-b border-slate-200 bg-white shadow-sm md:hidden `}
    >
      <div className="relative  px-4 py-4">
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r " />

        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="SmartHR"
              className="h-9 w-9 rounded-xl object-contain"
            />

            <div>
              <p className="text-base font-bold text-blue-700">SmartHR</p>
              <p className="max-w-[180px] truncate text-[11px] text-slate-500">
                Empoyee Portal
              </p>{" "}
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {config.showLanguage && (
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Globe className="h-4 w-4" />
                {i18n.language.toUpperCase()}
              </button>
            )}
            {config.showNotifications && (
              <NotificationsDropdown
                open={notificationOpen}
                onOpenChange={(value) => {
                  setNotificationOpen(value);
                }}
              />
            )}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setNotificationOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
              >
                <Menu className="h-5 w-5 text-slate-700" />
              </button>

              {/* Overlay */}
              <div
                className={`fixed inset-0 z-[110] bg-slate-950/40 transition-opacity duration-300
 ${
   menuOpen
     ? "opacity-100 pointer-events-auto"
     : "opacity-0 pointer-events-none"
 }`}
                onClick={() => setMenuOpen(false)}
              />

              {/* Side Menu */}
              <div
                className={`fixed top-0 right-0 z-[120] h-screen w-[85vw] max-w-sm bg-white opacity-100 shadow-2xl isolate transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "translate-x-full"} `}
              >
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Navigation
                    </p>

                    <p className="text-xs text-slate-500">Employee Portal</p>
                  </div>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 "
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex h-full flex-col p-4">
                  {/* Main Navigation */}
                  <div>
                    {navItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className=" flex items-center gap-4 border-b border-slate-100 px-2 py-4 text-sm font-semibold  text-slate-700 transition hover:bg-slate-50 "
                        >
                          <Icon className="h-5 w-5 text-blue-600" />

                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
