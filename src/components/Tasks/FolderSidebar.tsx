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

import { AddWorkspaceModal } from "./CreateModels/AddWorkspaceModal";
import { ManageMembersModal } from "./UpdatesModels/ManageMembersModal";
import { ListMembersModal } from "./UpdatesModels/ManageListMembersModal";
import { AddFolderModal } from "./CreateModels/AddFolderModal ";
import { AddListModal } from "./CreateModels/AddListModal ";

import { hasPermission } from "@/lib/permissions";
import { useFolderSidebar } from "@/hooks/Tasks/useFolderSidebar";
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";
import { HierarchyActionsMenu } from "./HierarchyActionsMenu";

import DeleteConfirmModal from "../DeleteConfirmModal";
import { FolderMembersModal } from "./UpdatesModels/FolderMembersModal";

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
   SIDEBAR
========================= */

const FolderSidebar = ({
  onSelectList,
  onSelectContext,
  workspaceTree,
  refetchTree,
}) => {
  const { state, actions } = useFolderSidebar({
    onSelectList,
    onSelectContext,
    refetchTree,
  });

  // folder-sidebar controller
  const {
    deleteState,
    setDeleteState,
    deleteLoading,
    handleRename,
    handleDelete,
    requestDelete,
  } = useFolderSidebarController({
    refetchTree,
  });

  const getEffectiveRole = ({
    workspaceRole,
    folderRole,
    listRole,
  }: {
    workspaceRole?: string;
    folderRole?: string;
    listRole?: string;
  }) => {
    // الأقرب يفوز

    if (listRole) {
      return listRole;
    }

    if (folderRole) {
      return folderRole;
    }

    if (workspaceRole) {
      return workspaceRole;
    }

    return "viewer";
  };

  return (
    <div className="w-fit h-full p-2 bg-white border rounded-xl min-w-[220px]">
      {/* TOP */}
      <div className="px-3 py-3 bg-slate-50 rounded-lg border space-y-2">
        <div className="text-sm font-semibold text-slate-700">
          {state.activeFolder
            ? state.activeFolder.name
            : state.activeWorkspace
              ? state.activeWorkspace.name
              : "Workspaces"}
        </div>

        <button
          onClick={() => actions.setOpenWorkspaceModal(true)}
          className="flex items-center gap-1 text-xs hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Workspace
        </button>
      </div>

      {/* TREE */}
      {workspaceTree?.data?.map((workspace) => {
        const isWsOpen = state.openWorkspaces[workspace._id];

        const Icon = getWorkspaceIcon(workspace._id);

        const colorClass = getWorkspaceColor(workspace._id);

        const isMenuOpen = state.menuWorkspace?._id === workspace._id;

        const isWorkspaceEditing =
          state.editingItem?.id === workspace._id &&
          state.editingItem?.type === "workspace";

        const canManageWorkspace =
          hasPermission(workspace.role, "update:workspace") ||
          hasPermission(workspace.role, "manage:members");

        const canManageFolder =
          canManageWorkspace || hasPermission(workspace.role, "update:folder");

        return (
          <div key={workspace._id} className="relative">
            {/* WORKSPACE */}
            <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-100 group/workspace">
              <button
                onClick={() => actions.toggleWorkspace(workspace)}
                className="flex items-center gap-1 flex-1 text-left"
              >
                <ChevronRight
                  className={`h-4 w-4 ${isWsOpen ? "rotate-90" : ""}`}
                />

                <div className={`p-1.5 rounded-md ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {isWorkspaceEditing ? (
                  <div className="flex items-center gap-1 w-full">
                    <input
                      value={state.editName}
                      onChange={(e) => actions.setEditName(e.target.value)}
                      className="text-sm border rounded px-1 w-full"
                    />

                    <Check
                      className="h-4 w-4 text-green-600 cursor-pointer"
                      onClick={() =>
                        handleRename({
                          workspaceId: workspace._id,
                          id: workspace._id,
                          type: "workspace",
                          name: state.editName,
                          cancelRename: actions.cancelRename,
                        })
                      }
                    />

                    <X
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      onClick={actions.cancelRename}
                    />
                  </div>
                ) : (
                  <span className="text-sm truncate">{workspace.name}</span>
                )}
              </button>

              {canManageWorkspace && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      actions.setMenuWorkspace(isMenuOpen ? null : workspace);
                    }}
                    className="opacity-0 group-hover/workspace:opacity-100 p-1 rounded-md hover:bg-slate-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  <HierarchyActionsMenu
                    isOpen={isMenuOpen}
                    type="workspace"
                    menuRef={state.menuRef}
                    onRename={() =>
                      actions.startRename({
                        id: workspace._id,
                        name: workspace.name,
                        type: "workspace",
                      })
                    }
                    onManageMembers={() => {
                      actions.setMembersWorkspace(workspace);

                      actions.setMenuWorkspace(null);
                    }}
                    onAddFolder={() => {
                      actions.setOpenFolderModal(true);

                      actions.setActiveWorkspace(workspace);

                      actions.setMenuWorkspace(null);
                    }}
                    onDelete={() =>
                      requestDelete({
                        type: "workspace",
                        item: workspace,
                        workspaceId: workspace._id,
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* FOLDERS */}
            {isWsOpen && (
              <div className="ml-3 space-y-1">
                {workspace.folders?.map((folder) => {
                  const isOpen = state.openFolders[folder._id];

                  const isFolderMenuOpen = state.menuFolder?._id === folder._id;

                  const isFolderEditing =
                    state.editingItem?.id === folder._id &&
                    state.editingItem?.type === "folder";

                  return (
                    <div key={folder._id} className="relative group/folder">
                      <div className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50">
                        <button
                          onClick={() =>
                            actions.toggleFolder(folder, workspace)
                          }
                          className="flex items-center gap-2"
                        >
                          {isOpen ? (
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Folder className="h-4 w-4 text-slate-500" />
                          )}

                          {isFolderEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                value={state.editName}
                                onChange={(e) =>
                                  actions.setEditName(e.target.value)
                                }
                                className="text-sm border rounded px-1"
                              />

                              <Check
                                className="h-4 w-4 text-green-600 cursor-pointer"
                                onClick={() =>
                                  handleRename({
                                    id: folder._id,
                                    type: "folder",
                                    name: state.editName,
                                    workspaceId: workspace._id,
                                    cancelRename: actions.cancelRename,
                                  })
                                }
                              />

                              <X
                                className="h-4 w-4 text-red-500 cursor-pointer"
                                onClick={actions.cancelRename}
                              />
                            </div>
                          ) : (
                            folder.name
                          )}
                        </button>

                        {canManageFolder && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

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
                              onRename={() =>
                                actions.startRename({
                                  id: folder._id,
                                  name: folder.name,
                                  type: "folder",
                                })
                              }
                              onAddList={() => {
                                actions.setActiveFolder(folder);

                                actions.setOpenListModal(true);

                                actions.setMenuFolder(null);
                              }}
                              onManageFolderMembers={() => {
                                actions.setMembersFolder(folder);
                                actions.setMenuFolder(null);
                              }}
                              onDelete={() =>
                                requestDelete({
                                  type: "folder",
                                  item: folder,
                                  workspaceId: workspace._id,
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* LISTS */}
                      {isOpen && (
                        <div className="ml-6 border-l pl-3">
                          {folder.lists?.map((list) => {
                            const isActive = state.activeList === list._id;

                            const isListMenuOpen =
                              state.menuList?._id === list._id;

                            const isListEditing =
                              state.editingItem?.id === list._id &&
                              state.editingItem?.type === "list";

                       const effectiveRole = getEffectiveRole({
  workspaceRole: workspace.role,
  folderRole: folder.role,
  listRole: list.listRole,
});

const canManageList = hasPermission(
  effectiveRole,
  "update:list",
);
                            return (
                              <div
                                key={list._id}
                                className="relative group/list"
                              >
                                <div className="flex items-center justify-between px-2 py-1 text-sm">
                                  <button
                                    onClick={() =>
                                      actions.handleSelectList(
                                        {
                                          ...list,
                                          listRole:
                                            list.listRole || workspace.role,
                                        },
                                        workspace,
                                        folder,
                                      )
                                    }
                                    className={`${
                                      isActive ? "text-blue-700 bg-blue-50" : ""
                                    }`}
                                  >
                                    {isListEditing ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          value={state.editName}
                                          onChange={(e) =>
                                            actions.setEditName(e.target.value)
                                          }
                                          className="text-sm border rounded px-1"
                                        />

                                        <Check
                                          className="h-4 w-4 text-green-600 cursor-pointer"
                                          onClick={() =>
                                            handleRename({
                                              id: list._id,
                                              type: "list",
                                              name: state.editName,
                                              workspaceId: workspace._id,
                                              cancelRename:
                                                actions.cancelRename,
                                            })
                                          }
                                        />

                                        <X
                                          className="h-4 w-4 text-red-500 cursor-pointer"
                                          onClick={actions.cancelRename}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <List className="h-4 w-4 inline mr-1" />
                                        {list.name}
                                      </>
                                    )}
                                  </button>

                                  {canManageList && (
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();

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
                                        onRename={() =>
                                          actions.startRename({
                                            id: list._id,
                                            name: list.name,
                                            type: "list",
                                          })
                                        }
                                        onManageListMembers={() => {
                                          actions.setMembersList(list._id);

                                          actions.setMenuList(null);
                                        }}
                                        onDelete={() =>
                                          requestDelete({
                                            type: "list",
                                            item: list,
                                            workspaceId: workspace._id,
                                          })
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

      {/* MODALS */}

      <AddWorkspaceModal
        isOpen={state.openWorkspaceModal}
        onClose={() => actions.setOpenWorkspaceModal(false)}
      />

      <AddFolderModal
        isOpen={state.openFolderModal}
        onClose={() => actions.setOpenFolderModal(false)}
        workspaceId={state.activeWorkspace?._id}
        refetchTree={refetchTree}
      />

      <AddListModal
        isOpen={state.openListModal}
        onClose={() => actions.setOpenListModal(false)}
        workspaceId={state.activeWorkspace?._id}
        folderId={state.activeFolder?._id}
        refetchTree={refetchTree}
      />

      <ManageMembersModal
        isOpen={!!state.membersWorkspace}
        onClose={() => actions.setMembersWorkspace(null)}
        workspace={state.membersWorkspace}
      />
      <FolderMembersModal
        isOpen={!!state.membersFolder}
        folder={state.membersFolder}
        workspace={state.activeWorkspace}
        onClose={() => actions.setMembersFolder(null)}
      />
      <ListMembersModal
        isOpen={!!state.membersList}
        onClose={() => actions.setMembersList(null)}
        list={
          state.membersList
            ? {
                _id: state.membersList,
              }
            : null
        }
        workspace={state.activeWorkspace}
        folderId={state.activeFolder?._id}
      />

      <DeleteConfirmModal
        isOpen={deleteState.open}
        loading={deleteLoading}
        title={`Delete ${deleteState.type}`}
        description={`Are you sure you want to delete "${deleteState.name}"? This action cannot be undone.`}
        onClose={() => setDeleteState({ open: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FolderSidebar;
