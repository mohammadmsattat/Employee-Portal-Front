import { useMemo, useState } from "react";
import { Plus, FileText, CheckCircle2, CalendarDays, Clock3, Gift, Inbox } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import AddLeaveRequestModal from "./AddLeavesRequestModal";
import MyLeavesPanel from "./MyLeavesPanel";
import LeaveApprovalsPanel from "./LeaveApprovalsPanel";

type LeaveTab = "my" | "approvals";

interface TabItem {
  key: LeaveTab;
  label: string;
  icon: any;
}

const LeavesPage = () => {
  const [activeTab, setActiveTab] = useState<LeaveTab>("my");
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);

  // replace later with real permission logic
  const canApproveLeaves = true;

  const tabs = useMemo<TabItem[]>(() => {
    const base: TabItem[] = [
      {
        key: "my",
        label: "My Requests",
        icon: FileText,
      },
    ];

    if (canApproveLeaves) {
      base.push({
        key: "approvals",
        label: "Approve Requests",
        icon: CheckCircle2,
      });
    }

    return base;
  }, [canApproveLeaves]);

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
                    Leaves
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    {activeTab === "my"
                      ? "Track your leave balance and requests"
                      : "Review and manage employee leave requests"}
                  </p>
                </div>
                {activeTab === "my" && (
                  <button
                    onClick={() => setLeaveModalOpen(true)}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                )}
              </div>
            </div>

            {/* Web Header (With Card) */}
            <div className="hidden sm:block">
              <div className="flex flex-col gap-4 rounded-2xl  p-6 shadow-sm ring-1 ring-black/5">
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
                      Leaves
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {activeTab === "my"
                        ? "Track your leave balance and requests"
                        : "Review and manage employee leave requests"}
                    </p>
                  </div>
                  {activeTab === "my" && (
                    <Button
                      onClick={() => setLeaveModalOpen(true)}
                      className="h-11 rounded-xl bg-blue-600 px-5 font-medium text-white shadow-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
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
            {activeTab === "my" ? <MyLeavesPanel /> : <LeaveApprovalsPanel />}
          </div>
        </div>
      </div>

      <AddLeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
      />
    </Layout>
  );
};

export default LeavesPage;