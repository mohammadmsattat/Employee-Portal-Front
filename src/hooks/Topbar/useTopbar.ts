import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useTopbar = () => {
  // ===== i18n =====
  const { t, i18n } = useTranslation();

  // ===== Router =====
  const location = useLocation();
  const navigate = useNavigate();

  // ===== User info =====
  const user = useMemo(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const userImage = user?.profileImage || null;
  const userName = user?.fullName || t("navigation.name");
  const userEmail = user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userGroup = user?.groupId?.groupName || "";
  const userSubtitle =
    userGroup ||
    user?.department?.name ||
    user?.position?.name ||
    "Employee Workspace";

  // ===== Dropdown states =====
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeDesktopSection, setActiveDesktopSection] = useState<string | null>(null);

  // ===== Helpers =====
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLink = (path: string) =>
    `px-4 py-2 text-sm font-medium rounded-md transition ${
      isActive(path)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  // ===== Actions =====
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", lng === "ar");
  };

  return {
    t,
    i18n,
    user, // ← Make sure user is exposed
    userImage,
    userName,
    userEmail,
    userInitials,
    userSubtitle,
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
  };
};