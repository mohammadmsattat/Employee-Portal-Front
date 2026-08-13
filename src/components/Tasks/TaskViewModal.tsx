// TaskViewModal.jsx - Unified design with other modals

import { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Users,
  Paperclip,
  MessageCircle,
  Clock,
  User,
  Tag,
  CheckCircle2,
  Circle,
  AlertCircle,
  Zap,
  Edit2,
  ListChecks,
  Trash2,
  CalendarDays,
  FileText,
  Link2,
  ChevronDown,
  ChevronRight,
  Flag,
  UserCircle,
  Briefcase,
} from "lucide-react";

// ==================== CONSTANTS ====================
const STATUS_CONFIG = {
  todo: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "To Do",
    dot: "bg-slate-400",
    icon: Circle,
  },
  in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "In Progress",
    dot: "bg-blue-500",
    icon: Zap,
  },
  review: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "In Review",
    dot: "bg-purple-500",
    icon: AlertCircle,
  },
  done: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Done",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  blocked: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Blocked",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
};

const PRIORITY_CONFIG = {
  low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Low",
    icon: "low",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Medium",
    icon: "medium",
  },
  high: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "High",
    icon: "high",
  },
  urgent: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Urgent",
    icon: "urgent",
  },
};

// ==================== HELPERS ====================
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRelativeTime = (date) => {
  if (!date) return "—";
  const now = new Date();
  const diff = Number(now) - Number(new Date(date)); 
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(date);
};

const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = Number(due) - Number(now); 
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

// ==================== SUB-COMPONENTS ====================

// ===== Status Badge =====
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// ===== Priority Badge =====
const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      <Flag className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

// ===== Info Row =====
const InfoRow = ({ 
  icon: Icon, 
  label, 
  value, 
  children, 
  highlight = false 
}: {
  icon: any;
  label: string;
  value?: any; 
  children?: React.ReactNode;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 py-2.5 ${highlight ? "bg-blue-50/50 -mx-2 px-2 rounded-lg" : ""}`}
  >
    <div className="shrink-0">
      <Icon className="h-4.5 w-4.5 text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      {children || (
        <p className="text-sm font-medium text-slate-700 mt-0.5 break-words">
          {value || "—"}
        </p>
      )}
    </div>
  </div>
);

// ===== Assignee Avatar =====
const AssigneeAvatar = ({ user, size = "sm" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 text-[9px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  return (
    <div
      className={`shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md ring-2 ring-white ${sizeClasses[size]}`}
    >
      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
};

// ===== Tag Item =====
const TagItem = ({ tag }) => {
  const colors = [
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
  ];
  const colorIndex = tag.length % colors.length;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${colors[colorIndex]}`}
    >
      #{tag}
    </span>
  );
};

