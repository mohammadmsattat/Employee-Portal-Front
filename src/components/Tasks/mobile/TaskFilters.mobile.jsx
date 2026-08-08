import { useState } from "react";
import { X, Filter } from "lucide-react";

const TaskFiltersMobile = ({ onChange, onClose }) => {
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
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
          {isActive && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={clear}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close filters"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-3">
        {/* STATUS */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* ASSIGNED */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Assignee</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.assignedTo}
            onChange={(e) => update("assignedTo", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* DUE DATE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Due Date</label>
          <input
            type="date"
            value={filters.due}
            onChange={(e) => update("due", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* زر تطبيق الفلاتر */}
      <button
        onClick={onClose}
        className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default TaskFiltersMobile;