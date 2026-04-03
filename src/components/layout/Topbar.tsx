import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import usFlag from "../../../public/en.png";
import saFlag from "../../../public/ar.svg";
import {
  Globe,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  User,
  CalendarDays,
  Clock,
  HandCoins,
  FileText,
  CheckCircle2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import logo from "../../../public/logo.png";
import { useTopbar } from "@/hooks/Topbar/useTopbar";

const Topbar = () => {
  const {
    t,
    i18n,
    userName,
    userEmail,
    userInitials,
    requestsOpen,
    setRequestsOpen,
    userOpen,
    setUserOpen,
    activeDesktopSection,
    setActiveDesktopSection,
    isActive,
    navLink,
    handleLogout,
    changeLanguage,
  } = useTopbar();

  const requestSections = [
    {
      title: t("navigation.leave"),
      base: "leave",
      icon: CalendarDays,
      links: [
        {
          title: t("navigation.myLeaveRequests"),
          path: "/leaves/Leave-requests",
          icon: FileText,
        },
        {
          title: t("navigation.approveLeaveRequests"),
          path: "/leaves/manager-leave-requests",
          icon: CheckCircle2,
        },
      ],
    },
    {
      title: t("navigation.overtime"),
      base: "overtime",
      icon: Clock,
      links: [
        {
          title: t("navigation.myOvertimeRequests"),
          path: "/overtime/my-overtime-requests",
          icon: FileText,
        },
        {
          title: t("navigation.approveOvertimeRequests"),
          path: "/overtime/manager-overtime-requests",
          icon: CheckCircle2,
        },
      ],
    },
    {
      title: t("navigation.advance"),
      base: "advance",
      icon: HandCoins,
      links: [
        {
          title: t("navigation.myAdvances"),
          path: "/advance/my-advance-requests",
          icon: FileText,
        },
        {
          title: t("navigation.approveAdvances"),
          path: "/advance/manager-advance-requests",
          icon: CheckCircle2,
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-49 border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <img
            src={logo}
            alt="Smart Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="leading-none">Smart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className={navLink("/")}>
            {t("navigation.home")}
          </Link>

          <Popover open={requestsOpen} onOpenChange={setRequestsOpen}>
            <PopoverTrigger asChild>
              <button
                className={`${navLink("/requests")} flex items-center gap-1`}
                onClick={() => setRequestsOpen((prev) => !prev)}
              >
                {t("navigation.requests")} <ChevronDown size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[260px] p-2 shadow-xl rounded-xl"
              onMouseLeave={() => setActiveDesktopSection(null)}
            >
              <div className="relative">
                {requestSections.map((section) => {
                  const isActiveSection = activeDesktopSection === section.base;
                  return (
                    <div
                      key={section.base}
                      className="relative"
                      onMouseEnter={() => setActiveDesktopSection(section.base)}
                    >
                      <div className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <section.icon size={16} className="text-primary" />
                          {section.title}
                        </div>
                        <ChevronRight
                          size={14}
                          style={{
                            transform:
                              i18n.language === "ar" ? "scaleX(-1)" : "none",
                          }}
                        />
                      </div>
                      {isActiveSection && (
                        <div
                          className={`absolute top-0 ${
                            i18n.language === "ar"
                              ? "right-[104%]"
                              : "left-[104%]"
                          } w-[240px] bg-card border rounded-lg shadow-lg p-2`}
                        >
                          {" "}
                          {section.links.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-muted"
                            >
                              <link.icon size={15} />
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Link to="/attendance" className={navLink("/attendance")}>
            {t("navigation.attendance")}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NotificationsDropdown />

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-muted transition-colors">
                <Globe className="h-4 w-4" /> {i18n.language.toUpperCase()}{" "}
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36 rounded-xl p-2">
              <div className="flex flex-col gap-1">
                {/* English */}
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex items-center gap-1 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                    i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <img
                    src={usFlag}
                    alt="US Flag"
                    className="h-4 w-4 rounded-sm"
                  />
                  <span>{t("navigation.english")}</span>
                </button>

                {/* Arabic */}
                <button
                  onClick={() => changeLanguage("ar")}
                  className={`flex items-center gap-1 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                    i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <img
                    src={saFlag}
                    alt="Saudi Flag"
                    className="h-4 w-4 rounded-sm"
                  />
                  <span>{t("navigation.arabic")}</span>
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={userOpen} onOpenChange={setUserOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md"
              >
                <User className="h-4 w-4" /> {t("navigation.myProfile")}
              </Link>

              <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">
                <Settings className="h-4 w-4" /> {t("navigation.settings")}
              </div>

              <DropdownMenuSeparator />

              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> {t("navigation.signOut")}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
