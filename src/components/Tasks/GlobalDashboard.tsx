import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  ListChecks,
  Clock3,
  ArrowUpRight,
  TrendingUp,
  BriefcaseBusiness,
  RefreshCw,
  CalendarDays,
  ChevronRight,
  CircleDashed,
  Target,
} from "lucide-react";
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

import { useGetGlobalDashboardQuery } from "@/rtk/Tasks/globalDashboardApi";
import LoadingFull from "../ui/LoadingSkeleton";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  workspacesCount: number;
  completionRate: number;
}

interface WorkspaceData {
  workspaceName: string;
  count: number;
}

interface RecentTask {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
  workspace: {
    _id: string;
    name: string;
  };
  list: string;
}

interface GlobalDashboardData {
  stats: DashboardStats;
  tasksByWorkspace: WorkspaceData[];
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  recentTasks: RecentTask[];
}

interface DashboardResponse {
  data?: GlobalDashboardData;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  todo: "#94A3B8",
  in_progress: "#3B82F6",
  review: "#F59E0B",
  pending: "#EAB308",
  on_hold: "#8B5CF6",
  done: "#10B981",
  cancelled: "#EF4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#F97316",
  urgent: "#EF4444",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To do",
  in_progress: "In progress",
  review: "In review",
  pending: "Pending",
  on_hold: "On hold",
  done: "Completed",
  cancelled: "Cancelled",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const DEFAULT_COLOR = "#CBD5E1";

const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const getStatusLabel = (status: string) =>
  STATUS_LABELS[status] ?? formatLabel(status);

const getPriorityLabel = (priority: string) =>
  PRIORITY_LABELS[priority] ?? formatLabel(priority);

const formatDate = (date: string) => {
  if (!date) return "No due date";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const isTaskOverdue = (task: RecentTask) => {
  if (!task.dueDate || task.status === "done") return false;

  const dueDate = new Date(task.dueDate);
  if (Number.isNaN(dueDate.getTime())) return false;

  // Preserve the original dashboard rule: past due date + not completed.
  return dueDate < new Date();
};

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

const GlobalDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, error, refetch } =
    useGetGlobalDashboardQuery(undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    });

  const dashboard = (data as DashboardResponse | undefined)?.data;

  const statusData = useMemo(
    () =>
      Object.entries(dashboard?.tasksByStatus ?? {})
        .map(([name, value]) => ({
          name,
          label: getStatusLabel(name),
          value,
          color: STATUS_COLORS[name] ?? DEFAULT_COLOR,
        }))
        .filter((item) => item.value > 0),
    [dashboard?.tasksByStatus],
  );

  const priorityData = useMemo(
    () =>
      Object.entries(dashboard?.tasksByPriority ?? {})
        .map(([name, value]) => ({
          name,
          label: getPriorityLabel(name),
          value,
          color: PRIORITY_COLORS[name] ?? DEFAULT_COLOR,
        }))
        .filter((item) => item.value > 0),
    [dashboard?.tasksByPriority],
  );

  const workspaceData = dashboard?.tasksByWorkspace ?? [];
  const recentTasks = dashboard?.recentTasks ?? [];
  const stats = dashboard?.stats;

  const handleTaskClick = (task: RecentTask) => {
    if (!task.workspace?._id || !task.list || !task._id) return;

    const params = new URLSearchParams({
      type: "task",
      taskId: task._id,
      listId: task.list,
      workspaceId: task.workspace._id,
      mode: "details",
    });

    navigate(`/tasks?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 xl:p-8">
        <LoadingFull titleLines={2} cardLines={4} />
      </div>
    );
  }

  if (error || !dashboard || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Unable to load dashboard
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading your workspace overview. Please
            try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const completionRate = Math.min(
    100,
    Math.max(0, Number(stats.completionRate) || 0),
  );

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto w-full max-w-[1600px] space-y-7 p-4 md:p-6 xl:space-y-8 xl:p-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/10">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Global Dashboard
                </h1>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Overview
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                A clear overview of your tasks and workspaces.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* KPI cards */}
        <section aria-label="Task overview">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Performance overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Your overall task performance at a glance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Assigned tasks"
              value={stats.totalTasks}
              subtitle="Total tasks assigned to you"
              icon={ListChecks}
              accent="blue"
            />

            <KpiCard
              title="Completed tasks"
              value={stats.completedTasks}
              subtitle={`${completionRate}% completion rate`}
              icon={CheckCircle2}
              accent="emerald"
              progress={completionRate}
            />

            <KpiCard
              title="Overdue tasks"
              value={stats.overdueTasks}
              subtitle={
                stats.overdueTasks > 0
                  ? "Tasks need your attention"
                  : "You're all caught up"
              }
              icon={AlertCircle}
              accent="rose"
              alert={stats.overdueTasks > 0}
            />

            <KpiCard
              title="Workspaces"
              value={stats.workspacesCount}
              subtitle="Your active workspaces"
              icon={BriefcaseBusiness}
              accent="violet"
            />
          </div>
        </section>

        {/* Main analytics */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Tasks by workspace"
            description="Distribution of tasks across your workspaces"
            icon={BriefcaseBusiness}
          >
            {workspaceData.length === 0 ? (
              <EmptyState message="No workspace data available yet." />
            ) : (
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workspaceData}
                    layout="vertical"
                    margin={{ top: 4, right: 18, left: 4, bottom: 4 }}
                    barCategoryGap={14}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="#EEF1F6"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="workspaceName"
                      width={112}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748B" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#F1F5F9", radius: 8 }}
                      contentStyle={tooltipStyle}
                      formatter={(value) => [value, "Tasks"]}
                    />
                    <Bar
                      dataKey="count"
                      name="Tasks"
                      fill="#4F6EF7"
                      radius={[0, 7, 7, 0]}
                      barSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="Tasks by status"
            description="A breakdown of your current task progress"
            icon={Target}
          >
            {statusData.length === 0 ? (
              <EmptyState message="No status data available yet." />
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 pt-3 sm:flex-row sm:gap-8">
                <div className="relative h-[230px] w-full max-w-[260px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={69}
                        outerRadius={96}
                        paddingAngle={3}
                        cornerRadius={5}
                        stroke="none"
                      >
                        {statusData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      {stats.totalTasks}
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-slate-400">
                      Total tasks
                    </span>
                  </div>
                </div>

                <div className="w-full min-w-0 space-y-3">
                  {statusData.map((item) => {
                    const percentage =
                      stats.totalTasks > 0
                        ? Math.round((item.value / stats.totalTasks) * 100)
                        : 0;

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate font-medium text-slate-600">
                              {item.label}
                            </span>
                          </div>
                          <span className="shrink-0 font-bold tabular-nums text-slate-800">
                            {item.value}
                            <span className="ml-1 font-medium text-slate-400">
                              ({percentage}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ChartCard>
        </section>

        {/* Priority and tasks */}
        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <ChartCard
              title="Priority breakdown"
              description="Tasks grouped by priority level"
              icon={TrendingUp}
            >
              {priorityData.length === 0 ? (
                <EmptyState message="No priority data available yet." />
              ) : (
                <>
                  <div className="h-[230px] w-full pt-5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={priorityData}
                        margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
                        barCategoryGap={22}
                      >
                        <CartesianGrid
                          vertical={false}
                          stroke="#EEF1F6"
                          strokeDasharray="4 4"
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#94A3B8" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#94A3B8" }}
                        />
                        <RechartsTooltip
                          cursor={{ fill: "#F1F5F9" }}
                          contentStyle={tooltipStyle}
                        />
                        <Bar
                          dataKey="value"
                          name="Tasks"
                          radius={[6, 6, 0, 0]}
                          barSize={34}
                        >
                          {priorityData.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {priorityData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate text-xs text-slate-500">
                          {item.label}
                        </span>
                        <span className="ml-auto text-xs font-bold text-slate-800">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>
          </div>

          <div className="xl:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)]">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Clock3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Upcoming & overdue tasks
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Your latest tasks that may need attention
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/tasks")}
                  className="inline-flex items-center gap-1 self-start text-xs font-semibold text-blue-600 transition hover:text-blue-700 sm:self-auto"
                >
                  View all tasks
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2 p-4 sm:p-5">
                {recentTasks.length === 0 ? (
                  <div className="py-12">
                    <EmptyState message="You're all caught up. No tasks to show." />
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-center text-[11px] text-slate-400">
          Global workspace overview
        </footer>
      </div>
    </main>
  );
};

// -----------------------------------------------------------------------------
// KPI card
// -----------------------------------------------------------------------------

type Accent = "blue" | "emerald" | "rose" | "violet";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  accent: Accent;
  progress?: number;
  alert?: boolean;
}

const ACCENT_STYLES: Record<
  Accent,
  { icon: string; iconColor: string; bar: string; value: string }
> = {
  blue: {
    icon: "bg-blue-50",
    iconColor: "text-blue-600",
    bar: "bg-blue-500",
    value: "text-slate-900",
  },
  emerald: {
    icon: "bg-emerald-50",
    iconColor: "text-emerald-600",
    bar: "bg-emerald-500",
    value: "text-slate-900",
  },
  rose: {
    icon: "bg-rose-50",
    iconColor: "text-rose-600",
    bar: "bg-rose-500",
    value: "text-slate-900",
  },
  violet: {
    icon: "bg-violet-50",
    iconColor: "text-violet-600",
    bar: "bg-violet-500",
    value: "text-slate-900",
  },
};

const KpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  progress,
  alert,
}: KpiCardProps) => {
  const styles = ACCENT_STYLES[accent];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <p
            className={cn(
              "mt-3 text-3xl font-bold tracking-tight tabular-nums",
              styles.value,
            )}
          >
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105",
            styles.icon,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
      </div>

      {progress !== undefined ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-slate-400">
              {subtitle}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                styles.bar,
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex min-h-4 items-center gap-1.5">
          {alert && <AlertCircle className="h-3.5 w-3.5 text-rose-500" />}
          <p
            className={cn(
              "text-[11px] font-medium",
              alert ? "text-rose-600" : "text-slate-400",
            )}
          >
            {subtitle}
          </p>
        </div>
      )}
    </article>
  );
};

// -----------------------------------------------------------------------------
// Chart card
// -----------------------------------------------------------------------------

interface ChartCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ChartCard = ({
  title,
  description,
  icon: Icon,
  children,
}: ChartCardProps) => (
  <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.035)] sm:p-6">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        <Icon className="h-[18px] w-[18px] text-slate-600" />
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
    <div className="min-w-0 flex-1">{children}</div>
  </article>
);

// -----------------------------------------------------------------------------
// Task row
// -----------------------------------------------------------------------------

interface TaskRowProps {
  task: RecentTask;
  onClick: () => void;
}

const TaskRow = ({ task, onClick }: TaskRowProps) => {
  const overdue = isTaskOverdue(task);
  const statusColor = STATUS_COLORS[task.status] ?? DEFAULT_COLOR;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left transition duration-200 hover:border-blue-200 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 0 4px ${statusColor}20`,
          }}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-blue-700">
            {task.title || "Untitled task"}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex max-w-full items-center gap-1 truncate text-[11px] font-medium text-slate-500">
              <BriefcaseBusiness className="h-3 w-3 shrink-0" />
              {task.workspace?.name || "Unknown workspace"}
            </span>

            <span className="hidden text-slate-300 sm:inline">·</span>

            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-medium",
                overdue ? "text-rose-600" : "text-slate-400",
              )}
            >
              <CalendarDays className="h-3 w-3" />
              {overdue ? "Overdue" : "Due"}: {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 pl-5 sm:justify-end sm:pl-0">
        <span
          className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{
            backgroundColor: `${statusColor}15`,
            color: statusColor,
          }}
        >
          {getStatusLabel(task.status)}
        </span>

        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
      </div>
    </button>
  );
};

// -----------------------------------------------------------------------------
// Empty state and chart tooltip
// -----------------------------------------------------------------------------

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-[230px] flex-col items-center justify-center px-4 text-center">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
      <CircleDashed className="h-5 w-5 text-slate-300" />
    </div>
    <p className="text-xs font-medium text-slate-400">{message}</p>
  </div>
);

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
  padding: "10px 12px",
};

export default GlobalDashboard;
