import { useMemo, useState } from "react";
import { Plus, FileText, CheckCircle2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import AddLeaveRequestModal from "./AddLeavesRequestModal";
import MyLeavesPanel from "./MyLeavesPanel";
import LeaveApprovalsPanel from "./LeaveApprovalsPanel";

type LeaveTab = "my" | "approvals";

const LeavesPage = () => {
  const [activeTab, setActiveTab] = useState<LeaveTab>("my");
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);

  // replace later with real permission logic
  const canApproveLeaves = true;

  const tabs = useMemo(() => {
    const base = [
      {
        key: "my" as const,
        label: "My requests",
        icon: FileText,
      },
    ];

    if (canApproveLeaves) {
      base.push({
        key: "approvals" as const,
        label: "Approve requests",
        icon: CheckCircle2,
      });
    }

    return base;
  }, [canApproveLeaves]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] sm:flex sm:items-center sm:justify-between">
          <div className="text-start">
            <p className="text-xs font-semibold uppercase text-blue-600">
              Employee requests
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Leaves
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "my"
                ? "Track your leave balance and requests"
                : "Review and manage employee leave requests"}
            </p>
          </div>

          {activeTab === "my" && (
            <Button
              onClick={() => setLeaveModalOpen(true)}
              className="mt-4 h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] hover:bg-blue-700 sm:mt-0"
            >
              <Plus className="me-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition ${
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

        {/* Content */}
        {activeTab === "my" ? <MyLeavesPanel /> : <LeaveApprovalsPanel />}

        <AddLeaveRequestModal
          isOpen={isLeaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default LeavesPage;
