import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, FileText, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import AddOvertimeRequestModal from "./RequestOvertimeModal";
import ManagerOvertimeRequests from "./ManagerOvertimeRequests";
import MyOvertimeRequests from "./MyOvertimeRequests";

type OvertimeTab = "my" | "approvals";

const getInitialTab = (pathname: string, search: string): OvertimeTab => {
  const tab = new URLSearchParams(search).get("tab");

  if (tab === "approvals" || pathname.includes("manager-overtime-requests")) {
    return "approvals";
  }

  return "my";
};

const OvertimePage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<OvertimeTab>(() =>
    getInitialTab(location.pathname, location.search),
  );
  const [isOvertimeModalOpen, setOvertimeModalOpen] = useState(false);

  // replace later with real permission logic
  const canApproveOvertime = true;

  useEffect(() => {
    setActiveTab(getInitialTab(location.pathname, location.search));
  }, [location.pathname, location.search]);

  const tabs = useMemo(() => {
    const base = [
      {
        key: "my" as const,
        label: "My requests",
        icon: FileText,
      },
    ];

    if (canApproveOvertime) {
      base.push({
        key: "approvals" as const,
        label: "Approve requests",
        icon: CheckCircle2,
      });
    }

    return base;
  }, [canApproveOvertime, t]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-start">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t("navigation.overtime")}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "my"
                ? t("myOvertimeRequestsPage.subtitle")
                : t("managerOvertimeRequestsPage.subtitle")}
            </p>
          </div>

          {activeTab === "my" && (
            <Button
              onClick={() => setOvertimeModalOpen(true)}
              className="h-11 rounded-2xl bg-blue-600 px-5 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] hover:bg-blue-700"
            >
              <Plus className="me-2 h-4 w-4" />
              {t("buttons.newOvertimeRequest")}
            </Button>
          )}
        </div>

        <div className="rounded-[22px] border border-slate-200/70 bg-slate-50 p-1">
          <div className="grid grid-cols-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-[18px] text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "my" ? (
          <MyOvertimeRequests embedded />
        ) : (
          <ManagerOvertimeRequests embedded />
        )}

        <AddOvertimeRequestModal
          isOpen={isOvertimeModalOpen}
          onClose={() => setOvertimeModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default OvertimePage;
