import { resolveEffectiveListRole } from "@/lib/permissions";
import { useEffect, useMemo, useRef, useState } from "react";

// عدّل المسار حسب مكان الملف عندك

export const useFolderSidebar = ({ onSelectList, onSelectContext }) => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

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
  const [membersFolder, setMembersFolder] = useState(null);
  const [membersList, setMembersList] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");

  const menuRef = useRef(null);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuWorkspace(null);
        setMenuFolder(null);
        setMenuList(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     TOGGLE WORKSPACE
  ========================= */

  const toggleWorkspace = (workspace) => {
    setOpenWorkspaces((previous) => ({
      ...previous,
      [workspace._id]: !previous[workspace._id],
    }));

    setActiveWorkspace(workspace);
    setActiveFolder(null);
  };

  /* =========================
     TOGGLE FOLDER
  ========================= */

  const toggleFolder = (folder, workspace) => {
    setOpenFolders((previous) => ({
      ...previous,
      [folder._id]: !previous[folder._id],
    }));

    setActiveWorkspace(workspace);
    setActiveFolder(folder);
  };

  /* =========================
     SELECT LIST
  ========================= */

  const handleSelectList = (list, workspace, folder) => {
    const workspaceRole = workspace?.role || workspace?.workspaceRole || null;

    const folderRole = folder?.role || folder?.folderRole || null;

    const directListRole = list?.role || list?.listRole || null;

    const effectiveListRole = resolveEffectiveListRole({
      workspaceRole,
      folderRole,
      listRole: directListRole,
    });

    const selectedList = {
      ...list,
      listRole: effectiveListRole,
      effectiveRole: effectiveListRole,
    };

    setActiveList(list._id);
    setActiveWorkspace(workspace);
    setActiveFolder(folder);

    /*
     * مهم:
     * أصبحنا نرسل workspace وfolder أيضاً.
     */
    onSelectList?.(selectedList, workspace, folder);

    onSelectContext?.({
      workspace,
      folder,
      list: selectedList,

      workspaceRole,
      folderRole,
      listRole: effectiveListRole,
    });

    setMenuWorkspace(null);
    setMenuFolder(null);
    setMenuList(null);
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
     CANCEL RENAME
  ========================= */

  const cancelRename = () => {
    setEditingItem(null);
    setEditName("");
  };

  /* =========================
     CONFIRM RENAME
  ========================= */

  const confirmRename = async (callback) => {
    if (!editingItem) return;

    const trimmedName = editName.trim();

    if (!trimmedName) return;

    await callback?.({
      id: editingItem.id,
      type: editingItem.type,
      name: trimmedName,
    });

    setEditingItem(null);
    setEditName("");
  };

  return {
    state: {
      user,

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
      membersFolder,
      membersList,

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
      setMembersFolder,
      setMembersList,

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
