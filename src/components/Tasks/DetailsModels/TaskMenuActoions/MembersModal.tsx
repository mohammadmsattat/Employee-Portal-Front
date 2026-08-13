import MemberSearchSelect from "@/components/ui/MemberSearchSelect";
import { useMembersModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useMembersModal";
import { X, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";

const UpdateTaskMembersModal = ({
  isOpen,
  onClose,
  entity,
  workspaceId,
  refetchTasks,
  listId,
}) => {
  const { staff, selectedMembers, addMember, removeMember, handleSave } =
    useMembersModal({
      isOpen,
      onClose,
      entity,
      workspaceId,
      listId,
      refetchTasks,
    });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const task = entity?.data;

  if (!isOpen || !task) return null;

  const selectedStaff = staff.filter((u) => selectedMembers.includes(u._id));

  const availableStaff = staff.filter((u) => !selectedMembers.includes(u._id));

  return (
    <div className={`
      bg-white border rounded-2xl shadow-xl p-4
      ${isMobile ? "w-[280px]" : "w-[320px]"}
    `}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-semibold ${isMobile ? "text-sm" : "text-sm"}`}>
          Task Members
        </h2>

        <button 
          onClick={onClose}
          className={isMobile ? "p-1" : ""}
        >
          <X className={`${isMobile ? "w-5 h-5" : "h-4 w-4"}`} />
        </button>
      </div>

      {/* ADD MEMBER */}
      <div className="mb-3">
        <p className={`text-xs text-slate-500 mb-1 ${isMobile ? "text-sm" : "text-xs"}`}>
          Add Member
        </p>

        <MemberSearchSelect
          options={availableStaff || []}
          selectedValue={null}
          onChange={(id) => {
            if (id) {
              addMember(id);
            }
          }}
          placeholder="Search employee..."
        />
      </div>

      {/* CURRENT MEMBERS */}
      <div>
        <p className={`text-xs text-slate-500 mb-1.5 ${isMobile ? "text-sm" : "text-xs"}`}>
          Current Members
        </p>

        <div className="flex flex-wrap gap-2">
          {selectedStaff.length === 0 && (
            <p className="text-xs text-slate-400">No members assigned</p>
          )}

          {selectedStaff.map((user) => (
            <div
              key={user._id}
              className={`
                flex items-center gap-2 bg-slate-100 rounded-full text-xs
                ${isMobile ? "px-3.5 py-1.5 text-sm" : "px-3 py-1 text-xs"}
              `}
            >
              <span className={isMobile ? "text-sm" : "text-xs"}>
                {user.fullName}
              </span>

              <button
                onClick={() => removeMember(user._id)}
                className="text-red-500 hover:text-red-600 transition active:scale-90"
              >
                <UserMinus className={`${isMobile ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className={`mt-4 flex gap-2 ${isMobile ? "flex-col" : "flex-row"}`}>
        <button
          onClick={handleSave}
          className={`
            bg-blue-600 text-white rounded-md font-medium
            hover:bg-blue-700 transition active:scale-[0.98]
            ${isMobile ? "py-3 text-sm" : "flex-1 py-2 text-xs"}
          `}
        >
          Save
        </button>

        <button
          onClick={onClose}
          className={`
            bg-slate-100 text-slate-700 rounded-md font-medium
            hover:bg-slate-200 transition active:scale-[0.98]
            ${isMobile ? "py-3 text-sm" : "flex-1 py-2 text-xs"}
          `}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskMembersModal;