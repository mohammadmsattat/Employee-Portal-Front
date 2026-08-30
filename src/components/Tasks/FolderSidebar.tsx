import {
  ChevronRight,
  Folder,
  FolderOpen,
  List,
  Package,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Plus,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";

import {
  canUpdateWorkspace,
  canDeleteWorkspace,
  canManageWorkspaceMembers,
  canCreateFolder,
  canUpdateFolder,
  canDeleteFolder,
  canManageFolderMembers,
  canCreateList,
  canUpdateList,
  canDeleteList,
  canManageListMembers,
} from "@/lib/permissions";

import { useFolderSidebar } from "@/hooks/Tasks/useFolderSidebar";
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";
import { HierarchyActionsMenu } from "./HierarchyActionsMenu";

/* =========================
   ICON SYSTEM
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
  const value = String(workspaceId);

  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }

  return WORKSPACE_ICONS[hash % WORKSPACE_ICONS.length];
};

const getWorkspaceColor = (workspaceId = "") => {
  const colors = [
    "text-blue-700",
    "text-green-700",
    "text-purple-700",
    "text-orange-700",
    "text-pink-700",
  ];

  let hash = 0;
  const value = String(workspaceId);

  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }

  return colors[hash % colors.length];
};

/* =========================
   SIDEBAR
========================= */

const FolderSidebar = ({
  onSelectList,
  onSelectContext,
  workspaceTree,
  refetchTree,

  onOpenWorkspaceModal,
  onOpenFolderModal,
  onOpenListModal,

  onOpenManageMembers,
  onOpenFolderMembers,
  onOpenListMembers,

  onOpenDeleteConfirm,
}) => {
  const { state, actions } = useFolderSidebar({
    onSelectList,
    onSelectContext,
  });

  /*
   * الحذف يتم التحكم به من TasksPage.
   * لذلك نحتاج هنا handleRename فقط.
   */
  const { handleRename } = useFolderSidebarController({
    refetchTree,
  });

  /* =========================
     MODAL HANDLERS
  ========================= */

  const handleOpenWorkspaceModal = () => {
    onOpenWorkspaceModal?.();
  };

  const handleOpenFolderModal = (workspace) => {
    onOpenFolderModal?.(workspace);
  };

  const handleOpenListModal = (workspace, folder) => {
    onOpenListModal?.(workspace, folder);
  };

  const handleOpenManageMembers = (workspace) => {
    onOpenManageMembers?.(workspace);
  };

  const handleOpenFolderMembers = (workspace, folder) => {
    onOpenFolderMembers?.(workspace, folder);
  };

  const handleOpenListMembers = (workspace, folder, list) => {
    onOpenListMembers?.(workspace, folder, list);
  };

  const handleOpenDeleteConfirm = (type, item, workspaceId, folderId) => {
    onOpenDeleteConfirm?.(type, item, workspaceId, folderId);
  };

  return (
    <div className="h-full w-fit min-w-[220px] rounded-xl border bg-white p-2">
      {/* TOP */}
      <div className="space-y-2 rounded-lg border bg-slate-50 px-3 py-3">
        <div className="text-sm font-semibold text-slate-700">
          {state.activeFolder
            ? state.activeFolder.name
            : state.activeWorkspace
              ? state.activeWorkspace.name
              : "Workspaces"}
        </div>

        {state.user?.canCreateWorkspace && (
          <button
            type="button"
            onClick={handleOpenWorkspaceModal}
            className="flex items-center gap-1 text-xs hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Workspace
          </button>
        )}
      </div>

      {/* TREE */}
      {workspaceTree?.data?.map((workspace) => {
        const workspaceRole =
          workspace?.role || workspace?.workspaceRole || null;

        const canRenameWorkspace = canUpdateWorkspace(workspaceRole);

        const canRemoveWorkspace = canDeleteWorkspace(workspaceRole);

        const canManageWorkspaceUsers =
          canManageWorkspaceMembers(workspaceRole);

        const canAddFolder = canCreateFolder(workspaceRole);

        const hasWorkspaceActions =
          canRenameWorkspace ||
          canRemoveWorkspace ||
          canManageWorkspaceUsers ||
          canAddFolder;

        const isWorkspaceOpen = state.openWorkspaces[workspace._id];

        const WorkspaceIcon = getWorkspaceIcon(workspace._id);

        const workspaceColor = getWorkspaceColor(workspace._id);

        const isWorkspaceMenuOpen = state.menuWorkspace?._id === workspace._id;

        const isWorkspaceEditing =
          state.editingItem?.id === workspace._id &&
          state.editingItem?.type === "workspace";

        return (
          <div key={workspace._id} className="relative">
            {/* WORKSPACE */}
            <div className="group/workspace flex items-center justify-between rounded-lg px-2 py-1 hover:bg-slate-100">
              <button
                type="button"
                onClick={() => actions.toggleWorkspace(workspace)}
                className="flex min-w-0 flex-1 items-center gap-1 text-left"
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isWorkspaceOpen ? "rotate-90" : ""
                  }`}
                />

                <div className={`rounded-md p-1.5 ${workspaceColor}`}>
                  <WorkspaceIcon className="h-5 w-5" />
                </div>

                {isWorkspaceEditing ? (
                  <div
                    className="flex w-full items-center gap-1"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      value={state.editName}
                      onChange={(event) =>
                        actions.setEditName(event.target.value)
                      }
                      onClick={(event) => event.stopPropagation()}
                      className="w-full rounded border px-1 text-sm"
                    />

                    <Check
                      className="h-4 w-4 cursor-pointer text-green-600"
                      onClick={(event) => {
                        event.stopPropagation();

                        handleRename({
                          id: workspace._id,
                          type: "workspace",
                          name: state.editName,
                          cancelRename: actions.cancelRename,
                        });
                      }}
                    />

                    <X
                      className="h-4 w-4 cursor-pointer text-red-500"
                      onClick={(event) => {
                        event.stopPropagation();
                        actions.cancelRename();
                      }}
                    />
                  </div>
                ) : (
                  <span className="truncate text-[15px] font-semibold leading-5 text-slate-800">
                    {workspace.name}
                  </span>
                )}
              </button>

              {hasWorkspaceActions && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      actions.setMenuWorkspace(
                        isWorkspaceMenuOpen ? null : workspace,
                      );
                    }}
                    className="rounded-md p-1 opacity-0 hover:bg-slate-200 group-hover/workspace:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  <HierarchyActionsMenu
                    isOpen={isWorkspaceMenuOpen}
                    type="workspace"
                    menuRef={state.menuRef}
                    onRename={
                      canRenameWorkspace
                        ? () =>
                            actions.startRename({
                              id: workspace._id,
                              name: workspace.name,
                              type: "workspace",
                            })
                        : undefined
                    }
                    onManageMembers={
                      canManageWorkspaceUsers
                        ? () => {
                            handleOpenManageMembers(workspace);

                            actions.setMenuWorkspace(null);
                          }
                        : undefined
                    }
                    onAddFolder={
                      canAddFolder
                        ? () => {
                            handleOpenFolderModal(workspace);

                            actions.setMenuWorkspace(null);
                          }
                        : undefined
                    }
                    onDelete={
                      canRemoveWorkspace
                        ? () => {
                            handleOpenDeleteConfirm(
                              "workspace",
                              workspace,
                              workspace._id,
                            );

                            actions.setMenuWorkspace(null);
                          }
                        : undefined
                    }
                  />
                </div>
              )}
            </div>

            {/* FOLDERS */}
            {isWorkspaceOpen && (
              <div className="ml-3 space-y-1">
                {workspace.folders?.map((folder) => {
                  const folderRole = folder?.role || folder?.folderRole || null;

                  const folderPermissionInput = {
                    workspaceRole,
                    folderRole,
                  };

                  const canRenameFolder = canUpdateFolder(
                    folderPermissionInput,
                  );

                  const canRemoveFolder = canDeleteFolder(
                    folderPermissionInput,
                  );

                  const canManageFolderUsers = canManageFolderMembers(
                    folderPermissionInput,
                  );

                  const canAddList = canCreateList(folderPermissionInput);

                  const hasFolderActions =
                    canRenameFolder ||
                    canRemoveFolder ||
                    canManageFolderUsers ||
                    canAddList;

                  const isFolderOpen = state.openFolders[folder._id];

                  const isFolderMenuOpen = state.menuFolder?._id === folder._id;

                  const isFolderEditing =
                    state.editingItem?.id === folder._id &&
                    state.editingItem?.type === "folder";

                  return (
                    <div key={folder._id} className="group/folder relative">
                      <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-slate-50">
                        <button
                          type="button"
                          onClick={() =>
                            actions.toggleFolder(folder, workspace)
                          }
                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        >
                          {isFolderOpen ? (
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Folder className="h-4 w-4 text-slate-500" />
                          )}

                          {isFolderEditing ? (
                            <div
                              className="flex items-center gap-1"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <input
                                value={state.editName}
                                onChange={(event) =>
                                  actions.setEditName(event.target.value)
                                }
                                onClick={(event) => event.stopPropagation()}
                                className="rounded border px-1 text-sm"
                              />

                              <Check
                                className="h-4 w-4 cursor-pointer text-green-600"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  handleRename({
                                    id: folder._id,
                                    folderId: folder._id,
                                    type: "folder",
                                    name: state.editName,
                                    workspaceId: workspace._id,
                                    cancelRename: actions.cancelRename,
                                  });
                                }}
                              />

                              <X
                                className="h-4 w-4 cursor-pointer text-red-500"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  actions.cancelRename();
                                }}
                              />
                            </div>
                          ) : (
                            <span className="truncate text-sm font-medium leading-5 text-slate-700">
                              {folder.name}
                            </span>
                          )}
                        </button>

                        {hasFolderActions && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                actions.setMenuFolder(
                                  isFolderMenuOpen ? null : folder,
                                );
                              }}
                              className="opacity-0 group-hover/folder:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                            <HierarchyActionsMenu
                              isOpen={isFolderMenuOpen}
                              type="folder"
                              menuRef={state.menuRef}
                              onRename={
                                canRenameFolder
                                  ? () =>
                                      actions.startRename({
                                        id: folder._id,
                                        name: folder.name,
                                        type: "folder",
                                      })
                                  : undefined
                              }
                              onAddList={
                                canAddList
                                  ? () => {
                                      handleOpenListModal(workspace, folder);

                                      actions.setMenuFolder(null);
                                    }
                                  : undefined
                              }
                              onManageFolderMembers={
                                canManageFolderUsers
                                  ? () => {
                                      handleOpenFolderMembers(
                                        workspace,
                                        folder,
                                      );

                                      actions.setMenuFolder(null);
                                    }
                                  : undefined
                              }
                              onDelete={
                                canRemoveFolder
                                  ? () => {
                                      handleOpenDeleteConfirm(
                                        "folder",
                                        folder,
                                        workspace._id,
                                      );

                                      actions.setMenuFolder(null);
                                    }
                                  : undefined
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* LISTS */}
                      {isFolderOpen && (
                        <div className="ml-6 border-l pl-3">
                          {folder.lists?.map((list) => {
                            const directListRole =
                              list?.role || list?.listRole || null;

                            const listPermissionInput = {
                              workspaceRole,
                              folderRole,
                              listRole: directListRole,
                            };

                            const canRenameList =
                              canUpdateList(listPermissionInput);

                            const canRemoveList =
                              canDeleteList(listPermissionInput);

                            const canManageListUsers =
                              canManageListMembers(listPermissionInput);

                            const hasListActions =
                              canRenameList ||
                              canRemoveList ||
                              canManageListUsers;

                            const isActive = state.activeList === list._id;

                            const isListMenuOpen =
                              state.menuList?._id === list._id;

                            const isListEditing =
                              state.editingItem?.id === list._id &&
                              state.editingItem?.type === "list";

                            return (
                              <div
                                key={list._id}
                                className="group/list relative"
                              >
                                <div className="flex items-center justify-between px-2 py-1 text-sm">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      actions.handleSelectList(
                                        list,
                                        workspace,
                                        folder,
                                      )
                                    }
                                    className={`
                                      flex min-w-0 flex-1 items-center gap-1.5
                                      rounded-md px-1.5 py-1 text-left
                                      text-[13px] text-slate-600 transition
                                      hover:bg-slate-50 hover:text-slate-800${isActive ? "bg-blue-50 font-medium text-blue-700" : ""}
                                            `}
                                  >
                                    {isListEditing ? (
                                      <div
                                        className="flex items-center gap-1"
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                      >
                                        <input
                                          value={state.editName}
                                          onChange={(event) =>
                                            actions.setEditName(
                                              event.target.value,
                                            )
                                          }
                                          onClick={(event) =>
                                            event.stopPropagation()
                                          }
                                          className="rounded border px-1 text-sm"
                                        />

                                        <Check
                                          className="h-4 w-4 cursor-pointer text-green-600"
                                          onClick={(event) => {
                                            event.stopPropagation();

                                            handleRename({
                                              id: list._id,
                                              type: "list",
                                              name: state.editName,
                                              workspaceId: workspace._id,
                                              folderId: folder._id,
                                              cancelRename:
                                                actions.cancelRename,
                                            });
                                          }}
                                        />

                                        <X
                                          className="h-4 w-4 cursor-pointer text-red-500"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            actions.cancelRename();
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <List className="h-3.5 w-3.5 shrink-0" />

                                        <span className="truncate text-[13px] font-normal leading-5">
                                          {list.name}
                                        </span>
                                      </>
                                    )}
                                  </button>

                                  {hasListActions && (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();

                                          actions.setMenuList(
                                            isListMenuOpen ? null : list,
                                          );
                                        }}
                                        className="opacity-0 group-hover/list:opacity-100"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </button>

                                      <HierarchyActionsMenu
                                        isOpen={isListMenuOpen}
                                        type="list"
                                        menuRef={state.menuRef}
                                        onRename={
                                          canRenameList
                                            ? () =>
                                                actions.startRename({
                                                  id: list._id,
                                                  name: list.name,
                                                  type: "list",
                                                })
                                            : undefined
                                        }
                                        onManageListMembers={
                                          canManageListUsers
                                            ? () => {
                                                handleOpenListMembers(
                                                  workspace,
                                                  folder,
                                                  list,
                                                );

                                                actions.setMenuList(null);
                                              }
                                            : undefined
                                        }
                                        onDelete={
                                          canRemoveList
                                            ? () => {
                                                handleOpenDeleteConfirm(
                                                  "list",
                                                  list,
                                                  workspace._id,
                                                  folder._id,
                                                );

                                                actions.setMenuList(null);
                                              }
                                            : undefined
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderSidebar;
