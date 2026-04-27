import { useDatesModal } from "@/hooks/Tasks/TaskMenuActions/useDatesModal";
import { Task } from "@/interfaces/tasks";

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateTaskDatesModal = ({ task, isOpen, onClose }: Props) => {
  const { dates, setDates, handleSave } = useDatesModal({
    task,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-64 w-full">
      {/* HEADER */}
      <div className="border-b pb-2 mb-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Task Dates
        </h2>
      </div>

      {/* INPUTS */}
      <div className="flex-1 space-y-3">
        <div>
          <label className="text-[11px] text-slate-500">
            Start Date
          </label>
          <input
            type="date"
            value={dates.startDate}
            onChange={(e) =>
              setDates((p) => ({
                ...p,
                startDate: e.target.value,
              }))
            }
            className="w-full border rounded-md p-2 text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-500">
            Due Date (Deadline)
          </label>
          <input
            type="date"
            value={dates.dueDate}
            onChange={(e) =>
              setDates((p) => ({
                ...p,
                dueDate: e.target.value,
              }))
            }
            className="w-full border rounded-md p-2 text-xs"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pt-2 border-t mt-3 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 text-xs py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskDatesModal;