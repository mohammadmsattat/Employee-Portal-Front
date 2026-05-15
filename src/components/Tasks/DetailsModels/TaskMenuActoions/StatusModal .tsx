import { useStatusModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useStatusModal ";
import { Task, TaskStatus } from "@/interfaces/tasks";
import { X } from "lucide-react";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

const UpdateTaskStatusModal = ({ entity, isOpen, onClose, workspaceId,refetchTasks ,listId }) => {
  const { status, setStatus, handleSave } = useStatusModal({
    entity,
    onClose,
    workspaceId,
    listId,
    refetchTasks,
  });

  if (!isOpen) return null;

  return (
    <div className="w-[320px] bg-white border rounded-2xl shadow-xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Update Status</h2>

        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CURRENT */}
      <div className="mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>

      {/* SELECT */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="w-full border rounded-md p-2 text-xs"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

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

export default UpdateTaskStatusModal;
