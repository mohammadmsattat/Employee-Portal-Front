import { useState } from "react";
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
} from "lucide-react";
import { AddWorkspaceModal } from "./CreateModels/AddWorkspaceModal";
import { AddFolderModal } from "./CreateModels/AddFolderModal ";
import { AddListModal } from "./CreateModels/AddListModal ";

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
  const str = String(workspaceId);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return WORKSPACE_ICONS[hash % WORKSPACE_ICONS.length];
};

const getWorkspaceColor = (id = "") => {
  const colors = [
    " text-blue-700",
    " text-green-700",
    " text-purple-700",
    " text-orange-700",
    " text-pink-700",
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

const FolderSidebar = ({ onSelectList, workspaceTree }) => {
  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [activeList, setActiveList] = useState(null);

  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);

  const toggleWorkspace = (workspace) => {
    setOpenWorkspaces((p) => ({
      ...p,
      [workspace._id]: !p[workspace._id],
    }));
    setActiveWorkspace(workspace);
    setActiveFolder(null);
  };

  const toggleFolder = (folder, workspace) => {
    setOpenFolders((p) => ({
      ...p,
      [folder._id]: !p[folder._id],
    }));
    setActiveWorkspace(workspace);
    setActiveFolder(folder);
  };

  const handleSelectList = (list, workspace, folder) => {
    setActiveList(list._id);
    setActiveWorkspace(workspace);
    setActiveFolder(folder);
    onSelectList?.(list);
  };

  return (
    <div className=" w-fit h-full overflow-auto p-2 bg-white border border-slate-200/70 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* TOP BAR */}
      <div className="px-3 py-3 bg-slate-50 rounded-lg border space-y-2">
        <div className="text-sm font-semibold text-slate-700">
          {activeFolder
            ? activeFolder.name
            : activeWorkspace
              ? activeWorkspace.name
              : "Workspaces"}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <button
            onClick={() => setOpenWorkspaceModal(true)}
            className="flex items-center gap-1 text-xs hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Workspace
          </button>

          {activeWorkspace && !activeFolder && (
            <button
              onClick={() => setOpenFolderModal(true)}
              className="flex items-center gap-1 text-xs hover:text-blue-600"
            >
              <Folder className="h-4 w-4" />
              Folder
            </button>
          )}

          {activeFolder && (
            <button
              onClick={() => setOpenListModal(true)}
              className="flex items-center gap-1 text-xs hover:text-blue-600"
            >
              <List className="h-4 w-4" />
              List
            </button>
          )}
        </div>
      </div>
      {/* TREE */}
      {workspaceTree?.data?.map((workspace) => {
        const isWsOpen = openWorkspaces[workspace._id];
        const Icon = getWorkspaceIcon(workspace._id);
        const colorClass = getWorkspaceColor(workspace._id);

        return (
          <div key={workspace._id}>
            <div className="flex items-center px-2 py-1 rounded-lg hover:bg-slate-100">
              <button
                onClick={() => toggleWorkspace(workspace)}
                className="flex items-center gap-1 w-full"
              >
                <ChevronRight
                  className={`h-4 w-4 transition ${
                    isWsOpen ? "rotate-90" : ""
                  }`}
                />

                <div className={`p-1.5 rounded-md ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-sm text-slate-800">{workspace.name}</span>
              </button>
            </div>

            {isWsOpen && (
              <div className="ml-3 space-y-1">
                {workspace.folders?.map((folder) => {
                  const isOpen = openFolders[folder._id];

                  return (
                    <div key={folder._id}>
                      <button
                        onClick={() => toggleFolder(folder, workspace)}
                        className="flex w-full items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-50"
                      >
                        {isOpen ? (
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Folder className="h-4 w-4 text-slate-500" />
                        )}
                        {folder.name}
                      </button>

                      {isOpen && (
                        <div className="ml-6 pl-3 border-l space-y-1">
                          {folder.lists?.map((list) => {
                            const isActive = activeList === list._id;

                            return (
                              <button
                                key={list._id}
                                onClick={() =>
                                  handleSelectList(list, workspace, folder)
                                }
                                className={`flex w-full items-center gap-2 px-2 py-1 rounded-md text-sm ${
                                  isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <List className="h-4 w-4" />
                                {list.name}
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
      {/* =========================
         MODALS (ONLY FIX HERE)
      ========================= */}
      <AddWorkspaceModal
        isOpen={openWorkspaceModal}
        onClose={() => setOpenWorkspaceModal(false)}
      />
      {/*  PASS workspaceId */}
      <AddFolderModal
        isOpen={openFolderModal}
        onClose={() => setOpenFolderModal(false)}
        workspaceId={activeWorkspace?._id}
      />
      {/*  PASS workspaceId + folderId */}
      <AddListModal
        isOpen={openListModal}
        onClose={() => setOpenListModal(false)}
        workspaceId={activeWorkspace?._id}
        folderId={activeFolder?._id}
      />
    </div>
  );
};

export default FolderSidebar;
