import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, Filter, Plus, X, ChevronLeft } from "lucide-react";

import Layout from "@/components/layout/Layout";
import TasksTableView from "@/components/Tasks/TasksTableView";
import TasksTableViewMobile from "@/components/Tasks/mobile/TasksTableView.mobile";
import TaskFilters from "@/components/Tasks/TaskFilters";
import TaskFiltersMobile from "@/components/Tasks/mobile/TaskFilters.mobile";
import FolderSidebar from "@/components/Tasks/FolderSidebar";

import { useGetAllTasksQuery, useGetTaskByIdQuery } from "@/rtk/Tasks/tasksApi";
import { useGetWorkspaceTreeQuery } from "@/rtk/Tasks/workspaceApi";

import AddTaskModal from "@/components/Tasks/CreateModels/AddTaskModal";
import TaskDetailsModal from "@/components/Tasks/DetailsModels/TaskDetailsModal";

import { Button } from "@/components/ui/button";

import { Inbox, WifiOff, RefreshCw } from "lucide-react";

import AddSubTaskModal from "@/components/Tasks/CreateModels/AddSubTaskModal";
import TaskChecklistModal from "@/components/Tasks/DetailsModels/TaskChecklistModal";
import GlobalTaskTimer from "@/components/Tasks/GlobalTaskTimer";

import { useDeleteTaskMutation } from "@/rtk/Tasks/tasksApi";

import { useToast } from "@/hooks/use-toast";
import {
  useDeleteSubTaskMutation,
  useGetSubTaskByIdQuery,
} from "@/rtk/Tasks/subTasksApi";

import { useMediaQuery } from "@/hooks/useMediaQuery";

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

const SidebarSkeletonMobile = () => (
  <div className="space-y-3 p-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
    ))}
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

const FiltersSkeletonMobile = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-200" />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-10 w-28 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>

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

const TableSkeletonMobile = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
          <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);

/* =========================
   STATES
========================= */

const EmptyState = ({ text }) => (
  <div className="flex min-h-[300px] sm:min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-slate-400">
    <div className="mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-slate-100">
      <Inbox className="h-8 w-8 sm:h-10 sm:w-10" />
    </div>
    <p className="text-sm font-medium px-4 text-center">{text}</p>
  </div>
);

