import { X, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/Tasks/CreateModels/useCreateWorkspace";

/* =========================
   TYPES
========================= */

type WorkspaceRole = "viewer" | "member" | "manager";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* =========================
   COMPONENT
========================= */

export const AddWorkspaceModal = ({ isOpen, onClose }: Props) => {
  const {
    name,
    setName,
    members,
    selectedUser,
    setSelectedUser,
    role,
    setRole,
    addMember,
    removeMember,
    submit,
    isLoading,
    staffData,
  } = useCreateWorkspace({
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[32px]">
          {/* HEADER */}
          <div className="p-5 border-b border-slate-200/70">
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
              <Plus className="me-1 h-3 w-3" />
              New Workspace
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Create Workspace
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add members & permissions
            </p>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5">
            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">Workspace name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* MEMBERS */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Members
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select user</option>

                  {staffData?.data?.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName || u.email}
                    </option>
                  ))}
                </select>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value="viewer">viewer</option>
                  <option value="member">member</option>
                  <option value="manager">manager</option>
                </select>

                <Button
                  onClick={addMember}
                  className="h-10 w-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* LIST */}
              <div className="space-y-2 max-h-32 overflow-auto">
                {members?.map((m) => {
                  const user = staffData?.data?.find((u) => u._id === m.user);

                  return (
                    <div
                      key={m.user}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-3">
                        {/* AVATAR */}
                        <div className="h-9 w-9 rounded-full bg-blue-100/70 backdrop-blur flex items-center justify-center text-sm font-semibold text-blue-700 ring-1 ring-blue-200/50">
                          {(user?.fullName || user?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-800">
                            {user?.fullName || user?.email}
                          </span>

                          <span className="text-xs text-slate-500">
                            {m.role}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT ACTION */}
                      <button
                        onClick={() => removeMember(m.user)}
                        className="text-xl text-red-500 hover:text-red-600 align-self-center"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-5 border-t border-slate-200/70">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
