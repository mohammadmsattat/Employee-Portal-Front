import { useEffect, useMemo, useState } from "react";

import { X, UserMinus, Users, Loader2 } from "lucide-react";

import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

import { useMembersModal } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/useMembersModal";

interface UpdateTaskMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: any;
  workspaceId?: string;
  listId: string;
  refetchTasks?: () => unknown;
}

const UpdateTaskMembersModal = ({
  isOpen,
  onClose,
  entity,
  workspaceId,
  refetchTasks,
  listId,
}: UpdateTaskMembersModalProps) => {
  const {
    staff,
    staffLoading,
    staffError,

    selectedMembers,
    addMember,
    removeMember,

    handleSave,
    isSaving,
  } = useMembersModal({
    isOpen,
    onClose,
    entity,
    workspaceId,
    listId,
    refetchTasks,
  });

  const [isMobile, setIsMobile] = useState(false);

  /*
   * يدعم الشكلين:
   *
   * entity = task
   *
   * أو:
   *
   * entity = {
   *   type,
   *   data
   * }
   */
  const task = entity?.data || entity;

  const isSubTask = entity?.type === "subtask" || Boolean(task?.task);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const staffList = useMemo(() => {
    return Array.isArray(staff) ? staff : [];
  }, [staff]);

  const selectedMemberIds = useMemo(() => {
    return Array.isArray(selectedMembers) ? selectedMembers : [];
  }, [selectedMembers]);

  const selectedStaff = useMemo(() => {
    return staffList.filter((user) => selectedMemberIds.includes(user._id));
  }, [staffList, selectedMemberIds]);

  const availableStaff = useMemo(() => {
    return staffList.filter((user) => !selectedMemberIds.includes(user._id));
  }, [staffList, selectedMemberIds]);

  if (!isOpen || !task?._id) {
    return null;
  }

  const modalTitle = isSubTask ? "Subtask Members" : "Task Members";

  return (
    <div
      className={`
        rounded-2xl border border-slate-200
        bg-white p-4 shadow-xl
        ${isMobile ? "w-[280px]" : "w-[320px]"}
      `}
    >
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />

            <h2 className="truncate text-sm font-semibold text-slate-800">
              {modalTitle}
            </h2>
          </div>

          <p className="mt-1 truncate text-[11px] text-slate-400">
            {task.title || "Untitled"}
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          aria-label="Close members modal"
          className={`
            flex shrink-0 items-center justify-center
            rounded-lg text-slate-500 transition
            hover:bg-slate-100 hover:text-slate-700
            disabled:cursor-not-allowed disabled:opacity-50
            ${isMobile ? "h-9 w-9" : "h-8 w-8"}
          `}
        >
          <X className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      </div>

      {/* STAFF LOADING */}
      {staffLoading && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-5 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading employees...
        </div>
      )}

      {/* STAFF ERROR */}
      {!staffLoading && staffError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-xs text-red-600">
          Failed to load employees.
        </div>
      )}

      {/* CONTENT */}
      {!staffLoading && !staffError && (
        <>
          {/* ADD MEMBER */}
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Add Member
            </p>

            {availableStaff.length > 0 ? (
              <div className={isSaving ? "pointer-events-none opacity-60" : ""}>
                <MemberSearchSelect
                  options={availableStaff}
                  selectedValue={null}
                  onChange={(userId) => {
                    if (!userId || isSaving) return;

                    addMember(userId);
                  }}
                  placeholder="Search employee..."
                />
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-400">
                No additional employees available.
              </div>
            )}
          </div>

          {/* CURRENT MEMBERS */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">
                Current Members
              </p>

              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                {selectedStaff.length}
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto">
              {selectedStaff.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">
                  No members assigned.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.map((user) => (
                    <div
                      key={user._id}
                      className={`
                        flex items-center gap-2 rounded-full
                        bg-slate-100 text-slate-700
                        ${
                          isMobile
                            ? "px-3.5 py-1.5 text-sm"
                            : "px-3 py-1 text-xs"
                        }
                      `}
                    >
                      <span className="max-w-[180px] truncate">
                        {user.fullName || user.email || "Employee"}
                      </span>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          if (isSaving) return;

                          removeMember(user._id);
                        }}
                        aria-label={`Remove ${user.fullName || "member"}`}
                        className="
                          text-red-500 transition
                          hover:text-red-600 active:scale-90
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <UserMinus
                          className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ACTIONS */}
      <div
        className={`
          mt-5 flex gap-2
          ${isMobile ? "flex-col" : "flex-row"}
        `}
      >
        <button
          type="button"
          disabled={isSaving || staffLoading || Boolean(staffError)}
          onClick={handleSave}
          className={`
            rounded-md bg-blue-600 font-medium text-white
            transition hover:bg-blue-700 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-60
            ${isMobile ? "py-3 text-sm" : "flex-1 py-2 text-xs"}
          `}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          className={`
            rounded-md bg-slate-100 font-medium text-slate-700
            transition hover:bg-slate-200 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-60
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
