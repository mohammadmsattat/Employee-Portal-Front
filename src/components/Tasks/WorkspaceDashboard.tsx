import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Folder,
  List,
  ListChecks,
  AlertCircle,
  CheckCircle2,
  Archive,
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { useGetDashboardQuery } from "@/rtk/Tasks/workspaceDashboardApi";
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

// ألوان للحالات
const STATUS_COLORS = {
  todo: "#64748b",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  pending: "#eab308",
  on_hold: "#a855f7",
  done: "#10b981",
  cancelled: "#ef4444",
};

// ألوان للأولويات
const PRIORITY_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  urgent: "#ef4444",
};

const WorkspaceDashboard = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetDashboardQuery(
    workspaceId as string,
    { skip: !workspaceId },
  );

  // ✅ Logs
  console.log("🔍 [Dashboard] isLoading:", isLoading);
  console.log("🔍 [Dashboard] error:", error);
  console.log("🔍 [Dashboard] Raw Data:", data);

  // ✅ إجبار الـ Refetch عشان الداتا تتحدث
  useEffect(() => {
    if (workspaceId) {
      refetch();
    }
  }, [workspaceId, refetch]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <LoadingFull titleLines={2} cardLines={4} />
      </div>
    );
  }

  if (error || !data?.data || !data?.data?.stats) {
    console.error("❌ [Dashboard] Error or No Data:", { error, data });
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard or access denied.
      </div>
    );
  }

  // ✅ من هنا ورايح، إحنا ضامنين إن data.data موجودة
  const {
    stats = {},
    tasksByStatus = {},
    tasksByPriority = {},
    workloadByMember = [],
    workspaceName = "",
    recentTasks = [],
  } = data.data || {};

  // ✅ Logs
  console.log("✅ [Dashboard] stats:", stats);
  console.log("✅ [Dashboard] workloadByMember:", workloadByMember);
  console.log("✅ [Dashboard] recentTasks:", recentTasks);

  if (!stats) {
    console.error("❌ [Dashboard] stats is missing");
    return (
      <div className="p-10 text-center text-red-500">
        Invalid dashboard data.
      </div>
    );
  }

  // تجهيز بيانات الـ Pie Chart
  const statusData = Object.entries(tasksByStatus)
    .map(([name, value]) => ({ name: name.replace("_", " "), value }))
    .filter((item) => item.value > 0);

  // تجهيز بيانات الـ Bar Chart
  const priorityData = Object.entries(tasksByPriority).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-6 h-6 text-blue-500" /> {workspaceName}
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      {/* ===== 1. KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Tasks"
          value={stats.tasksCount}
          icon={<ListChecks className="w-6 h-6 text-blue-500" />}
          bg="bg-blue-50"
        />
        <KpiCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          bg="bg-emerald-50"
          subtitle={`${stats.completionRate}% Completion Rate`}
          progress={stats.completionRate}
        />
        <KpiCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          bg="bg-red-50"
          subtitle={stats.overdueTasks > 0 ? "Needs Attention" : "All on track"}
        />
        <KpiCard
          title="Team Members"
          value={stats.membersCount}
          icon={<Users className="w-6 h-6 text-indigo-500" />}
          bg="bg-indigo-50"
        />
      </div>

      {/* ===== 2. MINI STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniCard title="Folders" value={stats.foldersCount} icon={Folder} />
        <MiniCard title="Lists" value={stats.listsCount} icon={List} />
        <MiniCard
          title="Archived Tasks"
          value={stats.archivedTasks}
          icon={Archive}
        />
        <MiniCard
          title="Total Tasks"
          value={stats.tasksCount}
          icon={TrendingUp}
        />
      </div>

      {/* ===== 3. CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status (Donut Chart) */}
        <ChartContainer title="Tasks by Status">
          {statusData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            entry.name.replace(
                              " ",
                              "_",
                            ) as keyof typeof STATUS_COLORS
                          ] || "#cbd5e1"
                        }
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[
                        item.name.replace(
                          " ",
                          "_",
                        ) as keyof typeof STATUS_COLORS
                      ] || "#cbd5e1",
                  }}
                />
                <span className="capitalize">{item.name}</span>
                <span className="text-slate-400">({item.value})</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Tasks by Priority (Bar Chart) */}
        <ChartContainer title="Tasks by Priority">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        PRIORITY_COLORS[
                          entry.name as keyof typeof PRIORITY_COLORS
                        ] || "#cbd5e1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* ===== 4. WORKLOAD & RECENT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Team Workload
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-50 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Member</th>
                  <th className="px-4 py-3 text-center">Tasks</th>
                  <th className="px-4 py-3 text-center text-emerald-600">
                    Done
                  </th>
                  <th className="px-4 py-3 text-center text-red-600 rounded-r-xl">
                    Overdue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workloadByMember?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  workloadByMember.map((member: any, idx: number) => {
                    // ✅ Logs
                    console.log("👤 [Dashboard] member row:", member);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                              {(member?.fullName || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-700">
                              {member?.fullName || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold text-slate-700">
                          {member?.totalTasks}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                            {member?.completedTasks}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold ${(member?.overdueTasks || 0) > 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"}`}
                          >
                            {member?.overdueTasks || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Recent Tasks
          </h2>
          <div className="space-y-4">
            {recentTasks?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">
                No recent tasks.
              </p>
            ) : (
              recentTasks.map((task: any) => {
                // ✅ Logs
                console.log("📋 [Dashboard] recent task row:", task);

                return (
                  <div
                    key={task?._id}
                    onClick={() =>
                      navigate(
                        `/tasks?taskId=${task?._id}&mode=details&type=task`,
                      )
                    }
                    className="group flex justify-between items-center border border-slate-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            STATUS_COLORS[
                              task?.status as keyof typeof STATUS_COLORS
                            ],
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition truncate max-w-[200px]">
                          {task?.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {new Date(task?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide`}
                      style={{
                        backgroundColor: `${STATUS_COLORS[task?.status as keyof typeof STATUS_COLORS]}15`,
                        color:
                          STATUS_COLORS[
                            task?.status as keyof typeof STATUS_COLORS
                          ],
                      }}
                    >
                      {task?.status?.replace("_", " ")}
                    </span>
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

const MiniCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
    <div className="p-2 bg-slate-50 rounded-lg">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
  </div>
);

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
    <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);

const EmptyState = () => (
  <div className="h-[300px] flex items-center justify-center text-sm text-slate-400">
    No data available.
  </div>
);

export default WorkspaceDashboard;
