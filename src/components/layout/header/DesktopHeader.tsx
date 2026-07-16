import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import logo from "../../../../public/logo.png";

import {
  CalendarDays,
  Clock3,
  FileText,
  HandCoins,
  Home,
  User,
  LogOut,
} from "lucide-react";

const DesktopHeader = () => {
  const {
    t,
    userName,
    userEmail,
    userInitials,
    userSubtitle,
    isActive,
    handleLogout,
  } = useTopbar();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (headerRef.current && !headerRef.current.contains(target)) {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: t("navigation.home"), to: "/", icon: Home },
    { label: t("navigation.attendance"), to: "/attendance", icon: Clock3 },
    { label: t("navigation.leave"), to: "/leaves/Leaves", icon: CalendarDays },
    {
      label: t("navigation.overtime"),
      to: "/overtime/my-overtime-requests",
      icon: FileText,
    },
    {
      label: t("navigation.advance"),
      to: "/advance/my-advance-requests",
      icon: HandCoins,
    },
    {
      label: t("navigation.tasks"),
      to: "/tasks",
      icon: User,
    },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 hidden h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xl md:flex"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src={logo}
              alt="SmartHR"
              className="h-9 w-9 rounded-lg object-contain ring-1 ring-slate-200/50"
            />
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-blue-700 leading-tight">
                SmartHR
              </p>
              <p className="max-w-[160px] truncate text-[10px] text-slate-500 leading-tight">
                Empoyee Portal
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center justify-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 lg:px-4
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100/50"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
                >
                  <Icon className="h-4 w-4 shrink-0 " />
                  <span className="hidden lg:inline ">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <NotificationsDropdown
              open={notificationOpen}
              onOpenChange={(value) => {
                setNotificationOpen(value);
                if (value) {
                  setProfileOpen(false);
                }
              }}
            />

            {/* PROFILE */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setNotificationOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-50 font-bold text-blue-700">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                  {/* USER INFO */}
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-50 text-sm font-bold text-blue-700">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  {/* MENU */}
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      {t("navigation.myProfile")}
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("navigation.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-16 md:block" />
    </>
  );
};

export default DesktopHeader;
