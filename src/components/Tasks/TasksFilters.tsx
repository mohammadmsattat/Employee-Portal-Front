import { Search } from "lucide-react";

const TasksFilters = () => {
  return (
    <div className="rounded-[24px] border bg-white p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            placeholder="Search tasks..."
            className="h-11 w-full rounded-2xl border pl-9"
          />
        </div>

        <select className="h-11 rounded-2xl border px-3">
          <option>Status</option>
          <option>todo</option>
          <option>in_progress</option>
          <option>done</option>
        </select>

        <select className="h-11 rounded-2xl border px-3">
          <option>Priority</option>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>

        <input type="date" className="h-11 rounded-2xl border px-3" />
      </div>
    </div>
  );
};

export default TasksFilters;