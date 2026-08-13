import { useDatesModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useDatesModal";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

const UpdateTaskDatesModal = ({
  entity,
  isOpen,
  onClose,
  workspaceId,
  listId,
  refetchTasks,
}) => {
  const { dates, setDates, handleSave } = useDatesModal({
    entity,
    onClose,
    workspaceId,
    listId,
    refetchTasks,
  });

  if (!isOpen || !entity) return null;

  return (
    <div
      className="
        relative
        bg-white
        border border-slate-200
        rounded-2xl
        shadow-xl
        overflow-hidden
        w-[calc(100vw-24px)]
        max-w-[320px]
        sm:w-[320px]
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          px-4
          pt-4
          pb-3
          bg-white
          border-b
          border-slate-100
        "
      >
        <h2 className="text-sm font-semibold text-slate-800">
          Task Dates
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-lg
            text-slate-500
            hover:bg-slate-100
            hover:text-slate-700
            transition-all
          "
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="space-y-4">
          {/* START DATE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Start Date
            </Label>

            <input
              type="date"
              value={dates.startDate || ""}
              onChange={(e) =>
                setDates((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                text-slate-700
                outline-none
                transition-all
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* DUE DATE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Due Date
            </Label>

            <input
              type="date"
              value={dates.dueDate || ""}
              onChange={(e) =>
                setDates((prev) => ({
                  ...prev,
                  dueDate: e.target.value,
                }))
              }
              className="
                w-full
                h-10
                px-3
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                text-slate-700
                outline-none
                transition-all
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="
          flex
          gap-2
          px-4
          py-3
          border-t
          border-slate-100
          bg-white
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            flex-1
            h-10
            rounded-xl
            bg-slate-100
            text-slate-700
            text-sm
            font-medium
            hover:bg-slate-200
            transition-all
            active:scale-[0.98]
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="
            flex-1
            h-10
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            font-medium
            hover:bg-blue-700
            transition-all
            active:scale-[0.98]
          "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskDatesModal;