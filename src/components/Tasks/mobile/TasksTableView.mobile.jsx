// TasksTableViewMobile.jsx
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
  User,
  Star,
  ArrowRight,
  Paperclip,
  MessageCircle,
  AlertCircle,
  Check,
  X,
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
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

// أيقونة الحالة
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

// ==================== زر الإجراء ====================
const ActionButton = ({ icon: Icon, label, onClick, size = "h-4 w-4" }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 shrink-0"
    aria-label={label}
  >
    <Icon className={size} />
  </button>
);

// ==================== SubTask Item - مثل رسم الشجرة في الصورة ====================
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
    <div className="relative pl-8 py-1 group/subtask">
      {/* ===== الخط العمودي الرئيسي (┃) ===== */}
      <div
        className={`absolute left-4 w-[2px] bg-[#CBD5E1] transition-all duration-300 ${
          isFirst ? "top-1/2" : "top-0"
        } ${isLast ? "h-1/2" : "h-full"}`}
        style={{ zIndex: 1 }}
      />

      {/* ===== نقطة الاتصال (●) ===== */}
      <div
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        style={{ zIndex: 3 }}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-green-500 bg-white rounded-full shrink-0" />
        ) : (
          <Circle className="h-4 w-4 text-[#94A3B8] bg-white rounded-full shrink-0" />
        )}
      </div>

      {/* ===== الخط الأفقي (├──) ===== */}
      <div
        className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5 h-[2px] bg-[#CBD5E1]"
        style={{ zIndex: 1 }}
      />

      {/* ===== محتوى الـ SubTask ===== */}
      <div
        className="relative bg-white rounded-[12px] px-3 py-2.5 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200 ml-6 group-hover/subtask:shadow-md"
        style={{ zIndex: 2 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Checkbox */}
          <button className="shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 shrink-0" />
            )}
          </button>

          {/* العنوان */}
          <span
            className={`flex-1 text-xs truncate min-w-[50px] ${isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}
          >
            {sub.title}
          </span>

          {/* البادجات */}
          <div className="flex items-center gap-1 shrink-0">
            <StatusBadge status={sub.status} />
            <PriorityBadge priority={sub.priority} />
          </div>

          {/* التاريخ */}
          <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
            {formatDate(sub.dueDate)}
          </span>

          {/* الأفاتار */}
          {sub.assignedTo?.length > 0 && (
            <div className="flex items-center -space-x-1 shrink-0">
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-medium text-slate-600">
                JD
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/subtask:opacity-100 transition-opacity duration-200">
            <button
              onClick={() =>
                onOpenEditModal?.({
                  type: "subtask",
                  data: sub,
                  parentTaskId: taskId,
                })
              }
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <Pencil className="h-3 w-3 shrink-0" />
            </button>
            <button
              onClick={() => onOpenChecklistModal?.(sub)}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <ListChecks className="h-3 w-3 shrink-0" />
            </button>
            <button
              onClick={() => {
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

  const toggle = (taskId) => {
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
        const isOpen = expanded[task._id];
        const subTasks = task.subTasks || [];
        const assigneesCount = task.assignedTo?.length || 0;

        // حساب التقدم
        const completedSubtasks = subTasks.filter(
          (st) => st.status === "done" || st.status === "completed",
        ).length;
        const progress =
          subTasks.length > 0
            ? Math.round((completedSubtasks / subTasks.length) * 100)
            : 0;

        // تحديد إذا كانت المهمة مميزة
        const isPinned =
          index === 0 || task.priority === "urgent" || task.priority === "high";

        return (
          <div key={task._id} className="relative w-full max-w-full">
            {/* ===== MAIN TASK CARD ===== */}
            <div
              className={`group/task relative p-5 bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isPinned
                  ? "border-blue-200 shadow-xl shadow-blue-100/40 ring-1 ring-blue-200/30"
                  : "border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300/60"
              } ${isOpen && subTasks.length > 0 ? "rounded-b-none border-b-0" : ""}`}
            >
              {/* ===== SHIMMER EFFECT ===== */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/task:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* ===== PINNED BADGE ===== */}
              {isPinned && (
                <div className="absolute -top-px -right-px">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 blur-xl opacity-40 rounded-full" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[9px] font-bold px-3.5 py-1.5 rounded-bl-2xl rounded-tr-2xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-white/80" />
                      Pinned
                    </div>
                  </div>
                </div>
              )}

              {/* ===== HEADER ROW ===== */}
              <div className="flex items-start gap-3 w-full">
                {subTasks.length > 0 && (
                  <button
                    onClick={() => toggle(task._id)}
                    className="shrink-0 mt-1 p-1 hover:bg-slate-100/80 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-500 shrink-0" />
                    )}
                  </button>
                )}

                <div className="shrink-0 mt-0.5">
                  <StatusIcon status={task.status} />
                </div>

                <h3 className="flex-1 font-semibold text-slate-800 text-[15px] leading-snug line-clamp-2 min-w-0 break-words">
                  {task.title}
                </h3>

                <button className="shrink-0 p-1.5 hover:bg-slate-100/80 rounded-xl transition-all duration-200 opacity-0 group-hover/task:opacity-100">
                  <MoreHorizontal className="h-5 w-5 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* ===== DESCRIPTION ===== */}
              {task.description && (
                <p className="mt-2.5 text-sm text-slate-500/90 leading-relaxed line-clamp-2 break-words pl-1">
                  {task.description}
                </p>
              )}

              {/* ===== BADGES ROW ===== */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
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
              <div className="flex flex-wrap items-center gap-2 mt-3.5 bg-slate-50/70 rounded-xl px-3.5 py-2.5 border border-slate-100/60 backdrop-blur-sm">
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

                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-600">
                    {task.estimatedHours || 8}h
                  </span>
                </div>

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
              {subTasks.length > 0 && (
                <div className="mt-4">
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
                <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-200/60">
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

            {/* ===== SUBTASKS SECTION - رسم شجرة مثل الصورة ===== */}
            {isOpen && subTasks.length > 0 && (
              <div className="relative bg-[#F8FAFC] border-x border-b border-[#EDF2F7] px-3 py-2.5 space-y-2 rounded-b-[22px]">
                {/* ===== الخط العمودي من الأب (┃) ===== */}
                <div
                  className="absolute left-4 top-0 w-[2px] h-3 bg-[#CBD5E1]"
                  style={{ zIndex: 1 }}
                />

                {/* ===== الخط العمودي الرئيسي (┃) ===== */}
                <div
                  className="absolute left-4 top-3 bottom-0 w-[2px] bg-[#CBD5E1]"
                  style={{ zIndex: 1 }}
                />

                {subTasks.map((sub, subIndex) => (
                  <SubTaskItem
                    key={sub._id}
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
                <div className="relative pl-8 py-0.5 group/add">
                  {/* الخط العمودي (┃) */}
                  <div
                    className="absolute left-4 top-0 bottom-1/2 w-[2px] bg-[#CBD5E1]"
                    style={{ zIndex: 1 }}
                  />

                  {/* نقطة (●) */}
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ zIndex: 3 }}
                  >
                    <Circle className="h-4 w-4 text-[#94A3B8] bg-white rounded-full shrink-0" />
                  </div>

                  {/* الخط الأفقي (├──) */}
                  <div
                    className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5 h-[2px] bg-[#CBD5E1]"
                    style={{ zIndex: 1 }}
                  />

                  <button
                    onClick={() => onAddSubTask?.(task)}
                    className="relative flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 transition-colors ml-6 hover:bg-blue-50 rounded-lg"
                    style={{ zIndex: 2 }}
                  >
                    <Plus className="h-3.5 w-3.5 shrink-0" />
                    Add subtask
                  </button>
                </div>

                {/* ===== نهاية الخط العمودي (┃) ===== */}
                <div
                  className="absolute left-4 bottom-3 w-[2px] h-2 bg-[#CBD5E1]"
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