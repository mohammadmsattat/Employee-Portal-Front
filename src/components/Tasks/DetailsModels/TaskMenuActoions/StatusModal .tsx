import { useStatusModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useStatusModal ";
import { Task, TaskStatus } from "@/interfaces/tasks";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

const UpdateTaskStatusModal = ({
  entity,
  isOpen,
  onClose,
  workspaceId,
  refetchTasks,
  listId,
}) => {
  const { status, setStatus, handleSave, isSaving } = useStatusModal({
    entity,
    onClose,
    listId,
    refetchTasks,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`
      bg-white border rounded-2xl shadow-xl p-4
      ${isMobile ? "w-[280px]" : "w-[320px]"}
    `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-semibold ${isMobile ? "text-sm" : "text-sm"}`}>
          Update Status
        </h2>

        <button onClick={onClose} className={isMobile ? "p-1" : ""}>
          <X className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
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
        disabled={isSaving}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className={`
          w-full border rounded-md text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300
          ${isMobile ? "p-3" : "p-2"}
        `}
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      {/* ACTIONS */}
      <div className={`mt-4 flex gap-2 ${isMobile ? "flex-col" : "flex-row"}`}>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className={`
    bg-blue-600 text-white rounded-md font-medium
    hover:bg-blue-700 transition active:scale-[0.98]
    disabled:cursor-not-allowed disabled:opacity-60
    ${isMobile ? "py-3 text-sm" : "flex-1 py-2 text-xs"}
  `}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onClose}
          className={`
            bg-slate-100 text-slate-700 rounded-md font-medium
            hover:bg-slate-200 transition active:scale-[0.98]
            ${isMobile ? "py-3 text-sm" : "flex-1 py-2 text-xs"}
          `}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskStatusModal;
