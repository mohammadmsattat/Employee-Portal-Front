import { ListTodo } from "lucide-react";
import PortalCard from "@/components/portal/PortalCard";
import StatusBadge from "@/components/portal/StatusBadge";
import { useGetAllTasksQuery } from "@/rtk/Tasks/tasksApi";

const STATUSES = ["todo", "in_progress", "review", "done"];

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const TasksBoard = ({ formatDate }) => {
  const { data, isLoading, isError } = useGetAllTasksQuery();

  const tasks = data?.data || [];

  const grouped = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const totalTasks = tasks.length;

  return (
    <PortalCard>
      {/* FLOW LINE (IMPROVED) */}
      <div className="px-5 pb-6 pt-6">
        <div className="flex items-center">
          {STATUSES.map((status, index) => {
            const count = grouped[status].length;
            const ratio = totalTasks ? (count / totalTasks) * 100 : 0;

            return (
              <div key={status} className="flex flex-1 items-center">
                {/* NODE */}
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`rounded-full transition-all ${
                      count > 0 ? "bg-blue-600" : "bg-slate-300"
                    }`}
                    style={{
                      width: `${10 + count * 2}px`,
                      height: `${10 + count * 2}px`,
                    }}
                  />

                  <span className="mt-2 text-[11px] text-slate-500">
                    {STATUS_LABELS[status]}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {count} tasks
                  </span>
                </div>

                {/* LINE */}
                {index !== STATUSES.length - 1 && (
                  <div className="flex-1 h-[2px] bg-slate-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="px-5 py-10 text-slate-500">Loading tasks...</div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="px-5 py-10 text-red-500">Failed to load tasks</div>
      )}

      {/* BOARD */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 px-5 pb-6 lg:grid-cols-4">
          {STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              {/* HEADER */}
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">
                  {STATUS_LABELS[status]}
                </h4>

                <span className="text-xs text-slate-500">
                  {grouped[status].length}
                </span>
              </div>

              {/* TASK CARDS */}
              <div className="space-y-3">
                {grouped[status].length > 0 ? (
                  grouped[status].map((task) => (
                    <div
                      key={task._id}
                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-sm font-medium text-slate-900">
                          {task.title}
                        </h5>

                        <StatusBadge status={task.status} />
                      </div>

                      {task.description && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* META */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {task.dueDate
                            ? formatDate?.(task.dueDate)
                            : "No due date"}
                        </span>

                        <span className="font-medium text-slate-600">
                          {task.priority}
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="mt-2">
                        <div className="h-1.5 w-full rounded-full bg-slate-200">
                          <div
                            className="h-1.5 rounded-full bg-blue-600"
                            style={{ width: `${task.progress || 0}%` }}
                          />
                        </div>
                        <div className="mt-1 text-[10px] text-right text-slate-400">
                          {task.progress || 0}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-6">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalCard>
  );
};

export default TasksBoard;
