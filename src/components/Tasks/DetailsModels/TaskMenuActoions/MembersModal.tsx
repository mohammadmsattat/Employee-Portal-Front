import { useMembersModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useMembersModal";
import { X, UserMinus } from "lucide-react";

const UpdateTaskMembersModal = ({ isOpen, onClose, entity, workspaceId,refetchTasks ,listId }) => {
  const {
    staff,
    selectedMembers,
    addMember,
    removeMember,
    handleSave,
  } = useMembersModal({
    isOpen,
    onClose,
    entity,
    workspaceId,
    listId,
    refetchTasks
  });

  const task = entity?.data;

  if (!isOpen || !task) return null;

  const selectedStaff = staff.filter((u) =>
    selectedMembers.includes(u._id)
  );

  const availableStaff = staff.filter(
    (u) => !selectedMembers.includes(u._id)
  );

  return (
    <div className="w-[320px] bg-white border rounded-2xl shadow-xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Task Members</h2>

        <button onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ADD MEMBER */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1">Add Member</p>

        <select
          className="w-full border rounded-md p-2 text-xs"
          onChange={(e) => {
            if (e.target.value) {
              addMember(e.target.value);
              e.target.value = "";
            }
          }}
        >
          <option value="">Select staff...</option>

          {availableStaff.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* CURRENT MEMBERS */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Current Members</p>

        <div className="flex flex-wrap gap-2">
          {selectedStaff.length === 0 && (
            <p className="text-xs text-slate-400">No members assigned</p>
          )}

          {selectedStaff.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs"
            >
              <span>{user.fullName}</span>

              <button
                onClick={() => removeMember(user._id)}
                className="text-red-500"
              >
                <UserMinus className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 text-xs rounded-md"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 py-2 text-xs rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskMembersModal;