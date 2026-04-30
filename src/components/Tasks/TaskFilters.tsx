import { useState } from "react";
import { X } from "lucide-react";

const TaskFilters = ({ onChange }) => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    due: "",
  });

  const update = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange?.(newFilters);
  };

  const clear = () => {
    const empty = {
      status: "",
      priority: "",
      assignedTo: "",
      due: "",
    };
    setFilters(empty);
    onChange?.(empty);
  };

  const isActive = Object.values(filters).some((v) => v);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      {/* 🔹 HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Filters</h3>

        {isActive && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* 🔹 FILTER ROW */}
      <div className="flex flex-wrap gap-3">
        {/* STATUS */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Status</label>
          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* ASSIGNED */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Assignee</label>
          <input
            type="text"
            placeholder="User Name"
            value={filters.assignedTo}
            onChange={(e) => update("assignedTo", e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DUE DATE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Due date</label>
          <input
            type="date"
            value={filters.due}
            onChange={(e) => update("due", e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

/* 🔹 SMALL TAG COMPONENT */
const Tag = ({ label, onRemove }) => (
  <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
    {label}
    <button onClick={onRemove}>
      <X className="h-3 w-3" />
    </button>
  </div>
);

export default TaskFilters;
