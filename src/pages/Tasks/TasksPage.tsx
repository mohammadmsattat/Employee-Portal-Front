import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TasksTableView from "@/components/Tasks/TasksTableView";
import FolderSidebar from "@/components/Tasks/FolderSidebar";
import TaskFilters from "@/components/Tasks/TaskFilters";
import { useGetAllTasksQuery } from "@/rtk/Tasks/tasksApi";
import { useGetWorkspaceTreeQuery } from "@/rtk/Tasks/workspaceApi";
import AddTaskModal from "@/components/Tasks/CreateModels/AddTaskModal";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import TaskDetailsModal from "@/components/Tasks/DetailsModels/TaskDetailsModal";
import { Button } from "@/components/ui/button";

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

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <Loader2 className="h-8 w-8 animate-spin mb-3" />
    <p className="text-sm">Loading...</p>
  </div>
);

/* =========================
   PAGE
========================= */

const TasksPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [filters, setFilters] = useState({});

  /* WORKSPACE */
  const {
    data: workspaceTree,
    isLoading: wsLoading,
    error: wsError,
    refetch: refetchWorkspace,
  } = useGetWorkspaceTreeQuery();

  /* TASKS */
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useGetAllTasksQuery(
    {
      listId: selectedList?._id,
      ...filters,
    },
    {
      skip: !selectedList,
    },
  );

  const tasks = tasksData?.data || [];
  const isFirstLoad = wsLoading && !workspaceTree;

  return (
    <Layout>
      <div className="flex h-full gap-4">
        {/* =========================
           SIDEBAR
        ========================= */}
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
              workspaceTree={workspaceTree}
            />
          )}
        </div>

        {/* =========================
           CONTENT
        ========================= */}
        <div className="flex-1 space-y-4">
          {/* HEADER */}
          {selectedList && (
            <div className="flex justify-end    px-4 py-3 ">
              <Button onClick={() => setOpenTaskModal(true)}>+ Add Task</Button>
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
                <EmptyState text="No tasks yet — create your first task " />
              </div>
            )}

          {/* DATA */}
          {selectedList && !tasksLoading && !tasksError && tasks.length > 0 && (
            <TasksTableView tasks={tasks} onSelectTask={setSelectedTask} />
          )}
        </div>
      </div>

      {/* MODAL */}
      <AddTaskModal
        isOpen={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        listId={selectedList?._id}
        workspaceId={selectedList?.workspace}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        listName={selectedList?.name}
      />
    </Layout>
  );
};

export default TasksPage;
