import { useEffect } from "react"; // ✅ ضيف ده
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  ListChecks,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useGetGlobalDashboardQuery } from "@/rtk/Tasks/globalDashboardApi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LoadingFull from "../ui/LoadingSkeleton";

const STATUS_COLORS: Record<string, string> = {
  todo: "#64748b",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  pending: "#eab308",
  on_hold: "#a855f7",
  done: "#10b981",
  cancelled: "#ef4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  urgent: "#ef4444",
};

const GlobalDashboard = () => {
  const navigate = useNavigate();

  // ✅ التعديل هنا: ضفنا refetchOnMountOrArgChange + refetch
  const { data, isLoading, error, refetch } = useGetGlobalDashboardQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  // ✅ عشان يعمل Refetch كل مرة الصفحة تفتح
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <LoadingFull titleLines={2} cardLines={4} />
      </div>
    );
  }

  if (error || !data?.data)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard.
      </div>
    );

  const {
    stats,
    tasksByWorkspace,
    tasksByStatus,
    tasksByPriority,
    recentTasks,
  } = data.data;

  // --- تجهيز بيانات الرسومات ---
  const statusData = Object.entries(tasksByStatus)
    .map(([name, value]) => ({ name: name.replace("_", " "), value }))
    .filter((item) => item.value > 0);

  const priorityData = Object.entries(tasksByPriority).map(([name, value]) => ({
    name,
    value,
  }));

  // --- توجيه لصفحة الـ Task ---
  const handleTaskClick = (task: any) => {
    const params = new URLSearchParams({
      type: "task",
      taskId: task._id,
      listId: task.list,
      workspaceId: task.workspace._id,
      mode: "details",
    });
    navigate(`/tasks?${params.toString()}`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-2xl">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            My Global Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview across all your workspaces
          </p>
        </div>
      </div>

      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Assigned Tasks"
          value={stats.totalTasks}
          icon={<ListChecks className="w-6 h-6 text-blue-500" />}
          bg="bg-blue-50"
        />
        <KpiCard
          title="Completed"
          value={stats.completedTasks}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          bg="bg-emerald-50"
          subtitle={`${stats.completionRate}% Completion Rate`}
          progress={stats.completionRate}
        />
        <KpiCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          bg="bg-red-50"
          subtitle={stats.overdueTasks > 0 ? "Needs Attention" : "All on track"}
        />
        <KpiCard
          title="Workspaces"
          value={stats.workspacesCount}
          icon={<LayoutDashboard className="w-6 h-6 text-indigo-500" />}
          bg="bg-indigo-50"
        />
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Workspace (Bar) */}
        <ChartContainer title="My Tasks by Workspace">
          {tasksByWorkspace.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tasksByWorkspace}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    dataKey="workspaceName"
                    type="category"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    width={100}
                  />
                  <RechartsTooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartContainer>

        {/* By Status (Donut) */}
        <ChartContainer title="My Tasks by Status">
          {statusData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            STATUS_COLORS[entry.name.replace(" ", "_")] ||
                            "#cbd5e1"
                          }
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {statusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1.5 text-xs text-slate-600"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[item.name.replace(" ", "_")],
                      }}
                    />
                    <span className="capitalize">{item.name}</span>
                    <span className="text-slate-400">({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartContainer>
      </div>

      {/* 3. PRIORITY + RECENT TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Bar (smaller) */}
        <div className="lg:col-span-1">
          <ChartContainer title="Priority Breakdown">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PRIORITY_COLORS[entry.name] || "#cbd5e1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Upcoming & Overdue Tasks
          </h2>
          <div className="space-y-3">
            {recentTasks?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">
                No tasks assigned to you.
              </p>
            ) : (
              recentTasks.map((task: any) => {
                const isOverdue =
                  new Date(task.dueDate) < new Date() && task.status !== "done";
                return (
                  <div
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    className="group flex justify-between items-center border border-slate-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[task.status] || "#cbd5e1",
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {task.workspace.name} •{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue && (
                            <span className="ml-2 text-red-500 font-medium">
                              Overdue
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase"
                        style={{
                          backgroundColor: `${STATUS_COLORS[task.status]}15`,
                          color: STATUS_COLORS[task.status],
                        }}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const KpiCard = ({ title, value, icon, bg, subtitle, progress }: any) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${bg}`}>{icon}</div>
    </div>
    {progress !== undefined && (
      <div className="mt-4">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
      </div>
    )}
    {subtitle && progress === undefined && (
      <p
        className={`text-xs font-medium mt-3 ${title.includes("Overdue") && value > 0 ? "text-red-500" : "text-slate-400"}`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
    <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);

const EmptyState = () => (
  <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
    No data available.
  </div>
);

export default GlobalDashboard;
