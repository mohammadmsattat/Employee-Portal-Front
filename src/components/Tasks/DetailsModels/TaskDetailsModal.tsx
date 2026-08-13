// TaskDetailsModal.tsx - مع إعادة جلب البيانات وأنواع TypeScript

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  ReactNode,
} from "react";
import {
  X,
  ChevronRight,
  ArrowLeft,
  Clock,
  Calendar,
  User,
  MessageSquare,
  FileText,
  MoreVertical,
  CheckCircle,
  Circle,
  AlertCircle,
  Zap,
  LucideIcon,
} from "lucide-react";
import { useTaskDetailsModal } from "@/hooks/Tasks/DetailsModels/useTaskDetailsModal";
import TaskEditor from "./TaskEditor";
import TaskActivity from "./TaskActivity";

// ==================== TYPES ====================

interface User {
  _id: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
}

interface AssignedTo {
  _id: string;
  fullName?: string;
  email?: string;
}

interface TaskEntity {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: AssignedTo[];
  dueDate?: string | Date;
  startDate?: string | Date;
  timeSpent?: string;
  tags?: string[];
  attachments?: any[];
  comments?: any[];
  subTasks?: any[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: User;
  [key: string]: any;
}

interface Workspace {
  _id: string;
  name: string;
  [key: string]: any;
}

interface List {
  _id: string;
  name: string;
  [key: string]: any;
}

interface Permissions {
  canEdit?: boolean;
  canDelete?: boolean;
  canComment?: boolean;
  canAssign?: boolean;
  [key: string]: any;
}

interface StatusConfig {
  bg: string;
  text: string;
  iconColor: string;
  icon: LucideIcon;
  label: string;
  dotColor: string;
  pulse: boolean;
}

interface StatusConfigs {
  [key: string]: StatusConfig;
}

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
}

// ==================== PROPS TYPES ====================

interface MobileHeaderProps {
  entity: TaskEntity | null;
  onClose: () => void;
  statusConfig: StatusConfig;
  listName: List | null;
  showOptions: boolean;
  setShowOptions: (value: boolean) => void;
  optionsRef: React.RefObject<HTMLDivElement | null>;
}

interface DesktopHeaderProps {
  entity: TaskEntity | null;
  onClose: () => void;
  statusConfig: StatusConfig;
  workspace: Workspace | null;
  folderName: string | null;
  listName: List | null;
}

interface MobileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activityCount: number;
}

interface TaskDetailsModalProps {
  entity: TaskEntity | null;
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
  folderName: string | null;
  listName: List | null;
  permissions?: Permissions | null;
  refetchTasks?: () => void;
}

// ==================== STATUS CONFIG ====================

const STATUS_CONFIGS: StatusConfigs = {
  todo: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    iconColor: "text-slate-500",
    icon: Circle,
    label: "To Do",
    dotColor: "bg-slate-400",
    pulse: false,
  },
  in_progress: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    iconColor: "text-blue-500",
    icon: Zap,
    label: "In Progress",
    dotColor: "bg-blue-500",
    pulse: true,
  },
  review: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    iconColor: "text-amber-500",
    icon: AlertCircle,
    label: "Review",
    dotColor: "bg-amber-500",
    pulse: true,
  },
  done: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    iconColor: "text-emerald-500",
    icon: CheckCircle,
    label: "Done",
    dotColor: "bg-emerald-500",
    pulse: false,
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    iconColor: "text-red-500",
    icon: X,
    label: "Cancelled",
    dotColor: "bg-red-500",
    pulse: false,
  },
};

const getStatusConfig = (status: string | undefined): StatusConfig => {
  if (!status) return STATUS_CONFIGS.todo;
  return STATUS_CONFIGS[status] || STATUS_CONFIGS.todo;
};

// ==================== HELPERS ====================

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "No due";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ==================== MOBILE HEADER ====================

const MobileHeader = memo(
  ({
    entity,
    onClose,
    statusConfig,
    listName,
    showOptions,
    setShowOptions,
    optionsRef,
  }: MobileHeaderProps) => (
    <div className="relative px-4 py-3 bg-white border-b border-slate-200/50 safe-area-top">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:bg-slate-200 transition touch-feedback hover:bg-slate-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {entity?.title || "Task"}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`
              inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full 
              text-[10px] font-semibold transition-all duration-200
              ${statusConfig.bg} ${statusConfig.text}
              hover:scale-105 hover:shadow-sm cursor-default
            `}
            >
              <statusConfig.icon
                className={`h-3 w-3 ${statusConfig.iconColor}`}
                strokeWidth={2.5}
              />
              {statusConfig.label}
            </span>
            <span className="text-[10px] text-slate-300 select-none">•</span>
            <span className="text-[10px] text-slate-500 truncate max-w-[120px] font-medium hover:text-slate-700 transition-colors duration-200">
              {listName?.name || "No List"}
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
);

MobileHeader.displayName = "MobileHeader";

// ==================== DESKTOP HEADER ====================

