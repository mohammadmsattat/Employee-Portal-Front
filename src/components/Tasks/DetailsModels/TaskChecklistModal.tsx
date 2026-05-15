import {
  X,
  Plus,
  Trash2,
  Check,
  Loader2,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  useAddChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useToggleChecklistItemMutation,
  useGetTaskByIdQuery,
} from "@/rtk/Tasks/tasksApi";

const TaskChecklistModal = ({
  isOpen,
  onClose,
  taskId,
  workspaceId,
  folderId,
  listId,
}) => {
  const [newItem, setNewItem] = useState("");

  // =========================
  // GET TASK
  // =========================

  const {
    data: taskResponse,
    isLoading,
    error,
    refetch,
  } = useGetTaskByIdQuery(
    {
      id: taskId,
      listId,
    },
    {
      skip: !taskId || !isOpen,
    },
  );

  const task = taskResponse?.data;

  const items = task?.checklist || [];

  // =========================
  // STATS
  // =========================

  const completed = items.filter((i) => i.isDone).length;

  const progress =
    items.length === 0
      ? 0
      : Math.round((completed / items.length) * 100);

  // =========================
  // MUTATIONS
  // =========================

  const [addChecklistItem, { isLoading: adding }] =
    useAddChecklistItemMutation();

  const [toggleChecklistItem] = useToggleChecklistItemMutation();

  const [deleteChecklistItem] = useDeleteChecklistItemMutation();

  if (!isOpen || !taskId) return null;

  // =========================
  // ADD
  // =========================

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      await addChecklistItem({
        listId,
        taskId,
        data: {
          title: newItem,
        },
      }).unwrap();

      setNewItem("");

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // TOGGLE
  // =========================

  const handleToggle = async (itemId) => {
    try {
      await toggleChecklistItem({
        listId,
        taskId,
        itemId,
      }).unwrap();

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (itemId) => {
    try {
      await deleteChecklistItem({
        listId,
        taskId,
        itemId,
      }).unwrap();

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/50 backdrop-blur-[4px] sm:items-center">
      <div className="w-full sm:max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative max-h-[90vh] overflow-hidden rounded-t-[32px] sm:rounded-[36px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
          {/* BACKGROUND DECOR */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-100 blur-3xl opacity-60" />

            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-100 blur-3xl opacity-50" />
          </div>

          {/* HEADER */}
          <div className="relative border-b border-slate-200/70 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <ListChecks className="h-4 w-4" />
              Task Checklist
            </div>

            {/* TITLE */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  {task?.title || "Checklist"}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  {completed} of {items.length} tasks completed
                </p>
              </div>

              {/* CLOSE */}
              <button
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:scale-105 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* PROGRESS */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Progress</span>

                <span className="text-blue-700">{progress}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="relative space-y-6 p-6">
            {/* ADD ITEM */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 backdrop-blur-sm">
              <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Add Checklist Item
              </label>

              <div className="flex gap-3">
                <input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem();
                    }
                  }}
                  placeholder="Write a checklist item..."
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

                <Button
                  onClick={handleAddItem}
                  disabled={adding}
                  className="h-12 w-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition hover:scale-105 hover:bg-blue-700"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* ITEMS */}
            <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
              {/* LOADING */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="mb-3 h-6 w-6 animate-spin text-blue-500" />

                  <p className="text-sm">Loading checklist...</p>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="rounded-3xl border border-red-100 bg-red-50 py-10 text-center text-sm font-medium text-red-500">
                  Failed to load checklist
                </div>
              )}

              {/* EMPTY */}
              {!isLoading && items.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                    <ListChecks className="h-6 w-6 text-blue-600" />
                  </div>

                  <p className="text-sm font-medium text-slate-600">
                    No checklist items yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add your first task to get started
                  </p>
                </div>
              )}

              {/* ITEMS */}
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className={`group relative overflow-hidden rounded-3xl border px-4 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg ${
                    item.isDone
                      ? "border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  {/* LEFT ACCENT */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${
                      item.isDone ? "bg-blue-500" : "bg-slate-200"
                    }`}
                  />

                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex min-w-0 items-center gap-4">
                      {/* TOGGLE */}
                      <button
                        onClick={() => handleToggle(item._id)}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          item.isDone
                            ? "border-blue-600 bg-blue-600 shadow-md shadow-blue-200"
                            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {item.isDone && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>

                      {/* TEXT */}
                      <div className="min-w-0">
                        <div
                          className={`truncate text-sm font-semibold ${
                            item.isDone
                              ? "text-slate-400 line-through"
                              : "text-slate-700"
                          }`}
                        >
                          {item.title}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          Item #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-2xl border border-red-100 bg-red-50 p-2 text-red-500 opacity-0 shadow-sm transition-all hover:scale-105 hover:bg-red-100 hover:text-red-700 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-slate-200/70 bg-slate-50/70 px-6 py-5">
            <div className="text-xs text-slate-400">
              Keep your workflow organized ✨
            </div>

            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-2xl border-slate-200 bg-white px-5"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskChecklistModal;