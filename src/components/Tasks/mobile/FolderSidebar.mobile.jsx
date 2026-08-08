// FolderSidebarMobile.jsx - نسخة محسنة مع Tailwind CSS

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  List,
  Plus,
  X,
  Menu,
  Home,
  ChevronLeft,
  Users,
  Settings,
  Trash2,
  Edit2,
  MoreVertical,
  Star,
  StarOff,
  Archive,
  Copy,
  Move,
  Shield,
  UserPlus,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { AddWorkspaceModal } from "../CreateModels/AddWorkspaceModal";
import { AddFolderModal } from "../CreateModels/AddFolderModal ";
import { AddListModal } from "../CreateModels/AddListModal";
import { useFolderSidebar } from "@/hooks/Tasks/useFolderSidebar";
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";
import { FolderMembersModal } from "../UpdatesModels/FolderMembersModal";
import { ManageMembersModal } from "../UpdatesModels/ManageMembersModal";
import { ListMembersModal } from "../UpdatesModels/ManageListMembersModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const FolderSidebarMobile = ({
  onSelectList,
  onSelectContext,
  workspaceTree,
  refetchTree,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    open: false,
    type: null,
    item: null,
    position: { x: 0, y: 0 },
  });

  const { state, actions } = useFolderSidebar({
    onSelectList,
    onSelectContext,
    refetchTree,
  });

  const {
    deleteState,
    setDeleteState,
    deleteLoading,
    handleRename,
    handleDelete,
    requestDelete,
  } = useFolderSidebarController({ refetchTree });

  const handleSelectList = (list, workspace, folder) => {
    actions.handleSelectList(list, workspace, folder);
    setIsOpen(false);
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />,
      archived: <Archive className="w-2.5 h-2.5 text-slate-400" />,
      pending: <Clock className="w-2.5 h-2.5 text-amber-500" />,
    };
    return icons[status] || icons.active;
  };

  return (
    <>
      {/* ===== زر فتح القائمة ===== */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden group"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </button>

      {/* ===== Overlay ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm z-40 lg:hidden animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <div
        className={`fixed top-0 left-0 h-full w-[88%] max-w-sm bg-white shadow-2xl z-50 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* ===== HEADER ===== */}
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
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* ===== محتوى السايدبار ===== */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
            {workspaceTree?.data?.map((workspace) => {
              const isWsOpen = state.openWorkspaces[workspace._id];
              const isWorkspaceEditing =
                state.editingItem?.id === workspace._id &&
                state.editingItem?.type === "workspace";

              const totalTasks = workspace.folders?.reduce((acc, folder) => {
                return acc + (folder.lists?.reduce((sum, list) => sum + (list.tasks?.length || 0), 0) || 0);
              }, 0) || 0;

              return (
                <div key={workspace._id} className="group/workspace">
                  {/* ===== WORKSPACE ===== */}
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
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      <div className="shrink-0">
                        {getStatusIcon(workspace.status)}
                      </div>

                      <button
                        onClick={() => actions.toggleWorkspace(workspace)}
                        className="flex-1 text-left min-w-0"
                      >
                        <span className="font-semibold text-sm text-slate-800 truncate block">
                          {workspace.name}
                        </span>
                      </button>

                      {totalTasks > 0 && (
                        <span className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {totalTasks}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({
                            open: true,
                            type: "workspace",
                            item: workspace,
                            position: { x: e.clientX, y: e.clientY },
                          });
                        }}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-slate-200/60 transition-all duration-200 opacity-0 group-hover/workspace:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {/* ===== FOLDERS ===== */}
                    {isWsOpen && (
                      <div className="ml-7 space-y-1 pb-2">
                        {workspace.folders?.map((folder) => {
                          const isFolderOpen = state.openFolders[folder._id];
                          const isFolderEditing =
                            state.editingItem?.id === folder._id &&
                            state.editingItem?.type === "folder";

                          const folderTasks = folder.lists?.reduce(
                            (sum, list) => sum + (list.tasks?.length || 0),
                            0
                          ) || 0;

                          return (
                            <div key={folder._id} className="group/folder">
                              <div
                                className={`relative rounded-lg transition-all duration-200 ${
                                  isFolderOpen ? "bg-blue-50/30" : "hover:bg-slate-50/50"
                                }`}
                              >
                                <div className="flex items-center gap-2 px-3 py-2.5">
                                  <button
                                    onClick={() =>
                                      actions.toggleFolder(folder, workspace)
                                    }
                                    className="shrink-0 p-0.5 hover:bg-slate-200/50 rounded-lg transition-all duration-200"
                                  >
                                    {isFolderOpen ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                    )}
                                  </button>

                                  <div className="shrink-0">
                                    {isFolderOpen ? (
                                      <FolderOpen className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Folder className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>

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

                                  {folderTasks > 0 && (
                                    <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full">
                                      {folderTasks}
                                    </span>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setContextMenu({
                                        open: true,
                                        type: "folder",
                                        item: folder,
                                        position: { x: e.clientX, y: e.clientY },
                                      });
                                    }}
                                    className="shrink-0 p-1 rounded-lg hover:bg-slate-200/60 transition-all duration-200 opacity-0 group-hover/folder:opacity-100"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                                  </button>
                                </div>

                                {/* ===== LISTS ===== */}
                                {isFolderOpen && (
                                  <div className="ml-8 space-y-0.5 pb-1">
                                    {folder.lists?.map((list) => {
                                      const isActive =
                                        state.activeList === list._id;
                                      const isListEditing =
                                        state.editingItem?.id === list._id &&
                                        state.editingItem?.type === "list";

                                      const taskCount = list.tasks?.length || 0;

                                      return (
                                        <button
                                          key={list._id}
                                          onClick={() =>
                                            handleSelectList(list, workspace, folder)
                                          }
                                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group/list ${
                                            isActive
                                              ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm shadow-blue-100/20"
                                              : "hover:bg-slate-50/80 text-slate-600"
                                          }`}
                                        >
                                          <div className={`relative ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                                            <List className="w-4 h-4" />
                                            {isActive && (
                                              <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                                            )}
                                          </div>
                                          <span className={`flex-1 truncate text-left font-medium ${
                                            isActive ? "text-blue-700" : "text-slate-600"
                                          }`}>
                                            {list.name}
                                          </span>
                                          {taskCount > 0 && (
                                            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 ${
                                              isActive 
                                                ? "bg-blue-200/60 text-blue-700" 
                                                : "bg-slate-100/80 text-slate-400"
                                            }`}>
                                              {taskCount}
                                            </span>
                                          )}
                                          {isActive && (
                                            <div className="shrink-0 w-1 h-6 rounded-full bg-blue-500" />
                                          )}
                                        </button>
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

          {/* ===== FOOTER ===== */}
          <div className="p-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50/30 to-transparent">
            <button
              onClick={() => actions.setOpenWorkspaceModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </button>
          </div>
        </div>
      </div>

      {/* ===== Context Menu ===== */}
      {contextMenu.open && contextMenu.item && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setContextMenu({ open: false, type: null, item: null, position: { x: 0, y: 0 } })} 
          />
          <div 
            className="absolute z-50 min-w-[180px] bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 overflow-hidden animate-[fadeIn_0.15s_ease-out]"
            style={{
              top: contextMenu.position.y + 8,
              right: 16,
              marginTop: "4px",
            }}
          >
            {[
              {
                icon: Edit2,
                label: "Rename",
                onClick: () => {
                  if (contextMenu.type === "workspace") {
                    actions.setEditingItem({ id: contextMenu.item._id, type: "workspace" });
                  } else if (contextMenu.type === "folder") {
                    actions.setEditingItem({ id: contextMenu.item._id, type: "folder" });
                  }
                },
              },
              {
                icon: Users,
                label: "Manage Members",
                onClick: () => {
                  if (contextMenu.type === "workspace") {
                    actions.setMembersWorkspace(contextMenu.item);
                  } else if (contextMenu.type === "folder") {
                    actions.setMembersFolder(contextMenu.item);
                  }
                },
              },
              {
                icon: UserPlus,
                label: "Add Member",
                onClick: () => {},
              },
              {
                icon: Copy,
                label: "Duplicate",
                onClick: () => {},
              },
              {
                icon: Archive,
                label: "Archive",
                onClick: () => {},
              },
              {
                icon: Trash2,
                label: "Delete",
                danger: true,
                onClick: () => {
                  requestDelete({
                    type: contextMenu.type,
                    id: contextMenu.item._id,
                    name: contextMenu.item.name,
                  });
                },
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  setContextMenu({ open: false, type: null, item: null, position: { x: 0, y: 0 } });
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 ${
                  item.danger 
                    ? "text-rose-600 hover:bg-rose-50" 
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.danger ? "text-rose-500" : "text-slate-400"}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== MODALS ===== */}
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
        list={state.membersList ? { _id: state.membersList } : null}
        workspace={state.activeWorkspace}
        folderId={state.activeFolder?._id}
      />
      <DeleteConfirmModal
        isOpen={deleteState.open}
        loading={deleteLoading}
        title={`Delete ${deleteState.type}`}
        description={`Are you sure you want to delete "${deleteState.name}"?`}
        stateName={deleteState.name}
        onClose={() => setDeleteState({ open: false })}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default FolderSidebarMobile;