import { useEffect, useRef, useState } from "react";

export const useFolderSidebar = ({
  onSelectList,
  onSelectContext,
  refetchTree,
}) => {
  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [openFolders, setOpenFolders] = useState({});

  const [activeList, setActiveList] = useState(null);

  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);

  const [menuWorkspace, setMenuWorkspace] = useState(null);
  const [menuFolder, setMenuFolder] = useState(null);
  const [menuList, setMenuList] = useState(null);

  const [membersWorkspace, setMembersWorkspace] = useState(null);
  const [membersList, setMembersList] = useState(null);

  const [membersFolder, setMembersFolder] = useState(null);

  /**
   * EDITING STATE
   */
  const [editingItem, setEditingItem] = useState(null);

  /**
   * {
   *   id,
   *   type: workspace | folder | list
   * }
   */

  const [editName, setEditName] = useState("");

  const menuRef = useRef(null);

  /* OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuWorkspace(null);
        setMenuFolder(null);
        setMenuList(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     TOGGLES
  ========================= */

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

  /* =========================
     LIST SELECT
  ========================= */

  const handleSelectList = (list, workspace, folder) => {
    setActiveList(list._id);

    setActiveWorkspace(workspace);
    setActiveFolder(folder);

    onSelectList?.(list);

    onSelectContext?.({
      list,
      workspace,
      folder,
      listRole: list.listRole || workspace.role,
    });
  };

  /* =========================
     START RENAME
  ========================= */

  const startRename = ({ id, name, type }) => {
    setEditingItem({
      id,
      type,
    });

    setEditName(name);

    setMenuWorkspace(null);
    setMenuFolder(null);
    setMenuList(null);
  };

  /* =========================
     STOP RENAME
  ========================= */

  const cancelRename = () => {
    setEditingItem(null);
    setEditName("");
  };

  /* =========================
     CONFIRM
  ========================= */

  const confirmRename = async (callback) => {
    if (!editingItem || !editName.trim()) return;

    await callback?.({
      id: editingItem.id,
      type: editingItem.type,
      name: editName.trim(),
    });

    setEditingItem(null);
    setEditName("");
  };

  return {
    state: {
      openWorkspaces,
      openFolders,

      activeList,
      activeWorkspace,
      activeFolder,

      openWorkspaceModal,
      openFolderModal,
      openListModal,

      menuWorkspace,
      menuFolder,
      menuList,

      membersWorkspace,
      membersList,
      membersFolder,

      editingItem,
      editName,

      menuRef,
    },

    actions: {
      setOpenWorkspaceModal,
      setOpenFolderModal,
      setOpenListModal,

      setMenuWorkspace,
      setMenuFolder,
      setMenuList,

      setMembersWorkspace,
      setMembersList,
      setMembersFolder,

      setEditName,

      toggleWorkspace,
      toggleFolder,
      handleSelectList,

      startRename,
      cancelRename,
      confirmRename,

      setActiveWorkspace,
      setActiveFolder,
    },
  };
};
