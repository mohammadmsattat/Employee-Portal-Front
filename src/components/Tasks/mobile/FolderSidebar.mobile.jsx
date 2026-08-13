// FolderSidebarMobile.jsx - نسخة معدلة مع تمرير workspace و folder معاً

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  List,
  Plus,
  X,
  Users,
  Trash2,
  Edit2,
  MoreHorizontal,
  Archive,
  Copy,
  UserPlus,
  Circle,
  CheckCircle2,
  Clock,
  Package,
  Code,
  Palette,
  Megaphone,
  Briefcase,
} from "lucide-react";
import { useFolderSidebar } from "@/hooks/Tasks/useFolderSidebar";
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";

/* =========================
   ICON SYSTEM (مطابق للويب)
========================= */

const WORKSPACE_ICONS = [
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Folder,
  Package,
  List,
];

const getWorkspaceIcon = (workspaceId = "") => {
  let hash = 0;
  const str = String(workspaceId);

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }

  return WORKSPACE_ICONS[hash % WORKSPACE_ICONS.length];
};

const getWorkspaceColor = (id = "") => {
  const colors = [
    "text-blue-700",
    "text-green-700",
    "text-purple-700",
    "text-orange-700",
    "text-pink-700",
  ];

  let hash = 0;
  const str = String(id);

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }

  return colors[hash % colors.length];
};

/* =========================
   SIDEBAR - نسخة الموبايل (مطابقة للويب)
========================= */

