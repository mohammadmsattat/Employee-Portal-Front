import { useLocation, useNavigate } from "react-router-dom";

import MobileHeader from "./MobileHeader.tsx";
import { AppHeaderConfig } from "@/interfaces/header";
import DesktopHeader from "./DesktopHeader.tsx";

interface AppHeaderProps {
  config?: AppHeaderConfig;
}

const AppHeader = ({ config }: AppHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const mobileConfig = {
    showBack: !isHome,
    showBrand: false,
    showGreeting: isHome,
    showSubtitle: isHome,
    showNotifications: true,
    showLanguage: false,
    title: isHome ? "Home" : "Page Title",
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
