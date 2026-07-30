import { useState } from "react";
import { useTopbar } from "@/hooks/Topbar/useTopbar";
import { Link } from "react-router-dom";
import { MobileHeaderConfig } from "@/interfaces/header";
import NotificationsDropdown from "@/components/NotificationsDropdown";

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
    user,
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

  // Helper function to safely get department name
  const getDepartmentName = (dept: any): string => {
    if (!dept) return "Engineering";
    if (typeof dept === "string") return dept;
    if (dept.name) return dept.name;
    if (dept.AlternativeName) return dept.AlternativeName;
    return "Engineering";
  };

  // Helper function to safely get position/job title
  const getPosition = (pos: any): string => {
    if (!pos) return "Employee";
    if (typeof pos === "string") return pos;
    if (pos.name) return pos.name;
    if (pos.title) return pos.title;
    if (pos.jobTitle) return pos.jobTitle;
    return "Employee";
  };

  // Get user image URL
  const getUserImage = (): string | null => {
    if (user?.profileImage) {
      // If it's a full URL, use it directly
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }
      // Otherwise, prepend the base URL
      return `http://localhost:8001${user.profileImage}`;
    }
    return null;
  };

  const navItems = [
    {
      label: t("navigation.home") || "Home",
      to: "/",
      icon: Home,
    },
    { 
      label: t("navigation.attendance") || "Attendance", 
      to: "/attendance", 
      icon: Clock3 
    },
    { 
      label: t("navigation.leave") || "Leave", 
      to: "/leaves/Leaves", 
      icon: CalendarDays 
    },
    {
      label: t("navigation.advance") || "Advance",
      to: "/advance/my-advance-requests",
      icon: HandCoins,
    },
    {
      label: t("navigation.overtime") || "Overtime",
      to: "/overtime/my-overtime-requests",
      icon: FileText,
    },
    {
      label: t("navigation.tasks") || "Tasks",
      to: "/tasks",
      icon: User,
    },
    {
      label: t("navigation.settings") || "Settings",
      to: "/settings",
      icon: Settings,
    },
  ];

  return (
 <header
  className={`sticky top-0 ${menuOpen ? "z-[100]" : "z-50"} bg-whie border-b border-slate-200 shadw-sm md:hidden`}
>
  <div className="px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      {/* Left Side - User Info - مساحة أكبر */}
      <div className="flex items-center gap-3 flex-[2] min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200/50 ring-2 ring-white/80">
          {getUserImage() ? (
            <img
              src={getUserImage()!}
              alt={user?.fullName || "User"}
              className="h-full w-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.className = 'text-base font-bold';
                  span.textContent = user?.fullName?.charAt(0) || 'U';
                  parent.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-base font-bold">
              {user?.fullName?.charAt(0) || "U"}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-blue-600">
            Good Morning
          </p>
          <p className="text-base font-bold text-blue-900 truncate">
            {user?.fullName || userName || "Employee"}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="truncate max-w-[100px] font-medium">
              {getPosition(user?.position)}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="truncate max-w-[100px] font-medium">
              {getDepartmentName(user?.department)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {config.showLanguage && (
          <button className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Globe className="h-3.5 w-3.5" />
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
        <button
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setNotificationOpen(false);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-50"
        >
          <Menu className="h-4.5 w-4.5 text-slate-500" />
        </button>
      </div>
    </div>
  </div>

  {/* Overlay */}
  <div
    className={`fixed inset-0 z-[110] bg-slate-950/40 transition-opacity duration-300 ${
      menuOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }`}
    onClick={() => setMenuOpen(false)}
  />

  {/* Side Menu */}
  <div
    className={`fixed top-0 right-0 z-[120] h-screen w-[85vw] max-w-sm bg-white shadow-2xl isolate transition-transform duration-300 ${
      menuOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
      <div>
        <p className="text-base font-bold text-slate-900">
          {t("navigation.menu") || "Navigation"}
        </p>
        <p className="text-xs text-slate-500">
          {t("navigation.employeePortal") || "Employee Portal"}
        </p>
      </div>

      <button
        onClick={() => setMenuOpen(false)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <div className="flex h-full flex-col p-4">
      <div>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 border-b border-slate-100 px-2 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Icon className="h-5 w-5 text-blue-600" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
</header>
  );
};

export default MobileHeader;