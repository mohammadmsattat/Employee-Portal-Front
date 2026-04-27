import { useMembersModal } from "@/hooks/Tasks/TaskMenuActions/useMembersModal";
import { X, UserMinus, Check } from "lucide-react";

const UpdateTaskMembersModal = ({ isOpen, onClose, task }) => {
  const {
    staff,
    selectedMembers,
    addMember,
    removeMember,
    handleSave,
    isLoading,
  } = useMembersModal({
    isOpen,
    onClose,
    task,
  });

  if (!isOpen || !task) return null;

  const selectedStaff = staff.filter((u) => selectedMembers.includes(u._id));

  const availableStaff = staff.filter((u) => !selectedMembers.includes(u._id));

  return (
    <div className="flex flex-col h-96 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-sm font-semibold text-slate-700">Task Members</h2>

        <button onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ADD MEMBER */}
      <div className="mt-4">
        <p className="text-xs text-slate-500 mb-2">Add Member</p>

        <div className="flex gap-2">
          <select
            className="w-full border rounded-lg p-2 text-xs"
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
      </div>
      {/* CURRENT MEMBERS */}
      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-2">Current Members</p>

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
                className="text-red-500 hover:text-red-600"
              >
                <UserMinus className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto flex justify-end gap-2 border-t pt-3">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs border rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskMembersModal;
