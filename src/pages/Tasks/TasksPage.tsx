import { useEffect, useMemo, useState } from "react";

import Layout from "@/components/layout/Layout";
import TasksTableView from "@/components/Tasks/TasksTableView";
import TaskFilters from "@/components/Tasks/TaskFilters";

import { useGetAllTasksQuery } from "@/rtk/Tasks/tasksApi";
import { useGetWorkspaceTreeQuery } from "@/rtk/Tasks/workspaceApi";

import AddTaskModal from "@/components/Tasks/CreateModels/AddTaskModal";
import TaskDetailsModal from "@/components/Tasks/DetailsModels/TaskDetailsModal";

import { Button } from "@/components/ui/button";

import FolderSidebar from "@/components/Tasks/FolderSidebar";

import {
  AlertTriangle,
  Inbox,
  WifiOff,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { hasPermission } from "@/lib/permissions";
import AddSubTaskModal from "@/components/Tasks/CreateModels/AddSubTaskModal";
import TaskChecklistModal from "@/components/Tasks/DetailsModels/TaskChecklistModal";
import GlobalTaskTimer from "@/components/Tasks/GlobalTaskTimer";

import { useDeleteTaskMutation } from "@/rtk/Tasks/tasksApi";

import { useToast } from "@/hooks/use-toast";
import { useDeleteSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

/* =========================
   SKELETONS
========================= */

const SidebarSkeleton = () => (
  <div className="w-[260px] shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-4 h-8 w-32 animate-pulse rounded-xl bg-slate-200" />

    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex flex-wrap gap-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-10 w-32 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    {/* HEADER */}
    <div className="border-b border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-10 w-28 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>

    {/* ROWS */}
    <div className="space-y-3 p-4">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />

            <div className="space-y-2">
              <div className="h-4 w-56 animate-pulse rounded-lg bg-slate-200" />

              <div className="h-3 w-32 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>

          <div className="flex gap-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-9 w-9 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* =========================
   STATES
========================= */

const EmptyState = ({ text }) => (
  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-slate-400">
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
      <Inbox className="h-10 w-10" />
    </div>

    <p className="text-sm font-medium">{text}</p>
  </div>
);

const ErrorState = ({
  text,
  onRetry,
  loading,
}: {
  text: string;
  onRetry?: () => void;
  loading?: boolean;
}) => (
  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white px-6 text-center">
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
      <WifiOff className="h-10 w-10 text-red-500" />
    </div>

    <h3 className="text-base font-semibold text-slate-800">
      Connection Problem
    </h3>

    <p className="mt-2 max-w-sm text-sm text-slate-500">{text}</p>

    {onRetry && (
      <Button
        onClick={onRetry}
        disabled={loading}
        className="mt-5 rounded-2xl bg-blue-600 hover:bg-blue-700"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Retry
      </Button>
    )}
  </div>
);

/* =========================
   PAGE
========================= */

const TasksPage = () => {
  /* =========================
     MAIN STATE
  ========================= */

  const [selectedList, setSelectedList] = useState(null);

  const [selectedContext, setSelectedContext] = useState(null);

  const [filters, setFilters] = useState({});

  const [retrying, setRetrying] = useState(false);

  /* =========================
     MODALS STATE
  ========================= */

  const [openTaskModal, setOpenTaskModal] = useState(false);

  const [subTaskParent, setSubTaskParent] = useState(null);

  const [editTask, setEditTask] = useState(null);

  const [detailsTask, setDetailsTask] = useState(null);

  const [checklistTask, setChecklistTask] = useState(null);

  const { toast } = useToast();

  const [deleteTask] = useDeleteTaskMutation();

  const [deleteSubTask] = useDeleteSubTaskMutation();

  /* =========================
     WORKSPACE
  ========================= */

  const {
    data: workspaceTree,
    isLoading: wsLoading,
    isFetching: wsFetching,
    error: wsError,
    refetch: refetchTree,
  } = useGetWorkspaceTreeQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  /* =========================
     TASKS
  ========================= */

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    error: tasksError,
    refetch: refetchTasks,
  } = useGetAllTasksQuery(
    {
      listId: selectedList?._id,
      workspaceId: selectedContext?.workspace?._id,
      ...filters,
    },
    {
      skip: !selectedList,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const tasks = tasksData?.data || [];

  /* =========================
     GLOBAL RETRY
  ========================= */

  const handleGlobalRetry = async () => {
    try {
      setRetrying(true);

      await Promise.all([refetchTree(), refetchTasks()]);
    } catch (err) {
      console.log(err);
    } finally {
      setRetrying(false);
    }
  };

  /* =========================
     LIST ROLE
  ========================= */

  const listRole = selectedContext?.listRole || "viewer";

  const permissions = useMemo(() => {
    return {
      canCreateTask: hasPermission(listRole, "create:task"),

      canUpdateTask: hasPermission(listRole, "update:task"),

      canDeleteTask: hasPermission(listRole, "delete:task"),

      canManageMembers: hasPermission(listRole, "manage:members"),
    };
  }, [listRole]);

  /* =========================
     DELETE TASK
  ========================= */

  const handleDeleteTask = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);

      if (task?.subTasks?.length > 0) {
        toast({
          title: "Cannot delete task",
          description: "Delete all subtasks first.",
          variant: "destructive",
        });

        return;
      }

      await deleteTask({
        listId: selectedList?._id,
        taskId,
      }).unwrap();

      toast({
        title: "Task deleted",
        description: "Task deleted successfully.",
      });

      refetchTasks();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    }
  };

  /* =========================
     DELETE SUBTASK
  ========================= */

  const handleDeleteSubTask = async ({ taskId, subTaskId }) => {
    try {
      await deleteSubTask({
        workspaceId: selectedContext?.workspace?._id,
        taskId,
        subTaskId,
      }).unwrap();

      toast({
        title: "Subtask deleted",
        description: "Subtask deleted successfully.",
      });

      refetchTasks();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Failed to delete subtask.",
        variant: "destructive",
      });
    }
  };

  /* =========================
     TABLE ACTIONS
  ========================= */

  const handleAddSubTask = (task) => {
    if (!permissions?.canCreateTask) return;

    setSubTaskParent(task);

    setOpenTaskModal(true);
  };

  const handleOpenEdit = (task) => {
    if (!permissions?.canUpdateTask) return;

    setEditTask(task);
  };

  const handleOpenDetails = (task) => {
    setDetailsTask(task);
  };

  /* =========================
     ACTIVE TIMERS
  ========================= */

  const [activeTimers, setActiveTimers] = useState([]);

  useEffect(() => {
    const sync = () => {
      const timers = JSON.parse(
        localStorage.getItem("active-task-timers") || "{}",
      );

      const runningTimers = Object.entries(timers)
        .filter(([_, value]) => value.isRunning)
        .map(([taskId, value]) => ({
          taskId,
          from: value.from,
        }));

      setActiveTimers(runningTimers);
    };

    sync();

    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, []);

  /* =========================
     NETWORK STATUS
  ========================= */

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  /* =========================
     RENDER
  ========================= */

  return (
    <Layout>
      <div className="flex h-full gap-4">
        {/* SIDEBAR */}
        <div className="shrink-0">
          {(wsLoading || wsFetching) && !workspaceTree && <SidebarSkeleton />}

          {!wsLoading && !wsFetching && wsError && !workspaceTree && (
            <ErrorState
              text="Failed to load workspace tree. Please check your connection."
              onRetry={handleGlobalRetry}
              loading={retrying}
            />
          )}

          {!wsError && workspaceTree && (
            <FolderSidebar
              onSelectList={setSelectedList}
              onSelectContext={setSelectedContext}
              workspaceTree={workspaceTree}
              refetchTree={refetchTree}
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-4">
          {/* OFFLINE BAR */}
          {isOffline && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <WifiOff className="h-4 w-4" />
              You are offline. Some actions may not work correctly.
            </div>
          )}

          {/* HEADER */}
          {selectedList && permissions.canCreateTask && (
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Tasks Dashboard
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your tasks and track progress
                </p>
              </div>

              <Button
                onClick={() => {
                  setSubTaskParent(null);

                  setOpenTaskModal(true);
                }}
                className="rounded-2xl bg-blue-600 hover:bg-blue-700"
              >
                + Add Task
              </Button>
            </div>
          )}

          {/* FILTERS */}
          {(tasksLoading || tasksFetching) && !tasksData ? (
            <FiltersSkeleton />
          ) : (
            <TaskFilters onChange={setFilters} />
          )}

          {/* NO LIST */}
          {!selectedList && <EmptyState text="Select a list to view tasks" />}

          {/* LOADING */}
          {selectedList && (tasksLoading || tasksFetching) && !tasksData && (
            <TableSkeleton />
          )}

          {/* ERROR */}
          {selectedList && tasksError && !tasksLoading && (
            <ErrorState
              text="Failed to load tasks. Network may be unstable."
              onRetry={handleGlobalRetry}
              loading={retrying}
            />
          )}

          {/* EMPTY */}
          {selectedList &&
            !tasksLoading &&
            !tasksFetching &&
            !tasksError &&
            tasks.length === 0 && (
              <EmptyState text="No tasks yet — create your first task" />
            )}

          {/* TABLE */}
          {selectedList && !tasksLoading && !tasksError && tasks.length > 0 && (
            <div className="relative">
              {/* SOFT FETCHING OVERLAY */}
              {tasksFetching && (
                <div className="absolute inset-0 z-10 flex items-start justify-end rounded-3xl bg-white/40 p-4 backdrop-blur-[1px]">
                  <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3 py-2 text-sm text-blue-600 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </div>
                </div>
              )}

              <TasksTableView
                tasks={tasks}
                permissions={permissions}
                onAddSubTask={handleAddSubTask}
                onOpenEditModal={handleOpenEdit}
                onOpenDetailsModal={handleOpenDetails}
                onOpenChecklistModal={setChecklistTask}
                onDeleteTask={handleDeleteTask}
                onDeleteSubTask={handleDeleteSubTask}
                toast={toast}
              />
            </div>
          )}
        </div>
      </div>

      {/* =========================
          CREATE TASK / SUBTASK
      ========================= */}

      {!subTaskParent ? (
        <AddTaskModal
          isOpen={openTaskModal}
          onClose={() => {
            setOpenTaskModal(false);

            setSubTaskParent(null);
          }}
          listId={selectedList?._id}
          workspaceId={selectedContext?.workspace?._id}
        />
      ) : (
        <AddSubTaskModal
          isOpen={openTaskModal}
          onClose={() => {
            setOpenTaskModal(false);

            setSubTaskParent(null);
          }}
          taskId={subTaskParent?._id}
          listId={selectedList?._id}
          workspaceId={selectedContext?.workspace?._id}
          refetchTasks={refetchTasks}
        />
      )}

      {/* =========================
          EDIT TASK
      ========================= */}

      <TaskDetailsModal
        entity={editTask}
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        workspace={selectedContext?.workspace}
        folderName={selectedContext?.folder?.name}
        listName={selectedContext?.list}
        permissions={permissions}
        refetchTasks={refetchTasks}
      />

      {/* =========================
          CHECKLIST
      ========================= */}

      <TaskChecklistModal
        isOpen={!!checklistTask}
        taskId={checklistTask?._id}
        workspaceId={selectedContext?.workspace?._id}
        listId={selectedList?._id}
        folderId={selectedContext?.folder?._id}
        onClose={() => setChecklistTask(null)}
      />

      {/* =========================
          GLOBAL TIMERS
      ========================= */}

      {activeTimers.map((t) => (
        <GlobalTaskTimer
          key={t.taskId}
          tasksMap={Object.fromEntries(tasks.map((t) => [t._id, t.title]))}
        />
      ))}

      {/* =========================
          FUTURE PREVIEW
      ========================= */}

      {detailsTask && <div className="hidden">Future Preview Modal</div>}
    </Layout>
  );
};

export default TasksPage;
