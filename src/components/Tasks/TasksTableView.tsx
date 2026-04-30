import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  Users,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

const TasksTableView = ({ tasks = [], onSelectTask }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (taskId) => {
    setExpanded((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-md">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-xs">
          <tr>
            <th className="text-left px-4 py-3">Task</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Priority</th>
            <th className="text-left px-4 py-3">Progress</th>
            <th className="text-left px-4 py-3">Start</th>
            <th className="text-left px-4 py-3">Due</th>
            <th className="text-left px-4 py-3">Employees</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task, index) => {
            const isOpen = expanded[task._id];
            const subTasks = task.subTasks || [];
            const assigneesCount = task.assignedTo?.length || 0;

            return (
              <>
                {/* MAIN TASK */}
                <tr
                  key={task._id}
                  className="border-t hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => onSelectTask(task)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {subTasks.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(task._id);
                          }}
                          className="mt-1"
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <div>
                        <div className="font-medium text-slate-800">
                          {task.title}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 capitalize text-slate-600">
                    {task.status}
                  </td>

                  <td className="px-4 py-3 capitalize text-slate-600">
                    {task.priority}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full">
                        <div
                          className="h-1.5 bg-blue-600 rounded-full"
                          style={{ width: `${30 * index}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {/* {task.progress || 0}% */}
                        {30 * index}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(task.startDate)}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(task.dueDate)}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <span>{assigneesCount}</span>
                      <Users className="ml-1 h-4 w-4 text-blue-600" />
                    </div>
                  </td>
                </tr>

                {/* SUBTASKS */}
                {isOpen &&
                  subTasks.map((sub) => (
                    <tr
                      key={sub._id}
                      className="bg-slate-50 border-t text-sm"
                      onClick={() => onSelectTask?.(task)}
                    >
                      <td className="px-4 py-2 pl-10">
                        <div className="flex items-center gap-2">
                          {sub.status === "done" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300" />
                          )}

                          <span
                            className={
                              sub.status === "done"
                                ? "line-through text-slate-400"
                                : "text-slate-700"
                            }
                          >
                            {sub.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-2 capitalize text-slate-500">
                        {sub.status}
                      </td>

                      <td className="px-4 py-2 text-slate-400">—</td>
                      <td className="px-4 py-2 text-slate-400">—</td>
                      <td className="px-4 py-2 text-slate-400">—</td>
                      <td className="px-4 py-2 text-slate-400">—</td>
                      <td className="px-4 py-2 text-slate-400">—</td>
                    </tr>
                  ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTableView;
