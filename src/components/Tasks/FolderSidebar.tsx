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
  Trash2,
  Pencil,
} from "lucide-react";
import { useGetWorkspaceTreeQuery } from "@/rtk/Tasks/workspaceApi";

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

const user = { role: "ADMIN" };

const can = (role, action) => {
  const rules = {
    OWNER: ["create", "edit", "delete", "view"],
    ADMIN: ["create", "edit", "view"],
    EDITOR: ["edit", "view"],
    VIEWER: ["view"],
  };

  return rules[role]?.includes(action);
};

/* =========================
   MODALS
========================= */

const AddWorkspaceModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80 shadow-lg">
        <h2 className="font-bold mb-2">Add Workspace</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2"
          placeholder="Workspace name"
        />

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              console.log("create workspace", name);
              onClose();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AddFolderModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80 shadow-lg">
        <h2 className="font-bold mb-2">Add Folder</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2"
          placeholder="Folder name"
        />

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              console.log("create folder", name);
              onClose();
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AddListModal = ({ open, onClose }) => {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80 shadow-lg">
        <h2 className="font-bold mb-2">Add List</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2"
          placeholder="List name"
        />

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              console.log("create list", name);
              onClose();
            }}
            className="bg-purple-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   SIDEBAR
========================= */

const FolderSidebar = ({ onSelectList }) => {
  const { data, isLoading, error } = useGetWorkspaceTreeQuery();

  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [activeList, setActiveList] = useState(null);

  // 🔥 CONTEXT
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  /* MODALS STATE */
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

  const handleAdd = () => {
    if (activeFolder) {
      setOpenListModal(true);
    } else if (activeWorkspace) {
      setOpenFolderModal(true);
    } else {
      setOpenWorkspaceModal(true);
    }
  };

  const handleEdit = () => {
    if (activeFolder) {
      console.log("edit folder", activeFolder);
    } else if (activeWorkspace) {
      console.log("edit workspace", activeWorkspace);
    }
  };

  const handleDelete = () => {
    if (activeFolder) {
      console.log("delete folder", activeFolder);
    } else if (activeWorkspace) {
      console.log("delete workspace", activeWorkspace);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-400">Error</div>;

  return (
    <div className="w-fit h-full overflow-auto p-2 space-y-2 bg-white border border-slate-200 rounded-xl">

 {/* 🔥 TOP BAR */}
<div className="px-3 py-3 bg-slate-50 rounded-lg border space-y-2">

  {/* 🔹 CONTEXT NAME */}
  <div className="text-sm font-semibold text-slate-700">
    {activeFolder
      ? activeFolder.name
      : activeWorkspace
      ? activeWorkspace.name
      : "Workspaces"}
  </div>

  {/* 🔹 ACTIONS */}
  <div className="flex flex-wrap items-center gap-3 text-slate-600">

    {/* ✅ ALWAYS: ADD WORKSPACE */}
    {can(user.role, "create") && (
      <button
        onClick={() => setOpenWorkspaceModal(true)}
        className="flex items-center gap-1 text-xs hover:text-blue-600"
      >
        <Plus className="h-4 w-4" />
        <span>Workspace</span>
      </button>
    )}

    {/* 🔸 ADD FOLDER (only if workspace selected) */}
    {can(user.role, "create") && activeWorkspace && !activeFolder && (
      <button
        onClick={() => setOpenFolderModal(true)}
        className="flex items-center gap-1 text-xs hover:text-green-600"
      >
        <Folder className="h-4 w-4" />
        <span>Folder</span>
      </button>
    )}

    {/* 🔸 ADD LIST (only if folder selected) */}
    {can(user.role, "create") && activeFolder && (
      <button
        onClick={() => setOpenListModal(true)}
        className="flex items-center gap-1 text-xs hover:text-purple-600"
      >
        <List className="h-4 w-4" />
        <span>List</span>
      </button>
    )}

    {/* EDIT */}
    {can(user.role, "edit") && (activeWorkspace || activeFolder) && (
      <button
        onClick={handleEdit}
        className="flex items-center gap-1 text-xs hover:text-orange-600"
      >
        <Pencil className="h-4 w-4" />
        <span>Edit</span>
      </button>
    )}

    {/* DELETE */}
    {can(user.role, "delete") && (activeWorkspace || activeFolder) && (
      <button
        onClick={handleDelete}
        className="flex items-center gap-1 text-xs hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    )}

  </div>
</div>

      {/* TREE */}
      {data?.data?.map((workspace) => {
        const isWsOpen = openWorkspaces[workspace._id];
        const Icon = getWorkspaceIcon(workspace._id);
        const colorClass = getWorkspaceColor(workspace._id);

        return (
          <div key={workspace._id}>

            {/* WORKSPACE */}
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

                <span className="text-sm text-slate-800">
                  {workspace.name}
                </span>
              </button>
            </div>

            {/* FOLDERS */}
            {isWsOpen && (
              <div className="ml-3 space-y-1">
                {workspace.folders?.map((folder) => {
                  const isOpen = openFolders[folder._id];

                  return (
                    <div key={folder._id}>
                      <button
                        onClick={() => toggleFolder(folder, workspace)}
                        className="flex w-full items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-50"
                      >
                        {isOpen ? (
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Folder className="h-4 w-4 text-slate-500" />
                        )}
                        {folder.name}
                      </button>

                      {isOpen && (
                        <div className="ml-6 pl-3 border-l border-slate-200 space-y-1">
                          {folder.lists?.map((list) => {
                            const isActive = activeList === list._id;

                            return (
                              <button
                                key={list._id}
                                onClick={() =>
                                  handleSelectList(list, workspace, folder)
                                }
                                className={`flex w-full items-center gap-2 px-2 py-1 rounded-md text-sm
                                  ${
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

      {/* MODALS */}
      <AddWorkspaceModal
        open={openWorkspaceModal}
        onClose={() => setOpenWorkspaceModal(false)}
      />

      <AddFolderModal
        open={openFolderModal}
        onClose={() => setOpenFolderModal(false)}
      />

      <AddListModal
        open={openListModal}
        onClose={() => setOpenListModal(false)}
      />

    </div>
  );
};

export default FolderSidebar;