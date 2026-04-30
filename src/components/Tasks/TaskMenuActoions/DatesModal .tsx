import { useDatesModal } from "@/hooks/Tasks/TaskMenuActions/useDatesModal";
import { Task } from "@/interfaces/tasks";
import { X } from "lucide-react";

const UpdateTaskDatesModal = ({ task, isOpen, onClose }: {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { dates, setDates, handleSave } = useDatesModal({
    task,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="w-[320px] bg-white border rounded-2xl shadow-xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Task Dates</h2>

        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* INPUTS */}
      <div className="space-y-3">
        <input
          type="date"
          value={dates.startDate}
          onChange={(e) =>
            setDates((p) => ({ ...p, startDate: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />

        <input
          type="date"
          value={dates.dueDate}
          onChange={(e) =>
            setDates((p) => ({ ...p, dueDate: e.target.value }))
          }
          className="w-full border rounded-md p-2 text-xs"
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 text-xs rounded-md"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 py-2 text-xs rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskDatesModal;