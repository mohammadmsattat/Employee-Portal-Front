import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MobileHeader from "./MobileHeader.tsx";
import { AppHeaderConfig } from "@/interfaces/header";
import DesktopHeader from "./DesktopHeader.tsx";

interface AppHeaderProps {
  config?: AppHeaderConfig;
}

const AppHeader = ({ config }: AppHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isHome = location.pathname === "/";

  const routeTitles = [
    {
      path: "/leaves/manager-leave-requests",
      title: t("navigation.approveLeaveRequests"),
    },
    {
      path: "/overtime/manager-overtime-requests",
      title: t("navigation.approveOvertimeRequests"),
    },
    {
      path: "/advance/manager-advance-requests",
      title: t("navigation.approveAdvances"),
    },
    {
      path: "/overtime/my-overtime-requests",
      title: t("myOvertimeRequestsPage.title"),
    },
    {
      path: "/advance/my-advance-requests",
      title: t("myAdvanceRequestsPage.title"),
    },
    {
      path: "/leaves/Leaves",
      title: t("navigation.leave"),
    },
    {
      path: "/attendance",
      title: t("attendancePage.title"),
    },
    {
      path: "/profile",
      title: t("navigation.myProfile"),
    },
    {
      path: "/tasks",
      title: t("homePage.tasks"),
    },
  ];

  const activeRouteTitle =
    routeTitles.find(({ path }) => location.pathname.startsWith(path))?.title ||
    t("navigation.home");

  const mobileConfig = {
    showBack: !isHome,
    showBrand: false,
    showGreeting: isHome,
    showSubtitle: isHome,
    showNotifications: true,
    showLanguage: false,
    title: isHome ? t("navigation.home") : activeRouteTitle,
    subtitle: isHome ? "Welcome back" : "",
    onBack: () => navigate(-1),
    ...config?.mobile,
  };

  return (
    <>
      <div className="md:hidden">
        <MobileHeader config={mobileConfig} />
      </div>

      <div className="hidden md:block">
        <DesktopHeader />
      </div>
    </>
  );
};

export default AppHeader;
