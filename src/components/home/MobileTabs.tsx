import { TFunction } from "i18next";
import { FC, ReactNode } from "react";

type MobileTabsProps = {
  activeTab: "attendance" | "Balance" | "leaves";
  setActiveTab: (tab: "attendance" | "Balance" | "leaves") => void;
  tabsContent: {
    attendance: ReactNode;
    Balance: ReactNode;
    leaves: ReactNode;
  };
  t: TFunction;
};

const MobileTabs: FC<MobileTabsProps> = ({
  activeTab,
  setActiveTab,
  tabsContent,
  t,
}) => {
  return (
    <div className="lg:hidden">
      {/* Tabs Header */}
      <div className="flex justify-around border-b border-muted/40 mb-4">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-2 flex-1 text-center font-medium transition ${
            activeTab === "attendance"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          {t("homePage.attendance")}
        </button>
        <button
          onClick={() => setActiveTab("Balance")}
          className={`py-2 flex-1 text-center font-medium transition ${
            activeTab === "Balance"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          {t("homePage.schedule")}
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`py-2 flex-1 text-center font-medium transition ${
            activeTab === "leaves"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          {t("homePage.leaves")}
        </button>
      </div>

      {/* Tabs Content */}
      <div className="space-y-6">
        {activeTab === "attendance" && tabsContent.attendance}
        {activeTab === "Balance" && tabsContent.Balance}
        {activeTab === "leaves" && tabsContent.leaves}
      </div>
    </div>
  );
};

export default MobileTabs;
