// TasksTableViewMobile.jsx

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  Plus,
  Pencil,
  ListChecks,
  Trash2,
  Eye,
  Calendar,
  Clock,
  MoreHorizontal,
  AlertCircle,
  X,
  ArrowUp,
} from "lucide-react";

import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import TaskViewModal from "../TaskViewModal";
import SubTaskViewModal from "../SubTaskViewModal";

// ==================== CONSTANTS ====================

const STATUS_CONFIG = {
  todo: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: "Todo",
    dot: "bg-slate-400",
  },
  in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    label: "In Progress",
    dot: "bg-blue-500",
  },
  review: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    label: "Review",
    dot: "bg-purple-500",
  },
  done: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    label: "Done",
    dot: "bg-emerald-500",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    label: "Completed",
    dot: "bg-emerald-500",
  },
  blocked: {
    bg: "bg-red-100",
    text: "text-red-600",
    label: "Blocked",
    dot: "bg-red-500",
  },
};

const PRIORITY_CONFIG = {
  low: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Low",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    label: "Medium",
  },
  high: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    label: "High",
  },
  urgent: {
    bg: "bg-red-100",
    text: "text-red-600",
    label: "Urgent",
  },
};

// ==================== HELPERS ====================

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ==================== BADGES ====================

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />

      {config.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const isHigh = priority === "high" || priority === "urgent";

  const priorityStyles = {
    low: {
      border: "border-emerald-400",
      text: "text-emerald-700",
      bg: "bg-emerald-100/80",
      hover: "hover:bg-emerald-200/80",
    },
    medium: {
      border: "border-amber-400",
      text: "text-amber-700",
      bg: "bg-amber-100/80",
      hover: "hover:bg-amber-200/80",
    },
    high: {
      border: "border-red-500",
      text: "text-red-500",
      bg: "bg-red-100/80",
      hover: "hover:bg-red-200/20",
    },
    urgent: {
      border: "border-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-100/80",
      hover: "hover:bg-rose-200/80",
    },
  };

  const style = priorityStyles[priority] || priorityStyles.medium;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border-2 transition-all duration-200 ${style.border} ${style.text} ${style.bg} ${style.hover}`}
    >
      {isHigh ? (
        <ArrowUp className="h-3 w-3 shrink-0" />
      ) : (
        <Circle className="h-2 w-2 shrink-0 fill-current" />
      )}

      {config.label}
    </span>
  );
};

const StatusIcon = ({ status }) => {
  const icons = {
    todo: <Circle className="h-4 w-4 text-slate-400 shrink-0" />,

    in_progress: <Clock className="h-4 w-4 text-slate-400 shrink-0" />,

    review: <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />,

    done: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,

    completed: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,

    blocked: <X className="h-4 w-4 text-red-500 shrink-0" />,
  };

  return icons[status] || icons.todo;
};

// ==================== ACTION BUTTON ====================

const ActionButton = ({ icon: Icon, label, onClick, size = "h-4 w-4" }) => {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 shrink-0"
      aria-label={label}
      title={label}
    >
      <Icon className={size} />
    </button>
  );
};

// ==================== TREE CONNECTOR LINES ====================

/*
  نرسم الخطوط باستخدام repeating-linear-gradient بدل border-dashed.
  بهذه الطريقة تبقى الخطوط ظاهرة حتى لو كان هناك CSS عام يلغي border-style.
*/
const DashedVerticalLine = ({ style = {} }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute z-[1] block"
    style={{
      width: "2px",
      backgroundImage:
        "repeating-linear-gradient(to bottom, #cbd5e1 0px, #cbd5e1 5px, transparent 5px, transparent 10px)",
      ...style,
    }}
  />
);

const DashedHorizontalLine = ({ style = {} }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute z-[1] block"
    style={{
      height: "2px",
      backgroundImage:
        "repeating-linear-gradient(to right, #cbd5e1 0px, #cbd5e1 5px, transparent 5px, transparent 10px)",
      ...style,
    }}
  />
);

// ==================== SUBTASK ITEM ====================

const SubTaskItem = ({
  sub,
  taskId,
  onOpenEditModal,
  onOpenChecklistModal,
  onOpenSubTaskViewModal,
  setDeleteState,
  isLast,
  index,
  total,
}) => {
  const isCompleted = sub.status === "done" || sub.status === "completed";

  const assignees = sub.assignedTo || [];

  return (
    <div
      className="relative py-2 group/subtask"
      style={{ paddingLeft: "48px" }}
    >
      {/* الخط العمودي الذي يكمل شجرة الـSubtasks */}
      <DashedVerticalLine
        style={{
          left: "24px",
          top: 0,
          bottom: isLast ? "50%" : 0,
        }}
      />

      {/* فرع أفقي متقطع يصل الخط العمودي ببطاقة الـSubtask */}
      <DashedHorizontalLine
        style={{
          left: "24px",
          top: "50%",
          width: "36px",
          transform: "translateY(-50%)",
        }}
      />

      {/* بطاقة الـSubtask */}
      <div
        className={`relative z-10 ml-3 rounded-xl p-3 transition-all duration-200 ${
          isCompleted
            ? "border border-emerald-200/60 bg-emerald-50/70"
            : "border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-md"
        }`}
        style={{ marginLeft: "12px" }}
      >
        <div className="flex flex-col gap-2">
          {/* Row 1: Title & Status */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
              ) : (
                <Circle className="h-[18px] w-[18px] text-slate-300" />
              )}
            </button>

            <span
              className={`min-w-0 flex-1 truncate text-sm font-medium ${
                isCompleted ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {sub.title}
            </span>

            <span >
              <StatusBadge status={sub.status} />
            </span>
          </div>

          {/* Row 2: Badges & Info */}

          <div className="flex flex-wrap items-center gap-1.5 pl-7">
            {sub.dueDate && (
              <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatDate(sub.dueDate)}
              </span>
            )}

            {assignees.length > 0 && (
              <div className="flex items-center -space-x-1">
                {assignees.slice(0, 2).map((user, userIndex) => (
                  <div
                    key={user?._id || userIndex}
                    className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 text-[7px] font-bold text-white shadow-sm"
                    title={user?.fullName || "User"}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                ))}

                {assignees.length > 2 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[7px] font-medium text-slate-600">
                    +{assignees.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Row 3: Actions */}

          <div className="flex items-center justify-between border-t border-slate-100/60 pl-7 pt-2">
            <div className="flex items-center gap-0.5">
              {/* View Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenSubTaskViewModal?.(sub);
                }}
                className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 active:scale-95 shrink-0"
                aria-label="View SubTask"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenEditModal?.({
                    type: "subtask",
                    data: sub,
                    parentTaskId: taskId,
                  });
                }}
                className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-amber-600 hover:bg-slate-100 active:scale-95 shrink-0"
                aria-label="Edit SubTask"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              {/* Checklist Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenChecklistModal?.(sub);
                }}
                className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 active:scale-95 shrink-0"
                aria-label="Checklist"
              >
                <ListChecks className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Delete Button  */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setDeleteState({
                  open: true,
                  type: "subtask",
                  taskId: taskId,
                  subTaskId: sub._id,
                  title: sub.title,
                });
              }}
              className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-600 hover:bg-red-50 active:scale-95 shrink-0"
              aria-label="Delete SubTask"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const TasksTableViewMobile = ({
  tasks = [],
  permissions,
  onAddSubTask,
  onOpenEditModal,
  onOpenDetailsModal,
  onOpenChecklistModal,
  onDeleteTask,
  onDeleteSubTask,
  toast,
}) => {
  const [expanded, setExpanded] = useState({});

  const [deleteState, setDeleteState] = useState({
    open: false,
    type: null,
    taskId: null,
    subTaskId: null,
    title: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==================== TASK VIEW STATE ====================

  const [viewTask, setViewTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==================== SUBTASK VIEW STATE ====================

  const [viewSubTask, setViewSubTask] = useState(null);

  const [viewSubTaskParentId, setViewSubTaskParentId] = useState(null);

  const [isSubTaskViewModalOpen, setIsSubTaskViewModalOpen] = useState(false);

  // ==================== HANDLERS ====================

  const resetDeleteState = () => {
    setDeleteState({
      open: false,
      type: null,
      taskId: null,
      subTaskId: null,
      title: "",
    });
  };

  const toggle = (taskId, event) => {
    event?.stopPropagation();

    setExpanded((previous) => ({
      ...previous,
      [taskId]: !previous[taskId],
    }));
  };

  const handleCardClick = (taskId, event) => {
    event?.stopPropagation();

    setExpanded((previous) => ({
      ...previous,
      [taskId]: !previous[taskId],
    }));
  };

  const handleViewTask = (task) => {
    setViewTask(task);
    setIsViewModalOpen(true);

    onOpenDetailsModal?.(task);
  };

  const handleCloseTaskView = () => {
    setIsViewModalOpen(false);
    setViewTask(null);
  };

  const handleViewSubTask = (subTask, parentTaskId) => {
    setViewSubTask(subTask);
    setViewSubTaskParentId(parentTaskId);
    setIsSubTaskViewModalOpen(true);
  };

  const handleCloseSubTaskView = () => {
    setIsSubTaskViewModalOpen(false);
    setViewSubTask(null);
    setViewSubTaskParentId(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      if (deleteState.type === "task") {
        await onDeleteTask?.(deleteState.taskId);
      }

      if (deleteState.type === "subtask") {
        await onDeleteSubTask?.({
          taskId: deleteState.taskId,
          subTaskId: deleteState.subTaskId,
        });
      }

      resetDeleteState();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <div>
      <div className="w-full max-w-full space-y-3 px-1 pb-20">
        {tasks.map((task) => {
          const subTasks = task.subTasks || [];
          const hasChildren = subTasks.length > 0;
          const isOpen = expanded[task._id] || false;

          const completedSubtasks = subTasks.filter(
            (subTask) =>
              subTask.status === "done" || subTask.status === "completed",
          ).length;

          const progress =
            subTasks.length > 0
              ? Math.round((completedSubtasks / subTasks.length) * 100)
              : task.status === "done" || task.status === "completed"
                ? 100
                : 0;

          const isPinned =
            task.priority === "urgent" || task.priority === "high";

          return (
            <div key={task._id} className="relative w-full">
              {/* ==================== MAIN TASK CARD ==================== */}

              <div
                onClick={(event) => {
                  if (hasChildren) {
                    handleCardClick(task._id, event);
                  }
                }}
                className={`group/task relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white via-slate-50/30 to-white p-4 transition-all duration-300 ${
                  hasChildren ? "cursor-pointer" : "cursor-default"
                } ${
                  isPinned
                    ? "border-blue-200 shadow-xl shadow-blue-100/40 ring-1 ring-blue-200/30"
                    : "border-slate-200/80 shadow-sm hover:border-slate-300/60 hover:shadow-lg"
                }`}
              >
                {/* Shimmer Effect */}

                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/task:translate-x-full" />

                {/* Header Row */}

                <div className="relative z-10 flex items-center gap-1.5">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(event) => toggle(task._id, event)}
                      className="shrink-0 rounded-lg p-0.5 transition-all duration-200 hover:scale-110 hover:bg-slate-100/80 active:scale-95"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                      )}
                    </button>
                  ) : (
                    <div className="w-4 shrink-0" />
                  )}

                  <div className="shrink-0">
                    <StatusIcon status={task.status} />
                  </div>

                  <h3 className="min-w-0 flex-1 truncate text-[13px] font-medium leading-tight text-slate-800">
                    {task.title}
                  </h3>

                  <div className="shrink-0">
                    <StatusBadge status={task.status} />
                  </div>

                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="shrink-0 rounded-lg p-0.5 opacity-0 transition-all duration-200 hover:bg-slate-100/80 group-hover/task:opacity-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </button>
                </div>

                {/* Badges Row */}

                <div
                  className="relative z-10 mt-2.5 flex flex-wrap items-center gap-1.5"
                  onClick={(event) => event.stopPropagation()}
                >
                  {task.department && (
                    <span className="whitespace-nowrap rounded-full border border-indigo-100/50 bg-indigo-50/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {task.department}
                    </span>
                  )}

                  {task.sprint && (
                    <span className="whitespace-nowrap rounded-full border border-amber-100/50 bg-amber-50/80 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                      {task.sprint}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}

                {hasChildren ? (
                  <div
                    className="relative z-10 mt-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <ListChecks className="h-3 w-3 text-slate-400" />
                        Subtasks
                      </span>

                      <span className="text-slate-400">
                        {completedSubtasks}/{subTasks.length}
                      </span>

                      <span className="rounded-full border border-blue-100/50 bg-blue-50/80 px-2 py-0.5 font-bold text-blue-600">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/50">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          progress === 100
                            ? "bg-emerald-500"
                            : progress >= 70
                              ? "bg-blue-500"
                              : progress >= 40
                                ? "bg-amber-500"
                                : "bg-slate-400"
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                    {task.status === "done" || task.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

                        <span className="font-medium text-emerald-600">
                          Completed
                        </span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-slate-300" />

                        <span className="font-medium text-slate-400">
                          Not started
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Action Row */}
                {permissions?.canUpdateTask && (
                  <div
                    className="relative z-10 mt-3 flex items-center justify-between border-t border-slate-500 pt-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-center gap-0.5">
                      <ActionButton
                        icon={Plus}
                        label="Add Subtask"
                        onClick={() => onAddSubTask?.(task)}
                      />

                      <ActionButton
                        icon={ListChecks}
                        label="Checklist"
                        onClick={() => onOpenChecklistModal?.(task)}
                      />

                      <ActionButton
                        icon={Pencil}
                        label="Edit Task"
                        onClick={() =>
                          onOpenEditModal?.({
                            type: "task",
                            data: task,
                          })
                        }
                      />

                      <ActionButton
                        icon={Eye}
                        label="View Details"
                        onClick={() => handleViewTask(task)}
                      />
                    </div>

                    <ActionButton
                      icon={Trash2}
                      label="Delete Task"
                      onClick={() => {
                        if (task.subTasks?.length > 0) {
                          toast?.({
                            title: "Cannot delete task",
                            description: "Delete all subtasks first.",
                            variant: "destructive",
                          });

                          return;
                        }

                        setDeleteState({
                          open: true,
                          type: "task",
                          taskId: task._id,
                          subTaskId: null,
                          title: task.title,
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ==================== SUBTASKS SECTION ==================== */}

              {isOpen && hasChildren && (
                <div
                  className="relative overflow-visible rounded-b-2xl border-x border-b border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-slate-100/50 px-2 py-2.5"
                  onClick={(event) => event.stopPropagation()}
                >
                  {/* Subtasks List */}

                  <div className="relative">
                    {/*
                      يبدأ من أسفل بطاقة الـTask، يمر خلف عنوان Subtasks،
                      ثم يتصل بالخط العمودي لأول Subtask.
                    */}
                    <DashedVerticalLine
                      style={{
                        left: "24px",
                        top: "0px",
                        height: "52px",
                      }}
                    />

                    {subTasks.map((subTask, subIndex) => (
                      <SubTaskItem
                        key={subTask._id || subIndex}
                        sub={subTask}
                        taskId={task._id}
                        onOpenEditModal={onOpenEditModal}
                        onOpenChecklistModal={onOpenChecklistModal}
                        onOpenSubTaskViewModal={handleViewSubTask}
                        setDeleteState={setDeleteState}
                        isLast={subIndex === subTasks.length - 1}
                        index={subIndex}
                        total={subTasks.length}
                      />
                    ))}
                  </div>
                  {/* Subtasks Header */}

                  <div
                    className="relative z-10 mb-2 flex items-center justify-between px-2"
                    style={{ marginLeft: "48px" }}
                  >
                    <div></div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddSubTask?.(task);
                      }}
                      className="flex items-center gap-0.5 rounded-lg border border-blue-200/50 bg-white/80 px-2.5 py-1 text-[10px] font-medium text-blue-600 transition-all duration-200 hover:bg-blue-50"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ==================== TASK VIEW MODAL ==================== */}

      <TaskViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseTaskView}
        task={viewTask}
        onEdit={() => {
          if (!viewTask) return;

          onOpenEditModal?.({
            type: "task",
            data: viewTask,
          });

          handleCloseTaskView();
        }}
        onChecklist={() => {
          if (!viewTask) return;

          onOpenChecklistModal?.(viewTask);
          handleCloseTaskView();
        }}
      />

      {/* ==================== SUBTASK VIEW MODAL ==================== */}

      <SubTaskViewModal
        isOpen={isSubTaskViewModalOpen}
        onClose={handleCloseSubTaskView}
        subTask={viewSubTask}
        onEdit={() => {
          if (!viewSubTask) return;

          onOpenEditModal?.({
            type: "subtask",
            data: viewSubTask,
            parentTaskId: viewSubTaskParentId,
          });

          handleCloseSubTaskView();
        }}
        onChecklist={() => {
          if (!viewSubTask) return;

          onOpenChecklistModal?.(viewSubTask);
          handleCloseSubTaskView();
        }}
        onDelete={() => {
          if (!viewSubTask) return;

          setDeleteState({
            open: true,
            type: "subtask",
            taskId: viewSubTaskParentId,
            subTaskId: viewSubTask._id,
            title: viewSubTask.title,
          });

          handleCloseSubTaskView();
        }}
      />

      {/* ==================== DELETE MODAL ==================== */}

      <DeleteConfirmModal
        isOpen={deleteState.open}
        loading={deleteLoading}
        title={`Delete ${deleteState.type || ""}`}
        description={`Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`}
        stateName={deleteState.title}
        onClose={resetDeleteState}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TasksTableViewMobile;
