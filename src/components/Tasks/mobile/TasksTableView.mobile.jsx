// TasksTableViewMobile.jsx - نسخة مع خطوط شجرة مضمونة الظهور

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  Users,
  Plus,
  Pencil,
  ListChecks,
  Trash2,
  Eye,
  Calendar,
  Clock,
  MoreHorizontal,
  Star,
  ArrowRight,
  Paperclip,
  MessageCircle,
  AlertCircle,
  X,
  ArrowUp,
} from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

// ==================== CONSTANTS ====================
const STATUS_CONFIG = {
  todo: { bg: "bg-slate-100", text: "text-slate-600", label: "Todo" },
  in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    label: "In Progress",
  },
  review: { bg: "bg-purple-100", text: "text-purple-600", label: "Review" },
  done: { bg: "bg-green-100", text: "text-green-600", label: "Completed" },
  blocked: { bg: "bg-red-100", text: "text-red-600", label: "Blocked" },
};

const PRIORITY_CONFIG = {
  low: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Low" },
  medium: { bg: "bg-orange-50", text: "text-orange-500", label: "Medium" },
  high: { bg: "bg-orange-100", text: "text-orange-600", label: "High" },
  urgent: { bg: "bg-red-50", text: "text-red-500", label: "Urgent" },
};

// ==================== دوال مساعدة ====================
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ==================== مكونات البادجات ====================
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};
const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const isHigh = priority === "high" || priority === "urgent";
  
  // ألوان مخصصة لكل priority
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
    done: <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" />,
    blocked: <X className="h-4 w-4 text-slate-400 shrink-0" />,
  };
  return icons[status] || icons.todo;
};

// ==================== ActionButton ====================
const ActionButton = ({ icon: Icon, label, onClick, size = "h-4 w-4" }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 shrink-0"
    aria-label={label}
  >
    <Icon className={size} />
  </button>
);

