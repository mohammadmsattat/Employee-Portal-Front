import { CalendarDays, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useDatesModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useDatesModal";

const UpdateTaskDatesModal = ({
  entity,
  isOpen,
  onClose,
  workspaceId,
  listId,
  refetchTasks,
}) => {
  const { dates, setDates, handleSave, isSaving } = useDatesModal({
    entity,
    isOpen,
    onClose,
    listId,
    refetchTasks,
  });

  const data = entity?.data || entity;

  const isSubTask =
    entity?.type === "subtask" || Boolean(data?.task || data?.parentTaskId);

  if (!isOpen || !data?._id) {
    return null;
  }

  return (
    <div
      className="
        relative
        w-[calc(100vw-24px)]
        max-w-[320px]
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-xl
        sm:w-[320px]
      "
    >
      {/* HEADER */}
      <div
        className="
          flex items-center justify-between
          border-b border-slate-100
          bg-white px-4 pb-3 pt-4
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />

            <h2 className="text-sm font-semibold text-slate-800">
              {isSubTask ? "Subtask Dates" : "Task Dates"}
            </h2>
          </div>

          {data.title && (
            <p className="mt-1 max-w-[220px] truncate text-[11px] text-slate-400">
              {data.title}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          aria-label="Close dates modal"
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg text-slate-500
            transition-all
            hover:bg-slate-100 hover:text-slate-700
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="space-y-4">
          {/* START DATE */}
          <div className="space-y-2">
            <Label
              htmlFor="task-start-date"
              className="text-sm font-medium text-slate-700"
            >
              Start Date
            </Label>

            <input
              id="task-start-date"
              type="date"
              disabled={isSaving}
              value={dates.startDate}
              onChange={(event) => {
                setDates((previous) => ({
                  ...previous,
                  startDate: event.target.value,
                }));
              }}
              className="
                h-10 w-full rounded-xl
                border border-slate-200
                bg-white px-3
                text-sm text-slate-700
                outline-none transition-all
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
                disabled:opacity-60
              "
            />
          </div>

          {/* DUE DATE */}
          <div className="space-y-2">
            <Label
              htmlFor="task-due-date"
              className="text-sm font-medium text-slate-700"
            >
              Due Date
            </Label>

            <input
              id="task-due-date"
              type="date"
              disabled={isSaving}
              min={dates.startDate || undefined}
              value={dates.dueDate}
              onChange={(event) => {
                setDates((previous) => ({
                  ...previous,
                  dueDate: event.target.value,
                }));
              }}
              className="
                h-10 w-full rounded-xl
                border border-slate-200
                bg-white px-3
                text-sm text-slate-700
                outline-none transition-all
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
                disabled:opacity-60
              "
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="
          flex gap-2
          border-t border-slate-100
          bg-white px-4 py-3
        "
      >
        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          className="
            h-10 flex-1 rounded-xl
            bg-slate-100
            text-sm font-medium text-slate-700
            transition-all
            hover:bg-slate-200
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="
            h-10 flex-1 rounded-xl
            bg-blue-600
            text-sm font-medium text-white
            transition-all
            hover:bg-blue-700
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskDatesModal;
