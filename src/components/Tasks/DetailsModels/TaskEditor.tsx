import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import {
  AlignLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  Flag,
  ListChecks,
  Save,
  Users,
  X as XIcon,
  type LucideIcon,
} from "lucide-react";

import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskTimeLogModal from "./TaskMenuActoions/TimeLogModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";
import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";

type EntityType = "task" | "subtask";

interface EditorForm {
  title?: string;
  description?: string;
}

interface TaskEditorProps {
  form: EditorForm;
  updateField: (key: string, value: unknown) => void;
  saveTask: () => void | Promise<void>;

  entity: any;
  entityType?: EntityType;

  openPanel: string | null;
  handleOpen: (event: MouseEvent<HTMLButtonElement>, panel: string) => void;
  popoverStyle: () => CSSProperties;
  closeSubModal: () => void;

  workspaceId: string;
  listId: string;
  refetchTasks?: () => unknown;
  canUpdateDates?: boolean;
  canEdit: boolean;
  isSaving?: boolean;
  saveError?: any;
  isMobile?: boolean;
}

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  mobileLabel: string;
  iconColor: string;
  isMobile: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface TitleEditorProps {
  value: string;
  setValue: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isMobile: boolean;
  isSaving: boolean;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
}

/* =========================
   HELPERS
========================= */

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatStatus = (status?: string) => {
  const statuses: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
    cancelled: "Cancelled",
  };

  return statuses[status || ""] || status?.replaceAll("_", " ") || "To Do";
};

const formatPriority = (priority?: string) => {
  if (!priority) return "Medium";

  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
};

const getStatusClasses = (status?: string) => {
  const classes: Record<string, string> = {
    todo: "border-slate-200 bg-slate-100 text-slate-700",
    in_progress: "border-blue-200 bg-blue-50 text-blue-700",
    review: "border-amber-200 bg-amber-50 text-amber-700",
    done: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    classes[status || ""] || "border-slate-200 bg-slate-100 text-slate-700"
  );
};

const getPriorityClasses = (priority?: string) => {
  const classes: Record<string, string> = {
    low: "border-slate-200 bg-slate-50 text-slate-600",
    medium: "border-blue-200 bg-blue-50 text-blue-700",
    high: "border-amber-200 bg-amber-50 text-amber-700",
    urgent: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    classes[priority || ""] || "border-slate-200 bg-slate-50 text-slate-600"
  );
};

const getActionButtonStyles = (isMobile: boolean) => {
  if (isMobile) {
    return `
      flex min-h-[40px] flex-1 items-center justify-center gap-2
      rounded-xl border border-slate-200/70 bg-white
      px-3 py-2 text-xs font-medium text-slate-700
      transition hover:border-slate-300 hover:bg-slate-50
      active:scale-95
    `;
  }

  return `
    flex items-center gap-2 rounded-2xl
    border border-slate-200/70 bg-white
    px-4 py-2.5 text-sm font-medium text-slate-700
    transition hover:border-slate-300 hover:bg-slate-50
    hover:shadow-sm
  `;
};

/* =========================
   SMALL COMPONENTS
========================= */

