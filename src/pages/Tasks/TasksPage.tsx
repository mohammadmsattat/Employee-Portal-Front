// TasksPage.jsx - النسخة المعدلة

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, Filter, Plus, X, ChevronLeft } from "lucide-react";

import Layout from "@/components/layout/Layout";
import TasksTableView from "@/components/Tasks/TasksTableView";
import TasksTableViewMobile from "@/components/Tasks/mobile/TasksTableView.mobile";
import TaskFilters from "@/components/Tasks/TaskFilters";
import TaskFiltersMobile from "@/components/Tasks/mobile/TaskFilters.mobile";
import FolderSidebar from "@/components/Tasks/FolderSidebar";
import FolderSidebarMobile from "@/components/Tasks/mobile/FolderSidebar.mobile";

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
import { hasPermission, resolveEffectiveListRole } from "@/lib/permissions";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ===== استيراد مودلات السايدبار =====
import { AddWorkspaceModal } from "@/components/Tasks/CreateModels/AddWorkspaceModal";
import { AddListModal } from "@/components/Tasks/CreateModels/AddListModal";
import { ManageMembersModal } from "@/components/Tasks/UpdatesModels/ManageMembersModal";
import { FolderMembersModal } from "@/components/Tasks/UpdatesModels/FolderMembersModal";
import { ListMembersModal } from "@/components/Tasks/UpdatesModels/ManageListMembersModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