// ===== Subtask Item =====
const SubtaskItem = ({ subtask }) => {
  const isDone = subtask.status === "done" || subtask.status === "completed";

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all">
      <button className="shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300 hover:text-blue-400 transition" />
        )}
      </button>
      <span
        className={`flex-1 text-sm ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}
      >
        {subtask.title}
      </span>
      <StatusBadge status={subtask.status} />
    </div>
  );
};

// ===== Progress Bar =====
const ProgressBar = ({ progress, subtasks = [] }) => {
  const completed = subtasks.filter(
    (st) => st.status === "done" || st.status === "completed",
  ).length;
  const total = subtasks.length;

  const getColor = () => {
    if (progress === 100) return "bg-emerald-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-slate-400";
  };

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-blue-500" />
          Progress
        </span>
        <span className="text-sm font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          {completed}/{total} • {progress}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const TaskViewModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onChecklist,
  onDelete,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef(null);
  const bodyRef = useRef(null);

  // ===== Check Mobile =====
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ===== Close on Escape =====
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // ===== Close on Outside Click =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // ===== Prevent Scroll =====
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !task) return null;

  // ===== Computed Values =====
  const subTasks = task.subTasks || [];
  const completedSubtasks = subTasks.filter(
    (st) => st.status === "done" || st.status === "completed",
  ).length;
  const progress =
    subTasks.length > 0
      ? Math.round((completedSubtasks / subTasks.length) * 100)
      : task.status === "done"
        ? 100
        : 0;

  const assignees = task.assignedTo || [];
  const hasAssignees = assignees.length > 0;
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isToday = daysUntilDue === 0;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
      <div className="flex max-h-[96vh] w-full flex-col rounded-t-[28px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-h-[92vh] sm:max-w-3xl sm:rounded-2xl">
        {/* ===== HEADER - Same as AddWorkspaceModal ===== */}
        <div
          className="relative shrink-0 overflow-hidden px-4 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
          }}
        >
          {/* Decorative blur elements */}
          <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/20 blur-2xl sm:-right-10 sm:-top-12 sm:h-32 sm:w-32" />
          <div className="absolute -left-8 top-6 h-20 w-20 rounded-full bg-indigo-200/20 blur-2xl sm:-left-10 sm:top-8 sm:h-24 sm:w-24" />

          {/* Mobile handle */}
          <div className="mx-auto mb-2.5 h-1 w-12 rounded-full bg-slate-300/60 sm:hidden" />

          <div className="relative flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40 sm:h-11 sm:w-11 sm:rounded-xl">
                <FileText className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-blue-900 sm:text-lg truncate">
                  {task.title}
                </h3>

                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />

                  {/* Due Date Indicator */}
                  {task.dueDate && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isOverdue
                          ? "bg-red-100 text-red-700"
                          : isToday
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {isOverdue
                        ? `${Math.abs(daysUntilDue)}d overdue`
                        : isToday
                          ? "Due today"
                          : `${daysUntilDue}d left`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              {/* Edit Button */}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-amber-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
                  aria-label="Edit Task"
                >
                  <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}

              {/* Checklist Button */}
              {onChecklist && subTasks.length > 0 && (
                <button
                  onClick={onChecklist}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-indigo-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
                  aria-label="View Checklist"
                >
                  <ListChecks className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-red-50 hover:text-red-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
                  aria-label="Delete Task"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6"
        >
          <div className="grid gap-3.5 sm:gap-4">
            {/* Description */}
            {task.description ? (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-4 sm:p-5 border border-slate-200/60">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="h-5 w-5 mx-auto mb-1 text-slate-300" />
                No description provided
              </div>
            )}

            {/* Progress */}
            {subTasks.length > 0 && (
              <ProgressBar progress={progress} subtasks={subTasks} />
            )}

            {/* Subtasks List */}
            {subTasks.length > 0 && (
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <ListChecks className="h-3.5 w-3.5" />
                    Subtasks ({subTasks.length})
                  </h4>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {subTasks.slice(0, 5).map((sub, index) => (
                    <SubtaskItem key={sub._id || index} subtask={sub} />
                  ))}
                  {subTasks.length > 5 && (
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                      + {subTasks.length - 5} more subtasks
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Details Grid - Same style as AddWorkspaceModal members */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-4 sm:p-5 border border-slate-200/60">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                {/* Left Column */}
                <div>
                  {/* Start Date */}
                  <InfoRow
                    icon={Calendar}
                    label="Start Date"
                    value={task.startDate ? formatDate(task.startDate) : "—"}
                  />

                  {/* Due Date */}
                  <InfoRow
                    icon={Calendar}
                    label="Due Date"
                    highlight={isOverdue}
                  >
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-sm font-medium ${isOverdue ? "text-red-600" : isToday ? "text-amber-600" : "text-slate-700"}`}
                      >
                        {task.dueDate ? formatDate(task.dueDate) : "—"}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          Overdue
                        </span>
                      )}
                      {isToday && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                  </InfoRow>
                </div>

                {/* Right Column */}
                <div>
                  {/* Assignees */}
                  <InfoRow icon={Users} label="Assignees">
                    {hasAssignees ? (
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {assignees.slice(0, 3).map((user, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm"
                          >
                            <AssigneeAvatar user={user} size="sm" />
                            <span className="text-xs font-medium text-slate-700">
                              {user.fullName || "Unknown"}
                            </span>
                          </div>
                        ))}
                        {assignees.length > 3 && (
                          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                            +{assignees.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No assignees</p>
                    )}
                  </InfoRow>

                  {/* Created By */}
                  <InfoRow icon={UserCircle} label="Created By">
                    <div className="flex items-center gap-2 mt-0.5">
                      <AssigneeAvatar user={task.createdBy} size="sm" />
                      <span className="text-sm font-medium text-slate-700">
                        {task.createdBy?.fullName || "Unknown"}
                      </span>
                    </div>
                  </InfoRow>
                </div>
              </div>

              {/* Tags - Full Width */}
              {task.tags && task.tags.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <InfoRow icon={Tag} label="Tags">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {task.tags.map((tag, idx) => (
                        <TagItem key={idx} tag={tag} />
                      ))}
                    </div>
                  </InfoRow>
                </div>
              )}

              {/* Attachments - Full Width */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <InfoRow icon={Paperclip} label="Attachments">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {task.attachments.map((att, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white border border-slate-200 shadow-sm"
                        >
                          <Paperclip className="h-3 w-3 text-slate-400" />
                          {att.name || `File ${idx + 1}`}
                        </span>
                      ))}
                    </div>
                  </InfoRow>
                </div>
              )}

              {/* Comments - Full Width */}
              {task.comments && task.comments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <InfoRow icon={MessageCircle} label="Comments">
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-slate-700">
                        {task.comments.length}{" "}
                        {task.comments.length === 1 ? "comment" : "comments"}
                      </span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        View all
                      </button>
                    </div>
                  </InfoRow>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== FOOTER - Same as AddWorkspaceModal ===== */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-7 rounded-b-2xl">
          <div className="flex items-center justify-between gap-2">
            {/* Left Section - Created info */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Created {formatRelativeTime(task.createdAt)}</span>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Done Button */}
              <button
                onClick={onClose}
                className="h-10 rounded-2xl bg-blue-600 px-4 font-medium text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] sm:h-11 sm:rounded-lg sm:px-6"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
