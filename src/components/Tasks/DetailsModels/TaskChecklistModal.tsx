import { useEffect, useMemo, useState } from "react";

import {
  X,
  Plus,
  Trash2,
  Check,
  Loader2,
  ListChecks,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  useAddChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useGetTaskByIdQuery,
  useToggleChecklistItemMutation,
} from "@/rtk/Tasks/tasksApi";

import {
  useAddSubTaskChecklistItemMutation,
  useDeleteSubTaskChecklistItemMutation,
  useGetSubTaskByIdQuery,
  useToggleSubTaskChecklistItemMutation,
} from "@/rtk/Tasks/subTasksApi";

type EntityType = "task" | "subtask";

interface TaskChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;

  entityType: EntityType;
  entityId: string | null;

  parentTaskId?: string | null;
  listId?: string | null;

  canEdit: boolean;
}

interface PendingAction {
  itemId: string | null;
  action: "toggle" | "delete" | null;
}

const TaskChecklistModal = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  parentTaskId = null,
  listId = null,
  canEdit,
}: TaskChecklistModalProps) => {
  const { toast } = useToast();

  const isSubTask = entityType === "subtask";

  const [newItem, setNewItem] = useState("");

  const [pendingAction, setPendingAction] = useState<PendingAction>({
    itemId: null,
    action: null,
  });

  /* =========================
     RESET STATE
  ========================= */

  useEffect(() => {
    setNewItem("");

    setPendingAction({
      itemId: null,
      action: null,
    });
  }, [entityId, entityType, isOpen]);

  /* =========================
     REQUIRED IDS
  ========================= */

  const configurationError = useMemo(() => {
    if (!entityId) {
      return "Entity ID is missing.";
    }

    if (isSubTask && !parentTaskId) {
      return "Parent task ID is missing.";
    }

    if (!isSubTask && !listId) {
      return "List ID is missing.";
    }

    return null;
  }, [entityId, isSubTask, parentTaskId, listId]);

  /* =========================
     GET TASK
  ========================= */

  const {
    data: taskResponse,
    isLoading: taskLoading,
    isFetching: taskFetching,
    error: taskError,
    refetch: refetchTask,
  } = useGetTaskByIdQuery(
    {
      id: entityId || "",
      listId: listId || "",
    },
    {
      skip: !isOpen || isSubTask || !entityId || !listId,
    },
  );

  /* =========================
     GET SUBTASK
  ========================= */

  const {
    data: subTaskResponse,
    isLoading: subTaskLoading,
    isFetching: subTaskFetching,
    error: subTaskError,
    refetch: refetchSubTask,
  } = useGetSubTaskByIdQuery(
    {
      taskId: parentTaskId || "",
      subTaskId: entityId || "",
    },
    {
      skip: !isOpen || !isSubTask || !entityId || !parentTaskId,
    },
  );

  /* =========================
     MUTATIONS: TASK
  ========================= */

  const [addTaskChecklistItem, { isLoading: addingTaskChecklistItem }] =
    useAddChecklistItemMutation();

  const [toggleTaskChecklistItem] = useToggleChecklistItemMutation();

  const [deleteTaskChecklistItem] = useDeleteChecklistItemMutation();

  /* =========================
     MUTATIONS: SUBTASK
  ========================= */

  const [addSubTaskChecklistItem, { isLoading: addingSubTaskChecklistItem }] =
    useAddSubTaskChecklistItemMutation();

  const [toggleSubTaskChecklistItem] = useToggleSubTaskChecklistItemMutation();

  const [deleteSubTaskChecklistItem] = useDeleteSubTaskChecklistItemMutation();

  /* =========================
     ACTIVE ENTITY
  ========================= */

  const entityResponse = isSubTask ? subTaskResponse : taskResponse;

  const entity = entityResponse?.data || null;

  const items = Array.isArray(entity?.checklist) ? entity.checklist : [];

  const isLoading = isSubTask ? subTaskLoading : taskLoading;

  const isFetching = isSubTask ? subTaskFetching : taskFetching;

  const queryError = isSubTask ? subTaskError : taskError;

  const isAdding = addingTaskChecklistItem || addingSubTaskChecklistItem;

  const isMutating = isAdding || Boolean(pendingAction.action);

  /* =========================
     STATS
  ========================= */

  const completed = items.filter((item) => item.isDone).length;

  const progress =
    items.length === 0 ? 0 : Math.round((completed / items.length) * 100);

  /* =========================
     REFETCH
  ========================= */

  const refetchEntity = async () => {
    if (configurationError) return;

    if (isSubTask) {
      await refetchSubTask();
      return;
    }

    await refetchTask();
  };

  /* =========================
     ERROR MESSAGE
  ========================= */

  const getErrorMessage = (error, fallback) => {
    return error?.data?.message || error?.error || error?.message || fallback;
  };

  /* =========================
     ADD ITEM
  ========================= */

  const handleAddItem = async () => {
    const title = newItem.trim();

    if (!title || !canEdit || configurationError || isMutating) {
      return;
    }

    try {
      if (isSubTask) {
        await addSubTaskChecklistItem({
          taskId: parentTaskId,
          subTaskId: entityId,
          data: {
            title,
          },
        }).unwrap();
      } else {
        await addTaskChecklistItem({
          listId,
          taskId: entityId,
          data: {
            title,
          },
        }).unwrap();
      }

      setNewItem("");

      await refetchEntity();
    } catch (error) {
      toast({
        title: "Add failed",
        description: getErrorMessage(error, "Could not add checklist item."),
        variant: "destructive",
      });
    }
  };

  /* =========================
     TOGGLE ITEM
  ========================= */

  const handleToggle = async (itemId) => {
    if (!itemId || !canEdit || configurationError || isMutating) {
      return;
    }

    try {
      setPendingAction({
        itemId,
        action: "toggle",
      });

      if (isSubTask) {
        await toggleSubTaskChecklistItem({
          taskId: parentTaskId,
          subTaskId: entityId,
          itemId,
        }).unwrap();
      } else {
        await toggleTaskChecklistItem({
          listId,
          taskId: entityId,
          itemId,
        }).unwrap();
      }

      await refetchEntity();
    } catch (error) {
      toast({
        title: "Update failed",
        description: getErrorMessage(error, "Could not update checklist item."),
        variant: "destructive",
      });
    } finally {
      setPendingAction({
        itemId: null,
        action: null,
      });
    }
  };

  /* =========================
     DELETE ITEM
  ========================= */

  const handleDelete = async (itemId) => {
    if (!itemId || !canEdit || configurationError || isMutating) {
      return;
    }

    try {
      setPendingAction({
        itemId,
        action: "delete",
      });

      if (isSubTask) {
        await deleteSubTaskChecklistItem({
          taskId: parentTaskId,
          subTaskId: entityId,
          itemId,
        }).unwrap();
      } else {
        await deleteTaskChecklistItem({
          listId,
          taskId: entityId,
          itemId,
        }).unwrap();
      }

      await refetchEntity();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: getErrorMessage(error, "Could not delete checklist item."),
        variant: "destructive",
      });
    } finally {
      setPendingAction({
        itemId: null,
        action: null,
      });
    }
  };

  if (!isOpen) return null;

  const modalLabel = isSubTask ? "Subtask Checklist" : "Task Checklist";

  const errorMessage =
    configurationError ||
    (queryError
      ? getErrorMessage(queryError, "Failed to load checklist.")
      : null);

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/50 backdrop-blur-[4px] sm:items-center">
      <div className="w-full animate-in fade-in zoom-in-95 duration-200 sm:max-w-2xl">
        <div className="relative max-h-[90vh] overflow-hidden rounded-t-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:rounded-[36px]">
          {/* BACKGROUND */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100 opacity-60 blur-3xl" />

            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-100 opacity-50 blur-3xl" />
          </div>

          {/* HEADER */}
          <div className="relative border-b border-slate-200/70 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <ListChecks className="h-4 w-4" />
              {modalLabel}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  {entity?.title || modalLabel}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  {completed} of {items.length} items completed
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:scale-105 hover:bg-slate-50 hover:text-slate-700"
                aria-label="Close checklist"
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
            {canEdit && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 backdrop-blur-sm">
                <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Add Checklist Item
                </label>

                <div className="flex gap-3">
                  <input
                    value={newItem}
                    disabled={isMutating || Boolean(configurationError)}
                    onChange={(event) => setNewItem(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !isMutating) {
                        handleAddItem();
                      }
                    }}
                    placeholder="Write a checklist item..."
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={
                      isMutating ||
                      !newItem.trim() ||
                      Boolean(configurationError)
                    }
                    className="h-12 w-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* ITEMS */}
            <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
              {(isLoading || isFetching) && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="mb-3 h-6 w-6 animate-spin text-blue-500" />

                  <p className="text-sm">Loading checklist...</p>
                </div>
              )}

              {!isLoading && !isFetching && errorMessage && (
                <div className="rounded-3xl border border-red-100 bg-red-50 px-4 py-10 text-center">
                  <p className="text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>

                  {!configurationError && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={refetchEntity}
                      className="mt-4 rounded-xl"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                </div>
              )}

              {!isLoading &&
                !isFetching &&
                !errorMessage &&
                items.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                      <ListChecks className="h-6 w-6 text-blue-600" />
                    </div>

                    <p className="text-sm font-medium text-slate-600">
                      No checklist items yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {canEdit
                        ? "Add your first item to get started"
                        : "This checklist is empty"}
                    </p>
                  </div>
                )}

              {!isLoading &&
                !isFetching &&
                !errorMessage &&
                items.map((item, index) => {
                  const isPending = pendingAction.itemId === item._id;

                  const isToggling =
                    isPending && pendingAction.action === "toggle";

                  const isDeleting =
                    isPending && pendingAction.action === "delete";

                  return (
                    <div
                      key={item._id}
                      className={`group relative overflow-hidden rounded-3xl border px-4 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg ${
                        item.isDone
                          ? "border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${
                          item.isDone ? "bg-blue-500" : "bg-slate-200"
                        }`}
                      />

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <button
                            type="button"
                            disabled={!canEdit || isMutating}
                            onClick={() => handleToggle(item._id)}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 disabled:cursor-default ${
                              item.isDone
                                ? "border-blue-600 bg-blue-600 shadow-md shadow-blue-200"
                                : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                            }`}
                            aria-label={
                              item.isDone
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                          >
                            {isToggling ? (
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            ) : (
                              item.isDone && (
                                <Check className="h-4 w-4 text-white" />
                              )
                            )}
                          </button>

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

                        {canEdit && (
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() => handleDelete(item._id)}
                            className="rounded-2xl border border-red-100 bg-red-50 p-2 text-red-500 opacity-0 shadow-sm transition-all hover:scale-105 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-100"
                            aria-label="Delete checklist item"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-slate-200/70 bg-slate-50/70 px-6 py-5">
            <div className="text-xs text-slate-400">
              Keep your workflow organized ✨
            </div>

            <Button
              type="button"
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
