import { useMemo, useState } from "react";

import Layout from "@/components/layout/Layout";
import TasksTableView from "@/components/Tasks/TasksTableView";
import TaskFilters from "@/components/Tasks/TaskFilters";

import { useGetAllTasksQuery } from "@/rtk/Tasks/tasksApi";
import { useGetWorkspaceTreeQuery } from "@/rtk/Tasks/workspaceApi";

import AddTaskModal from "@/components/Tasks/CreateModels/AddTaskModal";
import TaskDetailsModal from "@/components/Tasks/DetailsModels/TaskDetailsModal";

import { Button } from "@/components/ui/button";

import FolderSidebar from "@/components/Tasks/FolderSidebar";

import { AlertTriangle, Inbox } from "lucide-react";

import { hasPermission } from "@/lib/permissions";
import AddSubTaskModal from "@/components/Tasks/CreateModels/AddSubTaskModal";

/* =========================
   SKELETONS
========================= */

const SidebarSkeleton = () => (
  <div className="w-[260px] p-3 space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-6 rounded-lg bg-slate-200 animate-pulse" />
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border overflow-hidden">
    <div className="p-4 space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 rounded-xl bg-slate-200 animate-pulse" />
      ))}
    </div>
  </div>
);

/* =========================
   STATES
========================= */

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <Inbox className="h-10 w-10 mb-3" />
    <p className="text-sm">{text}</p>
  </div>
);

const ErrorState = ({ text, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-red-500">
    <AlertTriangle className="h-10 w-10 mb-3" />

    <p className="text-sm mb-3">{text}</p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
      >
        Retry
      </button>
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

  /* =========================
     MODALS STATE
  ========================= */

  // create task / subtask
  const [openTaskModal, setOpenTaskModal] = useState(false);

  // subtask parent
  const [subTaskParent, setSubTaskParent] = useState(null);

  // edit modal
  const [editTask, setEditTask] = useState(null);

  // preview/details modal
  const [detailsTask, setDetailsTask] = useState(null);

  /* =========================
     WORKSPACE
  ========================= */

  const {
    data: workspaceTree,
    isLoading: wsLoading,
    error: wsError,
    refetch: refetchTree,
    refetch: refetchWorkspace,
  } = useGetWorkspaceTreeQuery();

  /* =========================
     TASKS
  ========================= */

  const {
    data: tasksData,
    isLoading: tasksLoading,
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
    },
  );

  const tasks = tasksData?.data || [];

  const isFirstLoad = wsLoading && !workspaceTree;

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
     TABLE ACTIONS
  ========================= */

  // click row
  const handleSelectTask = (task) => {
    if (!permissions?.canUpdateTask) return;

    setEditTask(task);
  };

  // add subtask
  const handleAddSubTask = (task) => {
    if (!permissions?.canCreateTask) return;

    setSubTaskParent(task);

    setOpenTaskModal(true);
  };

  // open edit
  const handleOpenEdit = (task) => {
    if (!permissions?.canUpdateTask) return;

    setEditTask(task);
  };

  // open preview/details
  const handleOpenDetails = (task) => {
    setDetailsTask(task);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <Layout>
      <div className="flex h-full gap-4">
        {/* SIDEBAR */}
        <div className="shrink-0">
          {isFirstLoad && <SidebarSkeleton />}

          {!isFirstLoad && wsError && (
            <ErrorState
              text="Failed to load workspace"
              onRetry={refetchWorkspace}
            />
          )}

          {!isFirstLoad && !wsError && (
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
          {/* HEADER */}
          {selectedList && permissions.canCreateTask && (
            <div className="flex justify-end px-4 py-3">
              <Button
                onClick={() => {
                  setSubTaskParent(null);

                  setOpenTaskModal(true);
                }}
              >
                + Add Task
              </Button>
            </div>
          )}

          {/* FILTERS */}
          <TaskFilters onChange={setFilters} />

          {/* NO LIST */}
          {!selectedList && (
            <div className="bg-white border rounded-2xl min-h-[400px] flex flex-col justify-center">
              <EmptyState text="Select a list to view tasks" />
            </div>
          )}

          {/* LOADING */}
          {selectedList && tasksLoading && <TableSkeleton />}

          {/* ERROR */}
          {selectedList && tasksError && (
            <div className="bg-white border rounded-2xl min-h-[400px] flex flex-col justify-center">
              <ErrorState text="Failed to load tasks" onRetry={refetchTasks} />
            </div>
          )}

          {/* EMPTY */}
          {selectedList &&
            !tasksLoading &&
            !tasksError &&
            tasks.length === 0 && (
              <div className="bg-white border rounded-2xl min-h-[400px] flex flex-col justify-center">
                <EmptyState text="No tasks yet — create your first task" />
              </div>
            )}

          {/* TABLE */}
          {selectedList && !tasksLoading && !tasksError && tasks.length > 0 && (
            <TasksTableView
              tasks={tasks}
              permissions={permissions}
              onSelectTask={handleSelectTask}
              onAddSubTask={handleAddSubTask}
              onOpenEditModal={handleOpenEdit}
              onOpenDetailsModal={handleOpenDetails}
            />
          )}
        </div>
      </div>
      {/* // ========================= // CREATE TASK / SUBTASK //
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
          workspaceId={selectedContext?.workspace?._id}
        />
      )}
      {/* =========================
          EDIT TASK
      ========================= */}
      <TaskDetailsModal
        task={editTask}
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        workspace={selectedContext?.workspace}
        folderName={selectedContext?.folder?.name}
        listName={selectedContext?.list?.name}
        permissions={permissions}
      />
      {/* =========================
          PREVIEW TASK
          (Future Modal)
      ========================= */}
      {detailsTask && <div className="hidden">Future Preview Modal</div>}
    </Layout>
  );
};

export default TasksPage;