const ActionButton = memo(
  ({
    icon: Icon,
    label,
    mobileLabel,
    iconColor,
    isMobile,
    onClick,
  }: ActionButtonProps) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={getActionButtonStyles(isMobile)}
      >
        <Icon
          className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} ${iconColor}`}
        />

        <span>{isMobile ? mobileLabel : label}</span>
      </button>
    );
  },
);

ActionButton.displayName = "ActionButton";

const DetailItem = memo(
  ({
    label,
    value,
    icon: Icon,
    iconClassName = "text-slate-500",
  }: DetailItemProps) => {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <Icon className={`h-3.5 w-3.5 ${iconClassName}`} />
          {label}
        </div>

        <div className="truncate text-sm font-semibold text-slate-700">
          {value}
        </div>
      </div>
    );
  },
);

DetailItem.displayName = "DetailItem";

const TitleEditor = memo(
  ({
    value,
    setValue,
    onSave,
    onCancel,
    isMobile,
    isSaving,
  }: TitleEditorProps) => {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          disabled={isSaving}
          placeholder="Enter task title..."
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSave();
            }

            if (event.key === "Escape") {
              onCancel();
            }
          }}
          className={`
            flex-1 rounded-xl border-2 border-blue-300 bg-white
            font-semibold outline-none transition
            focus:ring-4 focus:ring-blue-100
            disabled:cursor-not-allowed disabled:opacity-60
            ${isMobile ? "px-3.5 py-2.5 text-base" : "px-4 py-2.5 text-lg"}
          `}
        />

        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className={`
            flex items-center justify-center rounded-xl
            bg-blue-600 text-white transition hover:bg-blue-700
            disabled:cursor-not-allowed disabled:opacity-60
            ${isMobile ? "h-10 w-10" : "h-11 w-11"}
          `}
        >
          <Check className="h-5 w-5" />
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className={`
            flex items-center justify-center rounded-xl
            bg-slate-100 text-slate-600 transition hover:bg-slate-200
            disabled:cursor-not-allowed disabled:opacity-60
            ${isMobile ? "h-10 w-10" : "h-11 w-11"}
          `}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    );
  },
);

TitleEditor.displayName = "TitleEditor";

/* =========================
   MAIN COMPONENT
========================= */

function TaskEditor({
  form,
  updateField,
  saveTask,

  entity,
  entityType = "task",

  openPanel,
  handleOpen,
  popoverStyle,
  closeSubModal,

  workspaceId,
  listId,
  refetchTasks,
  canUpdateDates = false,

  canEdit = false,
  isSaving = false,
  saveError = null,
  isMobile = false,
}: TaskEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [temporaryTitle, setTemporaryTitle] = useState(form?.title || "");

  useEffect(() => {
    setTemporaryTitle(form?.title || "");
    setEditingTitle(false);
  }, [entity?._id, form?.title]);

  const assignedMembers = useMemo(() => {
    if (!Array.isArray(entity?.assignedTo)) {
      return [];
    }

    return entity.assignedTo;
  }, [entity?.assignedTo]);

  const checklist = Array.isArray(entity?.checklist) ? entity.checklist : [];

  const subTasks = Array.isArray(entity?.subTasks) ? entity.subTasks : [];

  const completedChecklistCount = checklist.filter(
    (item) => item?.isDone,
  ).length;

  const completedSubTasksCount = subTasks.filter(
    (subTask) => subTask?.status === "done",
  ).length;

  const progress = useMemo(() => {
    if (typeof entity?.progress === "number") {
      return Math.max(0, Math.min(100, entity.progress));
    }

    if (subTasks.length > 0) {
      return Math.round((completedSubTasksCount / subTasks.length) * 100);
    }

    return entity?.status === "done" ? 100 : 0;
  }, [
    entity?.progress,
    entity?.status,
    subTasks.length,
    completedSubTasksCount,
  ]);

  const assignedMembersText = useMemo(() => {
    if (assignedMembers.length === 0) {
      return "No members";
    }

    const names = assignedMembers
      .map((member) => {
        if (typeof member === "string") {
          return "Member";
        }

        return member?.fullName || member?.email || "Member";
      })
      .filter(Boolean);

    if (names.length <= 2) {
      return names.join(", ");
    }

    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  }, [assignedMembers]);

  const normalizedSaveError =
    typeof saveError === "string"
      ? saveError
      : saveError?.data?.message || saveError?.message || null;

  const saveTemporaryTitle = useCallback(() => {
    if (!canEdit || isSaving) return;

    const title = temporaryTitle.trim();

    if (!title) return;

    updateField("title", title);
    setEditingTitle(false);
  }, [canEdit, isSaving, temporaryTitle, updateField]);

  const cancelTitleEditing = useCallback(() => {
    setTemporaryTitle(form?.title || "");
    setEditingTitle(false);
  }, [form?.title]);

  const startTitleEditing = useCallback(() => {
    if (!canEdit || isSaving) return;

    setTemporaryTitle(form?.title || "");
    setEditingTitle(true);
  }, [canEdit, isSaving, form?.title]);

  const updateDescription = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!canEdit || isSaving) return;

      updateField("description", event.target.value);
    },
    [canEdit, isSaving, updateField],
  );

  return (
    <div
      className={`
        flex flex-1 flex-col overflow-hidden
        ${isMobile ? "bg-white" : "bg-slate-50/40"}
      `}
    >
      <div className="flex-1 overflow-y-auto">
        {/* TITLE */}
        <section
          className={`
            border-b border-slate-200/60
            ${isMobile ? "bg-white px-4 py-4" : "px-6 py-5"}
          `}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
              {entityType === "subtask" ? "Subtask" : "Task"}
            </span>

            <span className="text-xs text-slate-400">
              {entity?.code || entity?._id?.slice(-6)}
            </span>
          </div>

          {editingTitle && canEdit ? (
            <TitleEditor
              value={temporaryTitle}
              setValue={setTemporaryTitle}
              onSave={saveTemporaryTitle}
              onCancel={cancelTitleEditing}
              isMobile={isMobile}
              isSaving={isSaving}
            />
          ) : (
            <div
              onClick={canEdit ? startTitleEditing : undefined}
              className={`
                group flex items-start gap-2
                ${canEdit ? "cursor-pointer" : "cursor-default"}
              `}
            >
              <h2
                className={`
                  flex-1 font-semibold text-slate-800
                  ${isMobile ? "text-lg" : "text-xl"}
                `}
              >
                {form?.title || entity?.title || "Untitled Task"}
              </h2>

              {canEdit && (
                <div className="rounded-lg bg-slate-100 p-1.5 opacity-0 transition group-hover:bg-slate-200 group-hover:opacity-100">
                  <Edit2 className="h-4 w-4 text-slate-500" />
                </div>
              )}
            </div>
          )}
        </section>

        {/* INFORMATION */}

        {/* ACTIONS */}
        <section
          className={`
            border-b border-slate-200/60 bg-white/50
            ${isMobile ? "px-3 py-3" : "px-6 py-4"}
          `}
        >
          <div
            className={`
              flex gap-2
              ${isMobile ? "min-w-max flex-nowrap overflow-x-auto" : "flex-wrap"}
            `}
          >
            {canEdit && (
              <>
                {/* STATUS */}
                <div className="relative">
                  <ActionButton
                    isMobile={isMobile}
                    icon={ArrowRight}
                    label="Status"
                    mobileLabel="Status"
                    iconColor="text-blue-500"
                    onClick={(event) => handleOpen(event, "status")}
                  />

                  {openPanel === "status" && (
                    <div style={popoverStyle()}>
                      <UpdateTaskStatusModal
                        entity={entity}
                        isOpen
                        onClose={closeSubModal}
                        workspaceId={workspaceId}
                        listId={listId}
                        refetchTasks={refetchTasks}
                      />
                    </div>
                  )}
                </div>

                {/* MEMBERS */}
                <div className="relative">
                  <ActionButton
                    isMobile={isMobile}
                    icon={Users}
                    label="Members"
                    mobileLabel="Team"
                    iconColor="text-indigo-500"
                    onClick={(event) => handleOpen(event, "members")}
                  />

                  {openPanel === "members" && (
                    <div
                      style={{
                        ...popoverStyle(),
                        overflow: "visible",
                      }}
                    >
                      <UpdateTaskMembersModal
                        entity={entity}
                        isOpen
                        onClose={closeSubModal}
                        workspaceId={workspaceId}
                        listId={listId}
                        refetchTasks={refetchTasks}
                      />
                    </div>
                  )}
                </div>

                {/* DATES */}
                {/* DATES — Manager / Owner only */}
                {canUpdateDates && (
                  <div className="relative">
                    <ActionButton
                      isMobile={isMobile}
                      icon={CalendarDays}
                      label="Dates"
                      mobileLabel="Dates"
                      iconColor="text-emerald-500"
                      onClick={(event) => handleOpen(event, "dates")}
                    />

                    {openPanel === "dates" && (
                      <div
                        style={{
                          ...popoverStyle(),

                          ...(isMobile
                            ? {
                                left: "auto",
                                right: 0,
                                transform: "none",
                                width: "max-content",
                                maxWidth: "calc(100vw - 24px)",
                              }
                            : {}),
                        }}
                      >
                        <UpdateTaskDatesModal
                          entity={entity}
                          isOpen
                          onClose={closeSubModal}
                          workspaceId={workspaceId}
                          listId={listId}
                          refetchTasks={refetchTasks}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* TIME */}
            {canEdit && (
              <div className="relative">
                <ActionButton
                  isMobile={isMobile}
                  icon={Clock}
                  label="Time"
                  mobileLabel="Time"
                  iconColor="text-amber-500"
                  onClick={(event) => handleOpen(event, "time")}
                />

                {openPanel === "time" && (
                  <div
                    style={{
                      ...popoverStyle(),
                      overflow: "visible",

                      ...(isMobile
                        ? {
                            left: "auto",
                            right: 0,
                            transform: "none",
                            width: "max-content",
                            maxWidth: "calc(100vw - 24px)",
                          }
                        : {}),
                    }}
                  >
                    <UpdateTaskTimeLogModal
                      entity={entity}
                      isOpen
                      onClose={closeSubModal}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className={isMobile ? "p-3" : "p-6"}>
          <div className="mb-2.5 flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-slate-400" />

            <span className="text-xs font-medium text-slate-500">
              Description
            </span>

            <span className="ml-auto text-[10px] text-slate-400">
              {(form?.description || "").length} characters
            </span>
          </div>

          <textarea
            value={form?.description || ""}
            readOnly={!canEdit}
            disabled={isSaving}
            onChange={updateDescription}
            placeholder={
              canEdit ? "Write a detailed description..." : "No description"
            }
            className={`
              min-h-[150px] w-full resize-none rounded-2xl
              border border-slate-200/70 p-4 text-sm
              outline-none transition
              placeholder:text-slate-400
              ${
                canEdit
                  ? "bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  : "cursor-default bg-slate-50"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          />

          {/* EXTRA DATA */}
          <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-100/70 p-3">
              Created by:{" "}
              <span className="font-medium text-slate-700">
                {entity?.createdBy?.fullName ||
                  entity?.createdBy?.email ||
                  "Unknown"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-100/70 p-3">
              Created:{" "}
              <span className="font-medium text-slate-700">
                {formatDate(entity?.createdAt)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* SAVE */}
      {canEdit && (
        <section
          className={`
            shrink-0 border-t border-slate-200/60 bg-white/95
            backdrop-blur-sm
            ${isMobile ? "px-4 py-3" : "p-5"}
          `}
        >
          {normalizedSaveError && (
            <p className="mb-3 text-sm text-red-600">{normalizedSaveError}</p>
          )}

          <div className={isMobile ? "" : "flex justify-end"}>
            <button
              type="button"
              disabled={isSaving}
              onClick={saveTask}
              className={`
                flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-600 to-blue-700
                text-sm font-medium text-white shadow-md
                transition
                hover:from-blue-700 hover:to-blue-800
                hover:shadow-lg active:scale-95
                disabled:cursor-not-allowed disabled:opacity-60
                ${
                  isMobile
                    ? "w-full rounded-xl px-4 py-3"
                    : "rounded-2xl px-8 py-2.5"
                }
              `}
            >
              <Save className="h-4 w-4" />

              {isSaving ? "Saving..." : isMobile ? "Save" : "Save Changes"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default memo(TaskEditor);
