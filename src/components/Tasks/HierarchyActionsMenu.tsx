type HierarchyActionsMenuProps = {
  isOpen: boolean;
  type: "workspace" | "folder" | "list";

  onRename: () => void;
  onDelete: () => void;

  onAddFolder?: () => void;
  onAddList?: () => void;

  onManageMembers?: () => void;
  onManageListMembers?: () => void;

  menuRef: any;
};

export const HierarchyActionsMenu = ({
  isOpen,
  type,
  onRename,
  onDelete,
  onAddFolder,
  onAddList,
  onManageMembers,
  onManageListMembers,
  menuRef,
}: HierarchyActionsMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-2 w-52 rounded-2xl border bg-white shadow-xl z-50 overflow-hidden"
    >
      {/* Header hint */}
      <div className="px-3 py-2 text-[11px] text-slate-400 bg-slate-50 border-b">
        Actions
      </div>

      {/* BASIC ACTIONS */}
      <div className="p-1">
        <button
          onClick={onRename}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition"
        >
          ✏️ Rename
        </button>
      </div>

      {/* WORKSPACE ACTIONS */}
      {type === "workspace" && (
        <div className="p-1 border-t">
          <button
            onClick={onManageMembers}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition"
          >
            👥 Manage Members
          </button>

          <button
            onClick={onAddFolder}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition"
          >
            📁 Add Folder
          </button>
        </div>
      )}

      {/* FOLDER ACTIONS */}
      {type === "folder" && (
        <div className="p-1 border-t">
          <button
            onClick={onAddList}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition"
          >
            📋 Add List
          </button>
        </div>
      )}

      {/* LIST ACTIONS */}
      {type === "list" && (
        <div className="p-1 border-t">
          <button
            onClick={onManageListMembers}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition"
          >
            👤 Manage Members
          </button>
        </div>
      )}
    </div>
  );
};