const FolderSidebarMobile = ({
  onSelectList,
  onSelectContext,
  workspaceTree,
  refetchTree,
  isOpen = true,
  onClose,
  // ===== Props للمودلات من الأب =====
  onOpenWorkspaceModal,
  onOpenFolderModal,
  onOpenListModal,
  onOpenManageMembers,
  onOpenFolderMembers,
  onOpenListMembers,
  onOpenDeleteConfirm,
}) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [contextMenu, setContextMenu] = useState({
    open: false,
    type: null,
    item: null,
  });

  const { state, actions } = useFolderSidebar({
    onSelectList,
    onSelectContext,
    refetchTree,
  });

  // ✅ نستخدم فقط handleRename من useFolderSidebarController
  const { handleRename } = useFolderSidebarController({ refetchTree });

  const handleSelectList = (list, workspace, folder) => {
    actions.handleSelectList(list, workspace, folder);
  };

  const openContextMenu = (type, item, workspace) => {
    if (workspace) setSelectedWorkspace(workspace);
    setContextMenu({ open: true, type, item });
  };

  const closeContextMenu = () => {
    setContextMenu({ open: false, type: null, item: null });
  };

  const handleRenameAction = (type, item) => {
    closeContextMenu();
    actions.startRename({
      id: item._id,
      name: item.name,
      type: type,
    });
  };

  const handleAction = (callback) => {
    callback();
    closeContextMenu();
  };

  // ===== دوال استدعاء المودلات من الأب (مطابقة للويب) =====
  const handleOpenWorkspaceModal = () => {
    if (onOpenWorkspaceModal) onOpenWorkspaceModal();
  };

  const handleOpenFolderModal = (workspace) => {
    if (onOpenFolderModal) onOpenFolderModal(workspace);
  };

  // ✅ تصحيح: تمرير workspace و folder معاً (مطابق للويب)
  const handleOpenListModal = (workspace, folder) => {
    if (onOpenListModal) onOpenListModal(workspace, folder);
  };

  const handleOpenManageMembers = (workspace) => {
    if (onOpenManageMembers) onOpenManageMembers(workspace);
  };

  // ✅ تصحيح: تمرير folder و workspace معاً
  const handleOpenFolderMembers = (folder, workspace) => {
    if (onOpenFolderMembers) onOpenFolderMembers(folder, workspace);
  };

  // ✅ تصحيح: تمرير listId, workspaceId, folderId
  const handleOpenListMembers = (listId, workspaceId, folderId) => {
    if (onOpenListMembers) onOpenListMembers(listId, workspaceId, folderId);
  };

  // ✅ تصحيح: تمرير type, item, workspaceId, folderId
  const handleOpenDeleteConfirm = (type, item, workspaceId, folderId) => {
    if (onOpenDeleteConfirm) onOpenDeleteConfirm(type, item, workspaceId, folderId);
  };

  const getContextMenuItems = () => {
    const { type, item } = contextMenu;
    if (!item) return [];

    const items = [
      {
        icon: Edit2,
        label: "Rename",
        onClick: () => {
          handleRenameAction(type, item);
        },
      },
    ];

    if (type === "workspace") {
      items.push({
        icon: Plus,
        label: "Add Folder",
        onClick: () => {
          handleAction(() => {
            handleOpenFolderModal(item);
          });
        },
      });
    }

    if (type === "folder") {
      items.push({
        icon: Plus,
        label: "Add List",
        onClick: () => {
          handleAction(() => {
            // ✅ تمرير workspace و folder
            handleOpenListModal(selectedWorkspace, item);
          });
        },
      });
    }

    items.push(
      {
        icon: Users,
        label: "Manage Members",
        onClick: () => {
          handleAction(() => {
            if (type === "workspace") {
              handleOpenManageMembers(item);
            } else if (type === "folder") {
              // ✅ تمرير folder و workspace
              handleOpenFolderMembers(item, selectedWorkspace);
            } else if (type === "list") {
              // ✅ تمرير listId, workspaceId, folderId
              handleOpenListMembers(
                item._id,
                selectedWorkspace?._id,
                item.folderId || selectedWorkspace?.folders?.find(f => 
                  f.lists?.some(l => l._id === item._id)
                )?._id
              );
            }
          });
        },
      },

      {
        icon: Trash2,
        label: "Delete",
        danger: true,
        onClick: () => {
          handleAction(() => {
            // ✅ تمرير type, item, workspaceId, folderId
            let folderId = null;
            if (type === "list") {
              // البحث عن folderId من الـ list
              const workspace = selectedWorkspace;
              if (workspace) {
                for (const folder of workspace.folders || []) {
                  if (folder.lists?.some(l => l._id === item._id)) {
                    folderId = folder._id;
                    break;
                  }
                }
              }
            }
            handleOpenDeleteConfirm(type, item, selectedWorkspace?._id, folderId);
          });
        },
      },
    );

    return items;
  };

  // منع السكرول في الخلفية عند فتح القائمة السياقية
  useEffect(() => {
    if (contextMenu.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [contextMenu.open]);

  return (
    <>
      {/* ===== Sidebar ===== */}
      <div className="h-full flex flex-col">
        {/* ===== HEADER (خاص بالموبايل) ===== */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 bg-gradient-to-r from-blue-50/30 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Workspaces</h2>
              <p className="text-xs text-slate-500">
                {workspaceTree?.data?.length || 0} workspaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* ===== محتوى السايدبار (مطابق للويب) ===== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          {/* TOP - مطابق للويب */}
          <div className="px-3 py-3 bg-slate-50 rounded-lg border space-y-2">
            <div className="text-sm font-semibold text-slate-700">
              {state.activeFolder
                ? state.activeFolder.name
                : state.activeWorkspace
                  ? state.activeWorkspace.name
                  : "Workspaces"}
            </div>

            {state.user?.canCreateWorkspace && (
              <button
                onClick={handleOpenWorkspaceModal}
                className="flex items-center gap-1 text-xs hover:text-blue-600"
              >
                <Plus className="h-4 w-4" />
                Workspace
              </button>
            )}
          </div>

          {/* TREE - مطابق تماماً للويب */}
          <div className="space-y-1 mt-2">
            {workspaceTree?.data?.map((workspace) => {
              const isWsOpen = state.openWorkspaces[workspace._id];
              const Icon = getWorkspaceIcon(workspace._id);
              const colorClass = getWorkspaceColor(workspace._id);
              const isWorkspaceEditing =
                state.editingItem?.id === workspace._id &&
                state.editingItem?.type === "workspace";

              const totalTasks =
                workspace.folders?.reduce((acc, folder) => {
                  return (
                    acc +
                    (folder.lists?.reduce(
                      (sum, list) => sum + (list.tasks?.length || 0),
                      0,
                    ) || 0)
                  );
                }, 0) || 0;

              return (
                <div key={workspace._id}>
                  {/* WORKSPACE */}
                  <div
                    className={`relative rounded-xl transition-all duration-200 ${
                      isWsOpen ? "bg-blue-50/50" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-center gap-2 px-3 py-3">
                      <button
                        onClick={() => actions.toggleWorkspace(workspace)}
                        className="shrink-0 p-0.5 hover:bg-slate-200/50 rounded-lg transition-all duration-200"
                      >
                        {isWsOpen ? (
                          <ChevronRight className="h-4 w-4 rotate-90 text-slate-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-500" />
                        )}
                      </button>

                      <div
                        className={`p-1.5 rounded-md ${colorClass} shrink-0`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {isWorkspaceEditing ? (
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            value={state.editName}
                            onChange={(e) =>
                              actions.setEditName(e.target.value)
                            }
                            className="text-sm border rounded px-2 py-1 w-full"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRename({
                                  workspaceId: workspace._id,
                                  id: workspace._id,
                                  folderId: workspace._id,
                                  type: "workspace",
                                  name: state.editName,
                                  cancelRename: actions.cancelRename,
                                });
                              }
                              if (e.key === "Escape") {
                                actions.cancelRename();
                              }
                            }}
                          />
                          <button
                            onClick={() =>
                              handleRename({
                                workspaceId: workspace._id,
                                id: workspace._id,
                                folderId: workspace._id,
                                type: "workspace",
                                name: state.editName,
                                cancelRename: actions.cancelRename,
                              })
                            }
                            className="p-1 text-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={actions.cancelRename}
                            className="p-1 text-rose-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => actions.toggleWorkspace(workspace)}
                          className="flex-1 text-left min-w-0"
                        >
                          <span className="font-semibold text-sm text-slate-800 truncate block">
                            {workspace.name}
                          </span>
                        </button>
                      )}

                      {totalTasks > 0 && (
                        <span className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {totalTasks}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openContextMenu("workspace", workspace);
                        }}
                        className="shrink-0 p-1.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 active:bg-slate-300/70 transition-all duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>

                    {/* FOLDERS */}
                    {isWsOpen && (
                      <div className="ml-7 space-y-1 pb-2">
                        {workspace.folders?.map((folder) => {
                          const isOpen = state.openFolders[folder._id];
                          const isFolderEditing =
                            state.editingItem?.id === folder._id &&
                            state.editingItem?.type === "folder";

                          const folderTasks =
                            folder.lists?.reduce(
                              (sum, list) => sum + (list.tasks?.length || 0),
                              0,
                            ) || 0;

                          return (
                            <div key={folder._id}>
                              <div
                                className={`relative rounded-lg transition-all duration-200 ${
                                  isOpen
                                    ? "bg-blue-50/30"
                                    : "hover:bg-slate-50/50"
                                }`}
                              >
                                <div className="flex items-center gap-2 px-3 py-2.5">
                                  <button
                                    onClick={() =>
                                      actions.toggleFolder(folder, workspace)
                                    }
                                    className="shrink-0 p-0.5 hover:bg-slate-200/50 rounded-lg transition-all duration-200"
                                  >
                                    {isOpen ? (
                                      <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-500" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                    )}
                                  </button>

                                  <div className="shrink-0">
                                    {isOpen ? (
                                      <FolderOpen className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Folder className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>

                                  {isFolderEditing ? (
                                    <div className="flex-1 flex items-center gap-1">
                                      <input
                                        value={state.editName}
                                        onChange={(e) =>
                                          actions.setEditName(e.target.value)
                                        }
                                        className="text-sm border rounded px-2 py-1 w-full"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleRename({
                                              id: null,
                                              folderId: folder._id,
                                              type: "folder",
                                              name: state.editName,
                                              workspaceId: workspace._id,
                                              cancelRename:
                                                actions.cancelRename,
                                            });
                                          }
                                          if (e.key === "Escape") {
                                            actions.cancelRename();
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          handleRename({
                                            id: null,
                                            folderId: folder._id,
                                            type: "folder",
                                            name: state.editName,
                                            workspaceId: workspace._id,
                                            cancelRename: actions.cancelRename,
                                          })
                                        }
                                        className="p-1 text-green-600"
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={actions.cancelRename}
                                        className="p-1 text-rose-500"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        actions.toggleFolder(folder, workspace)
                                      }
                                      className="flex-1 text-left min-w-0"
                                    >
                                      <span className="text-sm font-medium text-slate-700 truncate block">
                                        {folder.name}
                                      </span>
                                    </button>
                                  )}

                                  {folderTasks > 0 && (
                                    <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full">
                                      {folderTasks}
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openContextMenu(
                                        "folder",
                                        folder,
                                        workspace,
                                      );
                                    }}
                                    className="shrink-0 p-1 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 active:bg-slate-300/70 transition-all duration-200"
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5 text-slate-600" />
                                  </button>
                                </div>

                                {/* LISTS  */}
                                {isOpen && (
                                  <div className="ml-8 space-y-0.5 pb-1">
                                    {folder.lists?.map((list) => {
                                      const isActive =
                                        state.activeList === list._id;
                                      const isListEditing =
                                        state.editingItem?.id === list._id &&
                                        state.editingItem?.type === "list";

                                      const taskCount = list.tasks?.length || 0;

                                      if (isListEditing) {
                                        return (
                                          <div
                                            key={list._id}
                                            className="flex items-center gap-1 px-3 py-2"
                                          >
                                            <input
                                              value={state.editName}
                                              onChange={(e) =>
                                                actions.setEditName(
                                                  e.target.value,
                                                )
                                              }
                                              className="text-sm border rounded px-2 py-1 w-full"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleRename({
                                                    id: list._id,
                                                    type: "list",
                                                    name: state.editName,
                                                    workspaceId: workspace._id,
                                                    folderId: folder._id,
                                                    cancelRename:
                                                      actions.cancelRename,
                                                  });
                                                }
                                                if (e.key === "Escape") {
                                                  actions.cancelRename();
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() =>
                                                handleRename({
                                                  id: list._id,
                                                  type: "list",
                                                  name: state.editName,
                                                  workspaceId: workspace._id,
                                                  folderId: folder._id,
                                                  cancelRename:
                                                    actions.cancelRename,
                                                })
                                              }
                                              className="p-1 text-green-600 shrink-0"
                                            >
                                              <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={actions.cancelRename}
                                              className="p-1 text-rose-500 shrink-0"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div
                                          key={list._id}
                                          className="flex items-center gap-1 group/list"
                                        >
                                          <button
                                            onClick={() =>
                                              handleSelectList(
                                                list,
                                                workspace,
                                                folder,
                                              )
                                            }
                                            className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 min-w-0 ${
                                              isActive
                                                ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm shadow-blue-100/20"
                                                : "hover:bg-slate-50/80 text-slate-600"
                                            }`}
                                            title={list.name}
                                          >
                                            <div
                                              className={`relative shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                                            >
                                              <List className="w-4 h-4" />
                                            </div>

                                            <span
                                              className={`flex-1 truncate text-left font-medium min-w-0 max-w-[120px] sm:max-w-[180px] md:max-w-[220px] ${
                                                isActive
                                                  ? "text-blue-700"
                                                  : "text-slate-600"
                                              }`}
                                            >
                                              {list.name}
                                            </span>

                                            {taskCount > 0 && (
                                              <span
                                                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 ${
                                                  isActive
                                                    ? "bg-blue-200/60 text-blue-700"
                                                    : "bg-slate-100/80 text-slate-400"
                                                }`}
                                              >
                                                {taskCount}
                                              </span>
                                            )}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openContextMenu(
                                                "list",
                                                list,
                                                workspace,
                                              );
                                            }}
                                            className="shrink-0 p-1 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 active:bg-slate-300/70 transition-all duration-200 mr-1"
                                          >
                                            <MoreHorizontal className="h-3.5 w-3.5 text-slate-600" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50/30 to-transparent">
          <button
            onClick={handleOpenWorkspaceModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Workspace
          </button>
        </div>
      </div>

      {/* ===== Context Menu (Bottom Sheet) - خاص بالموبايل ===== */}
      {typeof document !== "undefined" &&
        contextMenu.open &&
        contextMenu.item &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={() => closeContextMenu()}
          >
            {/* الخلفية الغامقة */}
            <div
              style={{ position: "absolute", inset: 0 }}
              className="bg-black/50 backdrop-blur-[1px]"
              onClick={closeContextMenu}
            />

            {/* صفحة الخيارات */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "480px",
                pointerEvents: "auto",
              }}
              className="bg-white rounded-t-2xl shadow-2xl pb-[env(safe-area-inset-bottom)] animate-[fadeIn_0.15s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* مقبض صغير أعلى الصفحة */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1.5 rounded-full bg-slate-300" />
              </div>

              {/* اسم العنصر المحدد مع أيقونة */}
              <div className="px-4 pb-3 pt-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    {contextMenu.type === "workspace" && (
                      <Folder className="w-4 h-4" />
                    )}
                    {contextMenu.type === "folder" && (
                      <FolderOpen className="w-4 h-4" />
                    )}
                    {contextMenu.type === "list" && (
                      <List className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {contextMenu.item?.name}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {contextMenu.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* قائمة الخيارات */}
              <div className="py-1.5 max-h-[60vh] overflow-y-auto">
                {getContextMenuItems().map((menuItem, index) => {
                  // إضافة فاصل بين الخيارات
                  const isLast = index === getContextMenuItems().length - 1;
                  const isDelete = menuItem.danger;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        menuItem.onClick?.();
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-[15px] transition-all duration-150 ${
                        isDelete
                          ? "text-rose-600 active:bg-rose-50"
                          : "text-slate-700 active:bg-slate-50"
                      } ${!isLast ? "border-b border-slate-50" : ""}`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDelete
                            ? "bg-rose-50 text-rose-500"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <menuItem.icon
                          className={`w-4.5 h-4.5 ${
                            isDelete ? "text-rose-500" : "text-slate-500"
                          }`}
                        />
                      </div>
                      <span
                        className={`flex-1 text-left font-medium ${
                          isDelete ? "text-rose-600" : "text-slate-700"
                        }`}
                      >
                        {menuItem.label}
                      </span>
                      {!isDelete && (
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* زر إلغاء */}
              <div className="px-3 pt-2 pb-4 border-t border-slate-100">
                <button
                  onClick={closeContextMenu}
                  className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm active:bg-slate-200 transition-all duration-150 hover:bg-slate-200/80"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default FolderSidebarMobile;