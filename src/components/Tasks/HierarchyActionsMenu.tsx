type HierarchyActionsMenuProps = {
  isOpen: boolean;
  type: "workspace" | "folder" | "list";

  onRename: () => void;
  onDelete: () => void;

  onAddFolder?: () => void;
  onAddList?: () => void;

  onManageMembers?: () => void;
  onManageListMembers?: () => void;
  onManageFolderMembers?: () => void;

  menuRef: any;
};

import {
  FolderPlus,
  ListTodo,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

export const HierarchyActionsMenu = ({
  isOpen,
  type,
  onRename,
  onDelete,
  onAddFolder,
  onAddList,
  onManageMembers,
  onManageFolderMembers,
  onManageListMembers,
  menuRef,
}: HierarchyActionsMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      {/* Header hint */}
      <div className="border-b bg-slate-50 px-3 py-2 text-[11px] text-slate-400">
        Actions
      </div>

      {/* BASIC ACTIONS */}
      <div className="p-1">
        <button
          onClick={onRename}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
        >
          <Pencil className="h-4 w-4 text-slate-500" />
          Rename
        </button>
      </div>

      {/* WORKSPACE ACTIONS */}
      {type === "workspace" && (
        <div className="border-t p-1">
          <button
            onClick={onManageMembers}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
          >
            <Users className="h-4 w-4 text-slate-500" />
            Manage Members
          </button>

          <button
            onClick={onAddFolder}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
          >
            <FolderPlus className="h-4 w-4 text-slate-500" />
            Add Folder
          </button>
        </div>
      )}

      {/* FOLDER ACTIONS */}
      {type === "folder" && (
        <div className="border-t p-1">
                <button
            onClick={onManageFolderMembers}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
          >
            <Users className="h-4 w-4 text-slate-500" />
            Manage Members
          </button>
          <button
            onClick={onAddList}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
          >
            <ListTodo className="h-4 w-4 text-slate-500" />
            Add List
          </button>
        </div>
      )}

      {/* LIST ACTIONS */}
      {type === "list" && (
        <div className="border-t p-1">
          <button
            onClick={onManageListMembers}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
          >
            <Users className="h-4 w-4 text-slate-500" />
            Manage Members
          </button>
        </div>
      )}

      {/* DELETE */}
      <div className="border-t p-1">
        <button
          onClick={onDelete}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};
