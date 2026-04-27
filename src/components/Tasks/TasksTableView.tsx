import { useState } from "react";
import { ChevronDown, ChevronRight, Circle, CheckCircle2 } from "lucide-react";

const TasksTableView = ({ tasks = [] }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (taskId) => {
    setExpanded((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border overflow-hidden ">
      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-slate-50 text-slate-600 text-xs">
          <tr>
            <th className="text-left px-4 py-3">Task</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Priority</th>
            <th className="text-left px-4 py-3">Progress</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => {
            const isOpen = expanded[task._id];
            const subTasks = task.subTasks || [];

            return (
              <>
                {/* MAIN TASK */}
                <tr
                  key={task._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">

                      {/* expand icon */}
                      {subTasks.length > 0 && (
                        <button onClick={() => toggle(task._id)}>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      <span className="font-medium text-slate-800">
                        {task.title}
                      </span>
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
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {task.progress || 0}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* SUBTASKS */}
                {isOpen &&
                  subTasks.map((sub) => (
                    <tr
                      key={sub._id}
                      className="bg-slate-50 border-t text-sm"
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

                      <td className="px-4 py-2 text-slate-400">
                        —
                      </td>

                      <td className="px-4 py-2 text-slate-400">
                        —
                      </td>
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