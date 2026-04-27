import { useStatusModal } from "@/hooks/Tasks/TaskMenuActions/useStatusModal ";
import { Task, TaskStatus } from "@/interfaces/tasks";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

const UpdateTaskStatusModal = ({
  task,
  isOpen,
  onClose,
  onCloseModal,
}: {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { status, setStatus, handleSave } =
    useStatusModal({ task, onClose ,onCloseModal });

  if (!isOpen) return null;

  return (
    <div className="flex flex-col w-full h-64">
      {/* HEADER */}
      <div className="border-b pb-2 mb-3">
        <h2 className="text-sm font-semibold text-slate-700">
          Update Status
        </h2>
        <p className="text-[11px] text-slate-400">
          Change task workflow state
        </p>
      </div>

      {/* CURRENT STATUS */}
      <div className="mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}
        >
          Current: {status}
        </span>
      </div>

      {/* SELECT */}
      <div className="flex-1">
        <label className="text-[11px] text-slate-500 mb-1 block">
          Select new status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full border rounded-md p-2 text-xs outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="mt-auto pt-3 border-t flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 text-xs py-2 rounded-md hover:bg-slate-200"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskStatusModal;