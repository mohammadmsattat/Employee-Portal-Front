// FolderSidebar.mobile.jsx
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  List,
  Plus,
  X,
  Menu,
  Home,
  ChevronLeft,
} from "lucide-react";
import { AddWorkspaceModal } from "../CreateModels/AddWorkspaceModal";
import { AddFolderModal } from "../CreateModels/AddFolderModal ";
import { AddListModal } from "../CreateModels/AddListModal";
import { useFolderSidebar } from "@/hooks/Tasks/useFolderSidebar";
import { useFolderSidebarController } from "@/hooks/Tasks/useFolderSidebarController";
import { FolderMembersModal } from "../UpdatesModels/FolderMembersModal";
import { ManageMembersModal } from "../UpdatesModels/ManageMembersModal";
import { ListMembersModal } from "../UpdatesModels/ManageListMembersModal";
import  DeleteConfirmModal  from "@/components/DeleteConfirmModal";

const FolderSidebarMobile = ({
  onSelectList,
  onSelectContext,
  workspaceTree,
  refetchTree,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

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

  // إغلاق الدراور عند اختيار قائمة
  const handleSelectList = (list, workspace, folder) => {
    actions.handleSelectList(list, workspace, folder);
    setIsOpen(false);
  };

  return (
    <>
      {/* زر فتح القائمة - يظهر فقط في الموبايل */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - تنزلق من اليسار */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-4">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Workspaces</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* محتوى السايدبار (نفس المحتوى ولكن بتصميم مناسب للموبايل) */}
          <div className="space-y-2">
            {workspaceTree?.data?.map((workspace) => {
              const isWsOpen = state.openWorkspaces[workspace._id];
              const isWorkspaceEditing =
                state.editingItem?.id === workspace._id &&
                state.editingItem?.type === "workspace";

              return (
                <div key={workspace._id} className="space-y-1">
                  {/* WORKSPACE */}
                  <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50">
                    <button
                      onClick={() => actions.toggleWorkspace(workspace)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          isWsOpen ? "rotate-90" : ""
                        }`}
                      />
                      <span className="font-medium text-sm truncate">
                        {workspace.name}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.setMenuWorkspace(
                          state.menuWorkspace?._id === workspace._id
                            ? null
                            : workspace
                        );
                      }}
                      className="p-1 rounded-md hover:bg-slate-200"
                    >
                      <span className="text-xs text-slate-400">•••</span>
                    </button>
                  </div>

                  {/* FOLDERS */}
                  {isWsOpen && (
                    <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-3">
                      {workspace.folders?.map((folder) => {
                        const isOpen = state.openFolders[folder._id];
                        const isFolderEditing =
                          state.editingItem?.id === folder._id &&
                          state.editingItem?.type === "folder";

                        return (
                          <div key={folder._id} className="space-y-1">
                            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50">
                              <button
                                onClick={() =>
                                  actions.toggleFolder(folder, workspace)
                                }
                                className="flex items-center gap-2 flex-1 text-left"
                              >
                                {isOpen ? (
                                  <FolderOpen className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Folder className="h-4 w-4 text-slate-500" />
                                )}
                                <span className="text-sm truncate">
                                  {folder.name}
                                </span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actions.setMenuFolder(
                                    state.menuFolder?._id === folder._id
                                      ? null
                                      : folder
                                  );
                                }}
                                className="p-1 rounded-md hover:bg-slate-200"
                              >
                                <span className="text-xs text-slate-400">
                                  •••
                                </span>
                              </button>
                            </div>

                            {/* LISTS */}
                            {isOpen && (
                              <div className="ml-6 space-y-1">
                                {folder.lists?.map((list) => {
                                  const isActive =
                                    state.activeList === list._id;
                                  const isListEditing =
                                    state.editingItem?.id === list._id &&
                                    state.editingItem?.type === "list";

                                  return (
                                    <button
                                      key={list._id}
                                      onClick={() =>
                                        handleSelectList(list, workspace, folder)
                                      }
                                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                                        isActive
                                          ? "bg-blue-50 text-blue-700"
                                          : "hover:bg-slate-50"
                                      }`}
                                    >
                                      <List className="h-4 w-4" />
                                      <span className="truncate">
                                        {list.name}
                                      </span>
                                    </button>
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
        </div>
      </div>

      {/* MODALS (نفسها) */}
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