// ==================== SubTask Item مع خطوط الشجرة ====================
const SubTaskItem = ({
  sub,
  taskId,
  onOpenEditModal,
  onOpenChecklistModal,
  setDeleteState,
  isFirst,
  isLast,
}) => {
  const isCompleted = sub.status === "done" || sub.status === "completed";

  return (
    <div className="relative pl-10 py-1.5 group/subtask">
      {/* ===== الخط العمودي الرئيسي (الخط الطويل) ===== */}
      <div
        className="absolute left-5 top-0 bottom-0 w-[2px] bg-black"
        style={{
          zIndex: 1,
          top: isFirst ? "50%" : "0",
          bottom: isLast ? "50%" : "0",
        }}
      />

      {/* ===== الخط الأفقي (الخط اللي يربط النقطة بالكارت) ===== */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-black"
        style={{ zIndex: 1 }}
      />

      {/* ===== نقطة الاتصال (دائرة سوداء) ===== */}
      <div
        className="absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-white shadow-sm"
        style={{ zIndex: 2 }}
      />

      {/* ===== محتوى الـ SubTask ===== */}
      <div
        className="relative bg-white rounded-[12px] px-3 py-2.5 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200 ml-2 group-hover/subtask:shadow-md"
        style={{ zIndex: 3 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 shrink-0" />
            )}
          </button>

          <span
            className={`flex-1 text-xs truncate min-w-[50px] ${isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}
          >
            {sub.title}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            <StatusBadge status={sub.status} />
            <PriorityBadge priority={sub.priority} />
          </div>

          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
            {formatDate(sub.dueDate)}
          </span>

          {sub.assignedTo?.length > 0 && (
            <div className="flex items-center -space-x-1 shrink-0">
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-medium text-slate-600">
                JD
              </div>
            </div>
          )}

          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/subtask:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditModal?.({
                  type: "subtask",
                  data: sub,
                  parentTaskId: taskId,
                });
              }}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <Pencil className="h-3 w-3 shrink-0" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChecklistModal?.(sub);
              }}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <ListChecks className="h-3 w-3 shrink-0" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteState({
                  open: true,
                  type: "subtask",
                  taskId: taskId,
                  subTaskId: sub._id,
                  title: sub.title,
                });
              }}
              className="p-0.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
            >
              <Trash2 className="h-3 w-3 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== المكون الرئيسي ====================
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

  const toggle = (taskId, e) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCardClick = (taskId, e) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
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
      setDeleteState({
        open: false,
        type: null,
        taskId: null,
        subTaskId: null,
        title: "",
      });
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full space-y-4 pb-20 overflow-hidden px-1">
      {tasks.map((task, index) => {
        const subTasks = task.subTasks || [];
        const hasChildren = subTasks.length > 0;
        const isOpen = expanded[task._id] || false;
        const assigneesCount = task.assignedTo?.length || 0;

        const completedSubtasks = subTasks.filter(
          (st) => st.status === "done" || st.status === "completed",
        ).length;
        const progress =
          subTasks.length > 0
            ? Math.round((completedSubtasks / subTasks.length) * 100)
            : 0;

        const isPinned =
          index === 0 || task.priority === "urgent" || task.priority === "high";

        return (
          <div key={task._id} className="relative w-full max-w-full">
            {/* ===== MAIN TASK CARD ===== */}
            <div
              onClick={(e) => {
                if (hasChildren) {
                  handleCardClick(task._id, e);
                }
              }}
              className={`group/task relative p-5 bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                hasChildren ? "cursor-pointer" : "cursor-default"
              } hover:shadow-xl ${
                isPinned
                  ? "border-blue-200 shadow-xl shadow-blue-100/40 ring-1 ring-blue-200/30"
                  : "border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300/60"
              } ${isOpen && hasChildren ? "rounded-b-none border-b-0" : ""}`}
            >
              {/* ===== SHIMMER EFFECT ===== */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/task:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* ===== HEADER ROW ===== */}
           <div className="flex items-center gap-1.5 w-full">
  {/* ===== زر التوسيع ===== */}
  {hasChildren ? (
    <button
      onClick={(e) => toggle(task._id, e)}
      className="shrink-0 p-0.5 hover:bg-slate-100/80 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label={isOpen ? "Collapse" : "Expand"}
    >
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      )}
    </button>
  ) : (
    <div className="w-4 shrink-0" />
  )}

  <div className="shrink-0">
    <StatusIcon status={task.status} />
  </div>

  <h3 className="flex-1 font-medium text-slate-800 text-[13px] leading-tight truncate min-w-0">
    {task.title}
  </h3>

  <div className="shrink-0">
    <PriorityBadge priority={task.priority} />
  </div>

  <button
    onClick={(e) => e.stopPropagation()}
    className="shrink-0 p-0.5 hover:bg-slate-100/80 rounded-lg transition-all duration-200 opacity-0 group-hover/task:opacity-100"
  >
    <MoreHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
  </button>
</div>

              {/* ===== BADGES ROW ===== */}
              <div
                className="flex flex-wrap items-center gap-2 mt-3.5"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusBadge status={task.status} />

                {task.department && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50/80 text-indigo-600 whitespace-nowrap border border-indigo-100/50 backdrop-blur-sm">
                    {task.department}
                  </span>
                )}
                {task.sprint && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50/80 text-amber-600 whitespace-nowrap border border-amber-100/50 backdrop-blur-sm">
                    {task.sprint}
                  </span>
                )}
              </div>

              {/* ===== METADATA ROW ===== */}
              <div
                className="flex flex-wrap items-center gap-2 mt-3.5 bg-slate-50/70 rounded-xl px-3.5 py-2.5 border border-slate-100/60 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-600">
                    {formatDate(task.startDate)}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-600">
                    {formatDate(task.dueDate)}
                  </span>
                </div>

                <span className="w-px h-4 bg-slate-200/80" />

                <span className="w-px h-4 bg-slate-200/80" />

                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600">
                    {assigneesCount}
                  </span>
                </div>

                <span className="w-px h-4 bg-slate-200/80" />

                <div className="flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600">
                    {task.attachments?.length || 0}
                  </span>
                </div>

                <span className="w-px h-4 bg-slate-200/80" />

                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-600">
                    {task.comments?.length || 0}
                  </span>
                </div>
              </div>

              {/* ===== PROGRESS BAR ===== */}
              {hasChildren && (
                <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 px-0.5">
                    <span className="font-semibold flex items-center gap-1.5 text-slate-600">
                      <ListChecks className="h-3.5 w-3.5 text-slate-400" />
                      Subtasks
                    </span>
                    <span className="text-slate-400">
                      {completedSubtasks} / {subTasks.length} Completed
                    </span>
                    <span className="font-bold text-blue-600 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100/50 backdrop-blur-sm">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ===== ACTION ROW ===== */}
              {permissions?.canUpdateTask && (
                <div
                  className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-200/60"
                  onClick={(e) => e.stopPropagation()}
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
                        onOpenEditModal?.({ type: "task", data: task })
                      }
                    />

                    <ActionButton
                      icon={Eye}
                      label="View Details"
                      onClick={() => onOpenDetailsModal?.(task)}
                    />
                  </div>

                  <ActionButton
                    icon={Trash2}
                    label="Delete Task"
                    onClick={() => {
                      if (task.subTasks?.length > 0) {
                        toast({
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

            {/* ===== SUBTASKS SECTION مع خطوط الشجرة ===== */}
            {isOpen && hasChildren && (
              <div
                className="relative bg-[#F8FAFC] border-x border-b border-[#EDF2F7] px-3 py-2.5 rounded-b-[22px] animate-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ===== الخط العمودي من الأب (يربط الكارت بأول ابن) ===== */}
                <div
                  className="absolute left-5 top-0 w-[2px] h-4 bg-black"
                  style={{ zIndex: 1 }}
                />

                {/* ===== الخط العمودي الرئيسي (يمتد طول المنطقة) ===== */}
                <div
                  className="absolute left-5 top-4 bottom-0 w-[2px] bg-black"
                  style={{ zIndex: 1 }}
                />

                {subTasks.map((sub, subIndex) => (
                  <SubTaskItem
                    key={sub._id || subIndex}
                    sub={sub}
                    taskId={task._id}
                    onOpenEditModal={onOpenEditModal}
                    onOpenChecklistModal={onOpenChecklistModal}
                    setDeleteState={setDeleteState}
                    isFirst={subIndex === 0}
                    isLast={subIndex === subTasks.length - 1}
                  />
                ))}

                {/* ===== زر إضافة Subtask مع شجرة ===== */}
                <div className="relative pl-10 py-1.5 group/add">
                  {/* الخط العمودي */}
                  <div
                    className="absolute left-5 top-0 bottom-1/2 w-[2px] bg-black"
                    style={{ zIndex: 1 }}
                  />

                  {/* نقطة */}
                  <div
                    className="absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-white shadow-sm"
                    style={{ zIndex: 2 }}
                  />

                  {/* الخط الأفقي */}
                  <div
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-black"
                    style={{ zIndex: 1 }}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSubTask?.(task);
                    }}
                    className="relative flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 transition-colors ml-2 hover:bg-blue-50 rounded-lg"
                    style={{ zIndex: 3 }}
                  >
                    <Plus className="h-3.5 w-3.5 shrink-0" />
                    Add subtask
                  </button>
                </div>

                {/* ===== نهاية الخط العمودي ===== */}
                <div
                  className="absolute left-5 bottom-3 w-[2px] h-3 bg-black"
                  style={{ zIndex: 1 }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* ===== DELETE MODAL ===== */}
      <DeleteConfirmModal
        isOpen={deleteState.open}
        loading={deleteLoading}
        title={`Delete ${deleteState.type}`}
        description={`Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`}
        stateName={deleteState.title}
        onClose={() =>
          setDeleteState({
            open: false,
            type: null,
            taskId: null,
            subTaskId: null,
            title: "",
          })
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TasksTableViewMobile;
