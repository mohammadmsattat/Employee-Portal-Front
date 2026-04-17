import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, ListTodo, Users } from "lucide-react";
import TasksSummary from "@/components/Tasks/TasksSummary";
import TasksFilters from "@/components/Tasks/TasksFilters";
import TasksMobileList from "@/components/Tasks/TasksMobileList";
import AddTaskModal from "@/components/Tasks/AddTaskModal";
import TasksTable from "@/components/Tasks/TasksTable";

type Tab = "my" | "team";

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("my");
  const [isModalOpen, setModalOpen] = useState(false);

  // mock role
  const isManager = true;

  // mock data
  const tasks = [
    {
      _id: "1",
      title: "Design Dashboard",
      status: "in_progress",
      priority: "high",
      dueDate: "2026-04-20",
      progress: 60,
      assignedTo: ["Ahmad", "Sara"],
    },
    {
      _id: "2",
      title: "Fix login bug",
      status: "todo",
      priority: "urgent",
      dueDate: "2026-04-18",
      progress: 0,
      assignedTo: ["You"],
    },
  ];

  const tabs = useMemo(() => {
    const base = [
      { key: "my" as Tab, label: "My Tasks", icon: ListTodo },
    ];
    if (isManager) {
      base.push({ key: "team" as Tab, label: "Team Tasks", icon: Users });
    }
    return base;
  }, [isManager]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
            <p className="text-sm text-slate-500">
              Manage your work and track progress
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="h-11 rounded-2xl bg-blue-600 px-5 text-white"
          >
            <Plus className="me-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Tabs */}
        <div className="rounded-[22px] border bg-slate-50 p-1">
          <div className="grid grid-cols-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-[18px] text-sm font-semibold ${
                    isActive
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {/* <TasksSummary tasks={tasks} /> */}

        {/* Filters */}
        {/* <TasksFilters /> */}

        {/* Desktop */}
        <div className="hidden md:block">
          <TasksTable tasks={tasks} />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <TasksMobileList tasks={tasks} />
        </div>

      </div>
        {/* MODAL */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
    </Layout>
  );
};

export default TasksPage;