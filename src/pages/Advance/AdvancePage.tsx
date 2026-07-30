import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, FileText, LucideIcon, Plus, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import AddAdvanceRequestModal from "./AddAdvanceRequestModal";
import ManagerAdvanceRequests from "./ManagerAdvanceRequests";
import MyAdvanceRequests from "./MyAdvanceRequestsPage";

type AdvanceTab = "my" | "approvals";

type TabItem = {
  key: AdvanceTab;
  label: string;
  icon: LucideIcon;
};
const getInitialTab = (pathname: string, search: string): AdvanceTab => {
  const tab = new URLSearchParams(search).get("tab");

  if (tab === "approvals" || pathname.includes("manager-advance-requests")) {
    return "approvals";
  }

  return "my";
};

const AdvancePage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdvanceTab>(() =>
    getInitialTab(location.pathname, location.search),
  );
  const [isAdvanceModalOpen, setAdvanceModalOpen] = useState(false);

  // replace later with real permission logic
  const canApproveAdvances = true;

  useEffect(() => {
    setActiveTab(getInitialTab(location.pathname, location.search));
  }, [location.pathname, location.search]);

  const tabs = useMemo(() => {
    const base: TabItem[] = [
      {
        key: "my" as const,
        label: t("myAdvanceRequestsPage.title") || "My Requests",
        icon: FileText,
      },
    ];

    if (canApproveAdvances) {
      base.push({
        key: "approvals" as const,
        label: t("managerAdvanceRequestsPage.title") || "Approve Requests",
        icon: CheckCircle2,
      });
    }

    return base;
  }, [canApproveAdvances, t]);

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-8">
            {/* Mobile Header (No Card) */}
            <div className="sm:hidden mb-10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-blue-600">
                      Employee Requests
                    </p>
                  </div>
                  <h1 className="mt-0.5 text-lg font-bold text-blue-900 truncate">
                    {t("navigation.advance") || "Advance"}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    {activeTab === "my"
                      ? t("myAdvanceRequestsPage.subtitle") ||
                        "Track your advance requests"
                      : t("managerAdvanceRequestsPage.subtitle") ||
                        "Review and manage employee advance requests"}
                  </p>
                </div>
                {activeTab === "my" && (
                  <button
                    onClick={() => setAdvanceModalOpen(true)}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    {t("myAdvanceRequestsPage.newRequest") || "New"}
                  </button>
                )}
              </div>
            </div>

            {/* Web Header (With Card) */}
            <div className="hidden sm:block">
              <div className="flex flex-col gap-4 rounded-2xl bg-whte p-6 shadow-sm ring-1 ring-black/5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-blue-600">
                        Employee Requests
                      </p>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-xs text-slate-400">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h1 className="mt-1 text-2xl font-bold text-blue-900 lg:text-3xl truncate">
                      {t("navigation.advance") || "Advance"}
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {activeTab === "my"
                        ? t("myAdvanceRequestsPage.subtitle") ||
                          "Track your advance requests"
                        : t("managerAdvanceRequestsPage.subtitle") ||
                          "Review and manage employee advance requests"}
                    </p>
                  </div>
                  {activeTab === "my" && (
                    <Button
                      onClick={() => setAdvanceModalOpen(true)}
                      className="h-11 rounded-xl bg-blue-600 px-5 font-medium text-white shadow-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("myAdvanceRequestsPage.newRequest") || "New Request"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === "my" ? (
              <MyAdvanceRequests embedded />
            ) : (
              <ManagerAdvanceRequests embedded />
            )}
          </div>
        </div>
      </div>

      <AddAdvanceRequestModal
        isOpen={isAdvanceModalOpen}
        onClose={() => setAdvanceModalOpen(false)}
      />
    </Layout>
  );
};

export default AdvancePage;
