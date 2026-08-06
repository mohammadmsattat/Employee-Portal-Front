// TaskFilters.mobile.jsx
import { useState } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

const TaskFilters = ({ onChange }) => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    due: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* HEADER مع زر التوسيع */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <Filter className="h-4 w-4" />
          Filters
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

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

      {/* FILTERS - تظهر فقط عند التوسيع */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* STATUS */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DUE DATE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">Due date</label>
            <input
              type="date"
              value={filters.due}
              onChange={(e) => update("due", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;