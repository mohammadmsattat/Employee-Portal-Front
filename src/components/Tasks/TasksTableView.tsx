import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  Users,
  Plus,
  Pencil,
  ListChecks,
  Trash2,
  Eye,
} from "lucide-react";

import DeleteConfirmModal from "../DeleteConfirmModal";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString();
};

const TasksTableView = ({
  tasks = [],
  permissions,

  // ACTIONS
  onAddSubTask,
  onOpenEditModal,
  onOpenDetailsModal,
  onOpenChecklistModal,

  // DELETE
  onDeleteTask,
  onDeleteSubTask,
  toast,
}) => {
  const [expanded, setExpanded] = useState({});

  const [deleteState, setDeleteState] = useState({
    open: false,
    type: null,
    taskId: null,
    subTaskId: null,
    title: "",
  });

  const [deleteLoading, setDeleteLoading] = useState(false);

  const toggle = (taskId) => {
    setExpanded((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      if (deleteState.type === "task") {
        console.log("...");
        
        await onDeleteTask?.(deleteState.taskId);
      }

      if (deleteState.type === "subtask") {
        await onDeleteSubTask?.({
          taskId: deleteState.taskId,
          subTaskId: deleteState.subTaskId,
        });
      }

      setDeleteState({
        open: false,
        type: null,
        taskId: null,
        subTaskId: null,
        title: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <>
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
                      className="group border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          {/* EXPAND */}
                          {subTasks.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                toggle(task._id);
                              }}
                              className="mt-1 shrink-0"
                            >
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </button>
                          )}

                          {/* TITLE + ACTIONS */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">
                                {task.title}
                              </span>

                              {/* HOVER ACTIONS */}
                              <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                                {/* ADD SUBTASK */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (!permissions?.canUpdateTask) return;

                                    onAddSubTask?.(task);
                                  }}
                                  className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>

                                {/* EDIT */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    onOpenEditModal?.({
                                      type: "task",
                                      data: task,
                                    });
                                  }}
                                  className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-amber-600 transition"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>

                                {/* CHECKLIST */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    onOpenChecklistModal?.(task);
                                  }}
                                  className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-indigo-600 transition"
                                >
                                  <ListChecks className="h-4 w-4" />
                                </button>

                                {/* DETAILS */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    onOpenDetailsModal?.(task);
                                  }}
                                  className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-emerald-600 transition"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                {/* DELETE */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (task.subTasks?.length > 0) {
                                      toast({
                                        title: "Cannot delete task",
                                        description:
                                          "You must delete all subtasks first.",
                                        variant: "destructive",
                                      });

                                      return;
                                    }

                                    setDeleteState({
                                      open: true,
                                      type: "task",
                                      taskId: task._id,
                                      subTaskId: null,
                                      title: task.title,
                                    });
                                  }}
                                  className="p-1 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600 transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3 capitalize text-slate-600">
                        {task.status}
                      </td>

                      {/* PRIORITY */}
                      <td className="px-4 py-3 capitalize text-slate-600">
                        {task.priority}
                      </td>

                      {/* PROGRESS */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{
                                width: `${30 * index}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs text-slate-500">
                            {30 * index}%
                          </span>
                        </div>
                      </td>

                      {/* START */}
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(task.startDate)}
                      </td>

                      {/* DUE */}
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(task.dueDate)}
                      </td>

                      {/* EMPLOYEES */}
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
                          className="group bg-slate-50 border-t text-sm hover:bg-slate-100 transition"
                        >
                          <td className="px-4 py-2 pl-10">
                            <div className="flex items-center gap-2">
                              {sub.status === "done" ? (
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-300" />
                              )}

                              {/* TITLE + ACTIONS */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={
                                    sub.status === "done"
                                      ? "line-through text-slate-400"
                                      : "text-slate-700"
                                  }
                                >
                                  {sub.title}
                                </span>

                                {/* HOVER ACTIONS */}
                                <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                                  {/* EDIT */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      onOpenEditModal?.({
                                        type: "subtask",
                                        data: sub,
                                        parentTaskId: task._id,
                                      });
                                    }}
                                    className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>

                                  {/* CHECKLIST */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      onOpenChecklistModal?.(task);
                                    }}
                                    className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-indigo-600 transition"
                                  >
                                    <ListChecks className="h-4 w-4" />
                                  </button>

                                  {/* DELETE */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      setDeleteState({
                                        open: true,
                                        type: "subtask",
                                        taskId: task._id,
                                        subTaskId: sub._id,
                                        title: sub.title,
                                      });
                                    }}
                                    className="p-1 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600 transition"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-2 capitalize text-slate-500">
                            {sub.status}
                          </td>

                          <td className="px-4 py-2 capitalize text-slate-500">
                            {sub.priority || "—"}
                          </td>

                          <td className="px-4 py-2 text-slate-400">—</td>

                          <td className="px-4 py-2 text-slate-500">
                            {formatDate(sub.startDate)}
                          </td>

                          <td className="px-4 py-2 text-slate-500">
                            {formatDate(sub.dueDate)}
                          </td>

                          <td className="px-4 py-2 text-slate-500">
                            {sub.assignedTo?.length || 0}
                          </td>
                        </tr>
                      ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DELETE MODAL */}
        <DeleteConfirmModal
          isOpen={deleteState.open}
          loading={deleteLoading}
          title={`Delete ${deleteState.type}`}
          description={`Are you sure you want to delete "${deleteState.title}"? This action cannot be undone.`}
          onClose={() =>
            setDeleteState({
              open: false,
              type: null,
              taskId: null,
              subTaskId: null,
              title: "",
            })
          }
          onConfirm={handleDelete}
        />
      </>
    </div>
  );
};

export default TasksTableView;