const DesktopHeader = memo(
  ({
    entity,
    onClose,
    statusConfig,
    workspace,
    folderName,
    listName,
  }: DesktopHeaderProps) => (
    <div
      className="relative shrink-0 overflow-hidden px-6 py-4 md:px-7 md:py-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
      }}
    >
      <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/20 blur-2xl sm:-right-10 sm:-top-12 sm:h-32 sm:w-32" />
      <div className="absolute -left-8 top-6 h-20 w-20 rounded-full bg-indigo-200/20 blur-2xl sm:-left-10 sm:top-8 sm:h-24 sm:w-24" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
            <span className="text-lg font-bold">
              {entity?.title?.charAt(0)?.toUpperCase() || "T"}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-600/80">Task Details</p>
            <h3 className="text-lg font-bold text-blue-900 truncate max-w-[400px]">
              {entity?.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm hover:shadow-sm"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{workspace?.name}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-600">{folderName || "No Folder"}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-600">{listName?.name}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span
          className={`
          inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full 
          text-[10px] font-medium transition-all duration-200
          ${statusConfig.bg} ${statusConfig.text}
          hover:scale-105 hover:shadow-sm cursor-default
        `}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`
              absolute inline-flex h-full w-full rounded-full 
              ${statusConfig.dotColor} 
              ${statusConfig.pulse ? "animate-ping opacity-75" : ""}
            `}
            />
            <span
              className={`
              relative inline-flex h-1.5 w-1.5 rounded-full 
              ${statusConfig.dotColor}
            `}
            />
          </span>
          {statusConfig.label}
        </span>
      </div>
    </div>
  ),
);

DesktopHeader.displayName = "DesktopHeader";

// ==================== MOBILE TABS ====================

const MobileTabs = memo(
  ({ activeTab, setActiveTab, activityCount }: MobileTabsProps) => {
    const tabs: Tab[] = [
      { id: "details", icon: FileText, label: "Details" },
      {
        id: "activity",
        icon: MessageSquare,
        label: `Activity (${activityCount})`,
      },
    ];

    return (
      <div className="shrink-0 bg-white border-b border-slate-200/50 px-4">
        <div className="flex gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
              relative flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }
            `}
            >
              <tab.icon
                className={`h-4.5 w-4.5 ${activeTab === tab.id ? "text-blue-600" : "text-slate-400"}`}
              />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

MobileTabs.displayName = "MobileTabs";

// ==================== MAIN COMPONENT ====================

function TaskDetailsModal({
  entity,
  isOpen,
  onClose,
  workspace,
  folderName,
  listName,
  permissions,
  refetchTasks,
}: TaskDetailsModalProps) {
  // ===== STATE =====
  const [commentText, setCommentText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // ===== EFFECTS =====
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== HOOKS =====
  const {
    form,
    updateField,
    saveTask,
    activity,
    addComment,
    openPanel,
    handleOpen,
    closeSubModal,
    popoverStyle,
    activityLoading,
    activityError,
    refetchActivity,
  } = useTaskDetailsModal({
    entity,
    onClose,
    workspaceId: workspace?._id || "",
    listId: listName?._id || "",
  });

  // ===== Re-fetch data when modal opens or task changes =====
  useEffect(() => {
    if (isOpen && entity?._id) {
      refetchActivity?.();
    }
  }, [isOpen, entity?._id, refetchActivity]);

  // ===== RENDER =====
  if (!isOpen || !entity) return null;

  const statusConfig = getStatusConfig(entity?.status);
  const activityCount = activity?.length || 0;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
      <div
        className={`
          flex w-full flex-col overflow-hidden bg-white
          transition-all duration-300 ease-out
          ${
            isMobile
              ? "h-[100dvh] rounded-none animate-slideUp"
              : `rounded-t-[28px] sm:rounded-2xl shadow-[0_-20px_80px_rgba(15,23,42,0.28)] 
               ${isFullscreen ? "h-[100vh] sm:h-[92vh]" : "h-[96vh] sm:h-[92vh]"} 
               sm:max-w-6xl`
          }
        `}
      >
        {/* HEADER */}
        {isMobile ? (
          <MobileHeader
            entity={entity}
            onClose={onClose}
            statusConfig={statusConfig}
            listName={listName}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            optionsRef={optionsRef}
          />
        ) : (
          <DesktopHeader
            entity={entity}
            onClose={onClose}
            statusConfig={statusConfig}
            workspace={workspace}
            folderName={folderName}
            listName={listName}
          />
        )}

        {/* MOBILE: Tabs */}
        {isMobile && (
          <MobileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activityCount={activityCount}
          />
        )}

        {/* BODY */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
          {/* Task Editor */}
          <div
            className={`
              flex-1 flex flex-col overflow-hidden
              ${isMobile && activeTab !== "details" ? "hidden" : "flex"}
            `}
          >
            <TaskEditor
              form={form}
              updateField={updateField}
              saveTask={saveTask}
              entity={entity}
              openPanel={openPanel}
              handleOpen={handleOpen}
              popoverStyle={popoverStyle}
              closeSubModal={closeSubModal}
              workspaceId={workspace?._id || ""}
              refetchTasks={refetchTasks}
              listId={listName?._id || ""}
              isMobile={isMobile}
            />
          </div>

          {/* Activity */}
          <div
            className={`
              flex-1 flex flex-col
              ${
                isMobile
                  ? "border-t border-slate-200/50"
                  : "border-l border-slate-200/50"
              }
              ${isMobile && activeTab !== "activity" ? "hidden" : "flex"}
            `}
          >
            <TaskActivity
              activity={activity}
              commentText={commentText}
              setCommentText={setCommentText}
              addComment={addComment}
              loading={activityLoading}
              error={activityError}
              refetch={refetchActivity}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskDetailsModal);