const ErrorState = ({ text, onRetry }) => (
  <div className="flex min-h-[300px] sm:min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white px-4 sm:px-6 text-center">
    <div className="mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-50">
      <WifiOff className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
    </div>

    <h3 className="text-base font-semibold text-slate-800">
      Connection Problem
    </h3>

    <p className="mt-2 max-w-sm text-sm text-slate-500">{text}</p>

    {onRetry && (
      <Button
        onClick={onRetry}
        className="mt-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    )}
  </div>
);

/* =========================
   PAGE
========================= */

const TasksPage = () => {
  const [searchParams] = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");
  const folderId = searchParams.get("folderId");
  const listId = searchParams.get("listId");

  const taskId = searchParams.get("taskId");
  const subTaskId = searchParams.get("subTaskId");

  const type = searchParams.get("type");
  const mode = searchParams.get("mode");

  const [selectedList, setSelectedList] = useState(null);
  const [selectedContext, setSelectedContext] = useState(null);

  const [filters, setFilters] = useState({});
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const [subTaskParent, setSubTaskParent] = useState(null);

  const [editTask, setEditTask] = useState(null);
  const [detailsTask, setDetailsTask] = useState(null);
  const [checklistTask, setChecklistTask] = useState(null);

  const { toast } = useToast();

  const [deleteTask] = useDeleteTaskMutation();
  const [deleteSubTask] = useDeleteSubTaskMutation();

  // كشف حجم الشاشة - استخدام نقاط توقف متعددة
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  
  // حالة للتحكم في ظهور الفلاتر في الموبايل
  const [showFilters, setShowFilters] = useState(false);
  
  // حالة للتحكم في ظهور السايدبار في الموبايل
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: workspaceTree,
    isLoading: wsLoading,
    error: wsError,
    refetch: refetchTree,
  } = useGetWorkspaceTreeQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

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

  const { data: singleTaskData } = useGetTaskByIdQuery(
    {
      listId,
      id: taskId,
    },
    {
      skip: !taskId || !listId,
    },
  );

  const singleTask = singleTaskData?.data;

  const { data: singleSubTaskData } = useGetSubTaskByIdQuery(
    {
      workspaceId,
      taskId,
      subTaskId,
    },
    {
      skip: !subTaskId || !taskId,
    },
  );

  const singleSubTask = singleSubTaskData?.data;

  const shouldShowFullSkeleton = (tasksLoading || tasksFetching) && !tasksData;
  const isFirstWorkspaceLoad = wsLoading && !workspaceTree;

  // اختيار الـ List و Context من الـ URL
  useEffect(() => {
    const tree = Array.isArray(workspaceTree)
      ? workspaceTree
      : workspaceTree?.data || [];

    if (!tree.length) return;

    const workspace = tree.find((w) => w._id === workspaceId);
    if (!workspace) return;

    if (type === "workspace") {
      setSelectedList(null);
      setSelectedContext({ workspace });
      return;
    }

    let foundFolder = null;

    for (const folder of workspace.folders || []) {
      if (folder._id === folderId) {
        foundFolder = folder;
        break;
      }

      const hasList = folder.lists?.some((list) => list._id === listId);
      if (hasList) {
        foundFolder = folder;
        break;
      }
    }

    if (type === "folder" && foundFolder) {
      setSelectedList(null);
      setSelectedContext({ workspace, folder: foundFolder });
      return;
    }

    const foundList = foundFolder?.lists?.find((list) => list._id === listId);

    if (foundList && ["list", "task", "subtask"].includes(type || "")) {
      setSelectedList(foundList);
      setSelectedContext({
        workspace,
        folder: foundFolder,
        list: foundList.name,
        listRole: foundList.role,
      });
    }
  }, [workspaceTree, workspaceId, folderId, listId, type]);

  // تحميل بيانات Task واحدة من الـ URL
  useEffect(() => {
    if (taskId && singleTask) {
      if (mode === "edit") setEditTask(singleTask);
      if (mode === "details") setDetailsTask(singleTask);
      if (mode === "checklist") setChecklistTask(singleTask);
    }
  }, [singleTask, taskId, mode]);

  useEffect(() => {
    if (!singleSubTask) return;

    if (singleSubTask.parentTask) {
      setDetailsTask(singleSubTask.parentTask);
    }

    if (mode === "checklist") {
      setChecklistTask(singleSubTask);
    }
  }, [singleSubTask, mode]);

  const listRole = selectedContext?.listRole || "viewer";

  const permissions = useMemo(() => {
    const isViewer = listRole === "viewer";
    return {
      canCreateTask: !isViewer,
      canUpdateTask: !isViewer,
      canDeleteTask: !isViewer,
      canManageMembers: !isViewer,
    };
  }, [listRole]);

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

      refetchTasks();
    } catch {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubTask = async ({ taskId, subTaskId }) => {
    try {
      await deleteSubTask({
        workspaceId: selectedContext?.workspace?._id,
        taskId,
        subTaskId,
      }).unwrap();

      refetchTasks();
    } catch {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // دالة مساعدة لتحديد أي Skeleton نعرض
  const renderSkeletons = () => {
    if (shouldShowFullSkeleton) {
      return isMobile ? (
        <>
          <FiltersSkeletonMobile />
          <TableSkeletonMobile />
        </>
      ) : (
        <>
          <FiltersSkeleton />
          <TableSkeleton />
        </>
      );
    }
    return null;
  };

  // منع التمرير عند فتح السايدبار
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <Layout>
      <div className="flex h-full gap-2 sm:gap-4">
        {/* ========== SIDEBAR - ويب ========== */}
        {isDesktop && (
          <div className="hidden lg:block shrink-0">
            {isFirstWorkspaceLoad && <SidebarSkeleton />}

            {!isFirstWorkspaceLoad && wsError && (
              <ErrorState text="Failed to load workspace" onRetry={refetchTree} />
            )}

            {!isFirstWorkspaceLoad && workspaceTree && (
              <FolderSidebar
                onSelectList={setSelectedList}
                onSelectContext={setSelectedContext}
                workspaceTree={workspaceTree}
                refetchTree={refetchTree}
              />
            )}
          </div>
        )}

        {/* ========== SIDEBAR - موبايل و تابلت ========== */}
        {(isMobile || isTablet) && (
          <>
            {/* Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar - تنزلق من اليسار */}
            <div
              className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="h-full overflow-y-auto p-4">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">Workspaces</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>

                {/* محتوى السايدبار */}
                {isFirstWorkspaceLoad ? (
                  <SidebarSkeletonMobile />
                ) : wsError ? (
                  <ErrorState text="Failed to load workspace" onRetry={refetchTree} />
                ) : workspaceTree ? (
                  <FolderSidebar
                    onSelectList={(list, workspace, folder) => {
                      setSelectedList(list);
                      setSelectedContext({
                        workspace,
                        folder,
                        list: list.name,
                        listRole: list.role,
                      });
                      setSidebarOpen(false);
                    }}
                    onSelectContext={setSelectedContext}
                    workspaceTree={workspaceTree}
                    refetchTree={refetchTree}
                    isMobile={true}
                  />
                ) : null}
              </div>
            </div>
          </>
        )}

        {/* ========== المحتوى الرئيسي ========== */}
        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
          {/* ===== هيدر الموبايل والتابلت ===== */}
          {(isMobile || isTablet) && (
            <div className="flex items-center justify-between gap-2 bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-sm">
              {/* زر فتح السايدبار */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </button>

              {/* عنوان الصفحة */}
              <h1 className="text-sm sm:text-base font-semibold text-slate-800 flex-1 truncate text-center">
                {selectedList?.name || "Tasks"}
              </h1>

              {/* زر الإضافة + زر الفلاتر */}
              <div className="flex items-center gap-1">
                {selectedList && permissions.canCreateTask && (
                  <button
                    onClick={() => {
                      setSubTaskParent(null);
                      setOpenTaskModal(true);
                    }}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    aria-label="Add task"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}

                {selectedList && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                    aria-label="Toggle filters"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ===== الفلاتر - موبايل و تابلت ===== */}
          {(isMobile || isTablet) && selectedList && showFilters && (
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm animate-slideDown">
              <TaskFiltersMobile
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* ===== الفلاتر - ويب ===== */}
          {isDesktop && selectedList && (
            <TaskFilters onChange={setFilters} />
          )}

          {/* ===== زر الإضافة - ويب ===== */}
          {isDesktop && selectedList && permissions.canCreateTask && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSubTaskParent(null);
                  setOpenTaskModal(true);
                }}
                className="w-full sm:w-auto"
              >
                + Add Task
              </Button>
            </div>
          )}

          {/* حالة الاتصال */}
          {isOffline && (
            <div className="rounded-2xl bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700">
              ⚠️ You are offline. Changes may not be saved.
            </div>
          )}

          {/* حالة عدم اختيار قائمة */}
          {!selectedList && <EmptyState text="Select a list to view tasks" />}

          {/* Skeleton للجدول */}
          {selectedList && renderSkeletons()}

          {/* حالة الخطأ */}
          {selectedList && tasksError && (
            <ErrorState text="Failed to load tasks" onRetry={refetchTasks} />
          )}

          {/* حالة عدم وجود مهام */}
          {selectedList &&
            !tasksLoading &&
            !tasksFetching &&
            !tasksError &&
            tasks.length === 0 && <EmptyState text="No tasks yet" />}

          {/* عرض المهام */}
          {selectedList && tasks.length > 0 && (
            (isMobile || isTablet) ? (
              <TasksTableViewMobile
                tasks={tasks}
                permissions={permissions}
                onAddSubTask={(task) => {
                  setSubTaskParent(task);
                  setOpenTaskModal(true);
                }}
                onOpenEditModal={setEditTask}
                onOpenDetailsModal={setDetailsTask}
                onOpenChecklistModal={setChecklistTask}
                onDeleteTask={handleDeleteTask}
                onDeleteSubTask={handleDeleteSubTask}
                toast={toast}
              />
            ) : (
              <TasksTableView
                tasks={tasks}
                permissions={permissions}
                onAddSubTask={(task) => {
                  setSubTaskParent(task);
                  setOpenTaskModal(true);
                }}
                onOpenEditModal={setEditTask}
                onOpenDetailsModal={setDetailsTask}
                onOpenChecklistModal={setChecklistTask}
                onDeleteTask={handleDeleteTask}
                onDeleteSubTask={handleDeleteSubTask}
                toast={toast}
              />
            )
          )}
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Add Task / SubTask Modal */}
      {!subTaskParent ? (
        <AddTaskModal
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          listId={selectedList?._id}
          workspaceId={selectedContext?.workspace?._id}
        />
      ) : (
        <AddSubTaskModal
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          taskId={subTaskParent?._id}
          listId={selectedList?._id}
          workspaceId={selectedContext?.workspace?._id}
          refetchTasks={refetchTasks}
        />
      )}

      {/* Task Details Modal */}
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

      {/* Task Checklist Modal */}
      <TaskChecklistModal
        isOpen={!!checklistTask}
        taskId={checklistTask?._id}
        workspaceId={selectedContext?.workspace?._id}
        listId={selectedList?._id}
        folderId={selectedContext?.folder?._id}
        onClose={() => setChecklistTask(null)}
      />

      {/* Global Timer */}
      <GlobalTaskTimer
        tasksMap={Object.fromEntries(tasks.map((t) => [t._id, t.title]))}
      />
    </Layout>
  );
};

export default TasksPage;