// ===== استيراد الـ Hook الخاص بالحذف =====
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";
import AddFolderModal from "@/components/Tasks/CreateModels/AddFolderModal ";
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
      <div
        key={i}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <div
                  key={j}
                  className="h-8 w-8 animate-pulse rounded-lg bg-slate-200"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-6 w-16 animate-pulse rounded-full bg-slate-200"
              />
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

  // كشف حجم الشاشة
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== تعريف useGetWorkspaceTreeQuery أولاً =====
  const {
    data: workspaceTree,
    isLoading: wsLoading,
    error: wsError,
    refetch: refetchTree,
  } = useGetWorkspaceTreeQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ===== الآن يمكن استخدام refetchTree في useFolderSidebarController =====
  const {
    deleteState,
    setDeleteState,
    deleteLoading,
    handleDelete,
    requestDelete,
  } = useFolderSidebarController({
    refetchTree: refetchTree,
  });

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    error: tasksError,
    refetch: refetchTasks,
  } = useGetAllTasksQuery(
    {
      listId: selectedList?._id || "",
      ...filters,
    },
    {
      skip: !selectedList,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const tasks = tasksData?.data || [];

  useEffect(() => {
    if (!editTask) return;

    const currentEntity = editTask?.data || editTask;

    if (!currentEntity?._id) return;

    const currentType =
      editTask?.type === "subtask" || Boolean(currentEntity?.task)
        ? "subtask"
        : "task";

    let freshEntity = null;

    if (currentType === "task") {
      freshEntity = tasks.find((task) => task._id === currentEntity._id);
    }

    if (currentType === "subtask") {
      for (const task of tasks) {
        const foundSubTask = task.subTasks?.find(
          (subTask) => subTask._id === currentEntity._id,
        );

        if (foundSubTask) {
          freshEntity = foundSubTask;
          break;
        }
      }
    }

    if (!freshEntity) return;

    if (freshEntity.updatedAt === currentEntity.updatedAt) {
      return;
    }

    setEditTask((previous) => {
      if (!previous) return previous;

      if (previous?.data) {
        return {
          ...previous,
          data: freshEntity,
        };
      }

      return freshEntity;
    });
  }, [tasks, editTask]);

  const { data: singleTaskData } = useGetTaskByIdQuery(
    {
      listId: listId || "",
      id: taskId || "",
    },
    {
      skip: !taskId || !listId,
    },
  );

  const singleTask = singleTaskData?.data;

  const { data: singleSubTaskData } = useGetSubTaskByIdQuery(
    {
      taskId: taskId || "",
      subTaskId: subTaskId || "",
    },
    {
      skip: !subTaskId || !taskId,
    },
  );

  const singleSubTask = singleSubTaskData?.data;

  const shouldShowFullSkeleton = (tasksLoading || tasksFetching) && !tasksData;
  const isFirstWorkspaceLoad = wsLoading && !workspaceTree;

  const [sidebarModals, setSidebarModals] = useState({
    workspaceModal: false,
    folderModal: false,
    listModal: false,
    manageMembers: false,
    folderMembers: false,
    listMembers: false,
  });

  const [modalData, setModalData] = useState({
    workspace: null,
    folder: null,
    list: null,
  });

  // ===== جمع جميع الـ Lists من جميع الـ Folders =====
  const allLists = useMemo(() => {
    const tree = Array.isArray(workspaceTree)
      ? workspaceTree
      : workspaceTree?.data || [];

    const lists = [];
    tree.forEach((workspace) => {
      (workspace.folders || []).forEach((folder) => {
        (folder.lists || []).forEach((list) => {
          lists.push({
            ...list,
            folderName: folder.name,
            workspaceName: workspace.name,
            folderId: folder._id,
            workspaceId: workspace._id,
          });
        });
      });
    });

    return lists;
  }, [workspaceTree]);

  useEffect(() => {
    const tree = Array.isArray(workspaceTree)
      ? workspaceTree
      : workspaceTree?.data || [];

    if (!tree.length) return;

    const workspace = tree.find(
      (workspaceItem) => workspaceItem._id === workspaceId,
    );

    if (!workspace) return;

    if (type === "workspace") {
      setSelectedList(null);

      setSelectedContext({
        workspace,
        workspaceRole: workspace.role || workspace.workspaceRole || null,
      });

      return;
    }

    let foundFolder = null;

    for (const folder of workspace.folders || []) {
      const folderMatches = folder._id === folderId;

      const containsList = folder.lists?.some((list) => list._id === listId);

      if (folderMatches || containsList) {
        foundFolder = folder;
        break;
      }
    }

    if (type === "folder" && foundFolder) {
      setSelectedList(null);

      setSelectedContext({
        workspace,
        folder: foundFolder,
        workspaceRole: workspace.role || workspace.workspaceRole || null,
        folderRole: foundFolder.role || foundFolder.folderRole || null,
      });

      return;
    }

    const foundList = foundFolder?.lists?.find((list) => list._id === listId);

    if (foundList && ["list", "task", "subtask"].includes(type || "")) {
      const workspaceRole = workspace.role || workspace.workspaceRole || null;

      const folderRole = foundFolder.role || foundFolder.folderRole || null;

      const effectiveListRole = resolveEffectiveListRole({
        workspaceRole,
        folderRole,
        listRole: foundList.role || foundList.listRole || null,
      });

      const normalizedList = {
        ...foundList,
        listRole: effectiveListRole,
        effectiveRole: effectiveListRole,
      };

      setSelectedList(normalizedList);

      setSelectedContext({
        workspace,
        folder: foundFolder,
        list: normalizedList,
        workspaceRole,
        folderRole,
        listRole: effectiveListRole,
      });
    }
  }, [workspaceTree, workspaceId, folderId, listId, type]);

  useEffect(() => {
    if (!taskId || !singleTask || subTaskId) {
      return;
    }

    if (mode === "edit") {
      setEditTask(singleTask);
    }

    if (mode === "details") {
      setDetailsTask(singleTask);
    }

    if (mode === "checklist") {
      setChecklistTask(singleTask);
    }
  }, [singleTask, taskId, subTaskId, mode]);

  useEffect(() => {
    if (!singleSubTask || !subTaskId) {
      return;
    }

    const subTaskEntity = {
      type: "subtask",
      data: singleSubTask,
    };

    if (mode === "edit") {
      setEditTask(subTaskEntity);
    }

    if (mode === "details") {
      setDetailsTask(subTaskEntity);
    }

    if (mode === "checklist") {
      setChecklistTask(subTaskEntity);
    }
  }, [singleSubTask, subTaskId, mode]);

  const listRole =
    selectedContext?.listRole || selectedList?.listRole || "viewer";

  const permissions = useMemo(() => {
    const hasSelectedList = Boolean(selectedList?._id);

    return {
      canCreateTask: hasSelectedList && hasPermission(listRole, "create:task"),

      canUpdateTask: hasSelectedList && hasPermission(listRole, "update:task"),

      canDeleteTask: hasSelectedList && hasPermission(listRole, "delete:task"),

      canManageMembers:
        hasSelectedList && hasPermission(listRole, "manage:members"),

      canUpdateDates:
        hasSelectedList && ["manager", "owner"].includes(listRole),
    };
  }, [selectedList?._id, listRole]);

  const checklistContext = useMemo(() => {
    const entity = checklistTask?.data || checklistTask;

    if (!entity?._id) {
      return {
        entity: null,
        entityType: "task",
        parentTaskId: null,
      };
    }

    const parentIdFromEntity =
      typeof entity.task === "object" ? entity.task?._id : entity.task || null;

    const parentTaskFromTasks = tasks.find((task) =>
      task.subTasks?.some((subTask) => subTask._id === entity._id),
    );

    const openedSubTaskFromUrl = Boolean(subTaskId) && entity._id === subTaskId;

    const isSubTask =
      checklistTask?.type === "subtask" ||
      Boolean(parentIdFromEntity) ||
      Boolean(parentTaskFromTasks) ||
      openedSubTaskFromUrl;

    return {
      entity,
      entityType: isSubTask ? "subtask" : "task",

      parentTaskId: isSubTask
        ? parentIdFromEntity || parentTaskFromTasks?._id || taskId || null
        : null,
    };
  }, [checklistTask, tasks, taskId, subTaskId]);

  const handleOpenAddTask = () => {
    if (!selectedList?._id) {
      toast({
        title: "No List Selected",
        description: "Please select a list first to create a task.",
        variant: "destructive",
      });

      return;
    }

    if (!permissions.canCreateTask) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create tasks in this list.",
        variant: "destructive",
      });

      return;
    }

    setSubTaskParent(null);
    setOpenTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!selectedList?._id) return;

    try {
      await deleteTask({
        listId: selectedList._id,
        taskId,
      }).unwrap();

      refetchTasks();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error?.data?.message || "Could not delete task.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubTask = async ({ taskId, subTaskId }) => {
    try {
      await deleteSubTask({
        taskId,
        subTaskId,
      }).unwrap();

      refetchTasks();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error?.data?.message || "Could not delete subtask.",
        variant: "destructive",
      });
    }
  };

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

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

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const openWorkspaceModal = () => {
    setSidebarModals((prev) => ({ ...prev, workspaceModal: true }));
  };

  const openFolderModal = (workspace) => {
    setModalData((prev) => ({ ...prev, workspace }));
    setSidebarModals((prev) => ({ ...prev, folderModal: true }));
  };

  const openListModal = (workspace, folder) => {
    setModalData((prev) => ({ ...prev, workspace, folder }));
    setSidebarModals((prev) => ({ ...prev, listModal: true }));
  };

  const openManageMembers = (workspace) => {
    setModalData((prev) => ({ ...prev, workspace }));
    setSidebarModals((prev) => ({ ...prev, manageMembers: true }));
  };

  const openFolderMembers = (workspace, folder) => {
    setModalData((previous) => ({
      ...previous,
      workspace,
      folder,
    }));

    setSidebarModals((previous) => ({
      ...previous,
      folderMembers: true,
    }));
  };

  const openListMembers = (workspace, folder, list) => {
    setModalData((previous) => ({
      ...previous,
      workspace,
      folder,
      list,
    }));

    setSidebarModals((previous) => ({
      ...previous,
      listMembers: true,
    }));
  };

  const openDeleteConfirm = (type, item, workspaceId, folderId) => {
    requestDelete({ type, item, workspaceId, folderId });
  };

  const closeAllSidebarModals = () => {
    setSidebarModals({
      workspaceModal: false,
      folderModal: false,
      listModal: false,
      manageMembers: false,
      folderMembers: false,
      listMembers: false,
    });
    setModalData({
      workspace: null,
      folder: null,
      list: null,
    });
    setDeleteState({ open: false });
  };

  const handleSelectList = (list, workspace, folder) => {
    const workspaceRole = workspace?.role || workspace?.workspaceRole || null;

    const folderRole = folder?.role || folder?.folderRole || null;

    const effectiveListRole = resolveEffectiveListRole({
      workspaceRole,
      folderRole,
      listRole: list?.role || list?.listRole || null,
    });

    const normalizedList = {
      ...list,
      listRole: effectiveListRole,
      effectiveRole: effectiveListRole,
    };

    setSelectedList(normalizedList);

    setSelectedContext({
      workspace,
      folder,
      list: normalizedList,
      workspaceRole,
      folderRole,
      listRole: effectiveListRole,
    });

    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8 w-full">
        <div className="flex h-full gap-2 sm:gap-4">
          {/* ========== SIDEBAR  ========== */}
          {isDesktop && (
            <div className="hidden lg:block shrink-0">
              {isFirstWorkspaceLoad && <SidebarSkeleton />}

              {!isFirstWorkspaceLoad && wsError && (
                <ErrorState
                  text="Failed to load workspace"
                  onRetry={refetchTree}
                />
              )}

              {!isFirstWorkspaceLoad && workspaceTree && (
                <FolderSidebar
                  onSelectList={handleSelectList}
                  workspaceTree={workspaceTree}
                  refetchTree={refetchTree}
                  onOpenWorkspaceModal={openWorkspaceModal}
                  onOpenFolderModal={openFolderModal}
                  onOpenListModal={openListModal}
                  onOpenManageMembers={openManageMembers}
                  onOpenFolderMembers={openFolderMembers}
                  onOpenListMembers={openListMembers}
                  onOpenDeleteConfirm={openDeleteConfirm}
                />
              )}
            </div>
          )}

          {/* ========== SIDEBAR ========== */}
          {(isMobile || isTablet) && (
            <>
              {sidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <div
                className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="h-full overflow-y-auto">
                  {isFirstWorkspaceLoad ? (
                    <div className="p-4">
                      <SidebarSkeletonMobile />
                    </div>
                  ) : wsError ? (
                    <div className="p-4">
                      <ErrorState
                        text="Failed to load workspace"
                        onRetry={refetchTree}
                      />
                    </div>
                  ) : workspaceTree ? (
                    <FolderSidebarMobile
                      onSelectList={handleSelectList}
                      workspaceTree={workspaceTree}
                      refetchTree={refetchTree}
                      onClose={() => setSidebarOpen(false)}
                      onOpenWorkspaceModal={openWorkspaceModal}
                      onOpenFolderModal={openFolderModal}
                      onOpenListModal={openListModal}
                      onOpenManageMembers={openManageMembers}
                      onOpenFolderMembers={openFolderMembers}
                      onOpenListMembers={openListMembers}
                      onOpenDeleteConfirm={openDeleteConfirm}
                    />
                  ) : null}
                </div>
              </div>
            </>
          )}

          <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
            {(isMobile || isTablet) && (
              <div className="flex items-center justify-between gap-2 bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5 text-slate-600" />
                </button>

                <h1 className="text-sm sm:text-base font-semibold text-slate-800 flex-1 truncate text-center">
                  {selectedList?.name || "Tasks"}
                </h1>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleOpenAddTask}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedList && permissions.canCreateTask
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    aria-label="Add task"
                    title={
                      !selectedList
                        ? "Select a list first"
                        : !permissions.canCreateTask
                          ? "You don't have permission"
                          : "Add task"
                    }
                  >
                    <Plus className="h-5 w-5" />
                  </button>

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

            {isDesktop && (
              <div className="flex justify-end">
                <Button
                  onClick={handleOpenAddTask}
                  className="h-11 rounded-xl bg-blue-600 px-5 font-medium text-white shadow-lg hover:bg-blue-700 transition-colors shrink-0"
                >
                  + Add Task
                </Button>
              </div>
            )}

            {(isMobile || isTablet) && selectedList && showFilters && (
              <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm animate-slideDown">
                <TaskFiltersMobile
                  onChange={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            )}

            {isDesktop && selectedList && <TaskFilters onChange={setFilters} />}

            {isOffline && (
              <div className="rounded-2xl bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700">
                ⚠️ You are offline. Changes may not be saved.
              </div>
            )}

            {!selectedList && <EmptyState text="Select a list to view tasks" />}

            {selectedList && renderSkeletons()}

            {selectedList && tasksError && (
              <ErrorState text="Failed to load tasks" onRetry={refetchTasks} />
            )}

            {selectedList &&
              !tasksLoading &&
              !tasksFetching &&
              !tasksError &&
              tasks.length === 0 && <EmptyState text="No tasks yet" />}

            {selectedList &&
              tasks.length > 0 &&
              (isMobile || isTablet ? (
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
              ))}
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {!subTaskParent ? (
        <AddTaskModal
          isOpen={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          listId={selectedList?._id}
          allLists={allLists}
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
      <TaskDetailsModal
        entity={detailsTask?.data || detailsTask}
        entityType={
          editTask?.type === "subtask" ||
          Boolean((editTask?.data || editTask)?.task)
            ? "subtask"
            : "task"
        }
        mode="view"
        isOpen={Boolean(detailsTask)}
        onClose={() => setDetailsTask(null)}
        workspace={selectedContext?.workspace || null}
        folderName={selectedContext?.folder?.name || null}
        listName={selectedContext?.list || selectedList || null}
        permissions={permissions}
        refetchTasks={refetchTasks}
      />
      <TaskDetailsModal
        entity={editTask?.data || editTask}
        entityType={editTask?.type === "subtask" ? "subtask" : "task"}
        mode="edit"
        isOpen={Boolean(editTask)}
        onClose={() => setEditTask(null)}
        workspace={selectedContext?.workspace || null}
        folderName={selectedContext?.folder?.name || null}
        listName={selectedContext?.list || selectedList || null}
        permissions={permissions}
        refetchTasks={refetchTasks}
      />

      <TaskChecklistModal
        isOpen={Boolean(checklistContext.entity)}
        onClose={() => setChecklistTask(null)}
        entityType={checklistContext.entityType}
        entityId={checklistContext.entity?._id ?? null}
        parentTaskId={checklistContext.parentTaskId}
        listId={selectedList?._id ?? listId ?? null}
        canEdit={Boolean(permissions.canUpdateTask)}
      />

      <AddWorkspaceModal
        isOpen={sidebarModals.workspaceModal}
        onClose={closeAllSidebarModals}
      />

      <AddFolderModal
        isOpen={sidebarModals.folderModal}
        onClose={closeAllSidebarModals}
        workspaceId={modalData.workspace?._id}
        refetchTree={refetchTree}
      />

      <AddListModal
        isOpen={sidebarModals.listModal}
        onClose={closeAllSidebarModals}
        workspaceId={
          modalData.workspace?._id || selectedContext?.workspace?._id
        }
        folderId={modalData.folder?._id}
        refetchTree={refetchTree}
      />

      <ManageMembersModal
        isOpen={sidebarModals.manageMembers}
        onClose={closeAllSidebarModals}
        workspace={modalData.workspace}
      />

      <FolderMembersModal
        isOpen={sidebarModals.folderMembers}
        folder={modalData.folder}
        workspace={modalData.workspace}
        onClose={closeAllSidebarModals}
      />

      <ListMembersModal
        isOpen={sidebarModals.listMembers}
        onClose={closeAllSidebarModals}
        list={modalData.list}
        workspace={modalData.workspace}
        folderId={modalData.folder?._id}
      />

      <DeleteConfirmModal
        isOpen={deleteState.open}
        loading={deleteLoading}
        title={`Delete ${deleteState.type}`}
        description={`Are you sure you want to delete "${deleteState.name}"? This action cannot be undone.`}
        stateName={deleteState.name}
        onClose={() => setDeleteState({ open: false })}
        onConfirm={() => {
          handleDelete();
        }}
      />

      <GlobalTaskTimer
        tasksMap={Object.fromEntries(tasks.map((t) => [t._id, t.title]))}
      />
    </Layout>
  );
};

export default TasksPage;
