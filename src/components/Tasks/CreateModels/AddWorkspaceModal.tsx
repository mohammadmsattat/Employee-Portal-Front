import { useState } from "react";
import { X, Plus, Users, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateWorkspace } from "@/hooks/Tasks/CreateModels/useCreateWorkspace";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

type WorkspaceRole = "viewer" | "member" | "manager";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
    updateMember,
  } = useCreateWorkspace({ onClose });

  const [notifMap, setNotifMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleNotif = (id: string) => {
    const newValue = !(notifMap[id] ?? true);

    setNotifMap((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    updateMember(id, {
      notificationEnabled: newValue,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="rounded-[32px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {/* HEADER */}
          <div className="relative border-b p-5">
            <div className="flex items-center gap-2 text-blue-700">
              <Plus className="h-4 w-4" />
              New Workspace
            </div>

            <h3 className="mt-2 text-xl font-bold">Create Workspace</h3>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="space-y-5 p-5">
            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">Workspace name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <label className="text-xs text-slate-500 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Members
            </label>

            <div className="flex gap-2">
              <MemberSearchSelect
                options={staffData?.data || []}
                selectedValue={selectedUser}
                onChange={setSelectedUser}
                placeholder="Search employee..."
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                className=" rounded-xl border border-slate-200 bg-white px-3py-2.5text-sm outline-none transition focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
            <div className="space-y-3 max-h-[22em] overflow-auto">
              {members?.map((m) => {
                const user = staffData?.data?.find((u) => u._id === m.user);

                const id = m?.user;

                const displayName =
                  user?.fullName || user?.email || "Unknown User";

                const initial = displayName.charAt(0).toUpperCase();

                const isNotif = m?.notificationEnabled ?? true;

                return (
                  <div
                    key={id}
                    className="group relative flex justify-between rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    {/* LEFT */}
                    <div className="flex gap-3 min-w-0">
                      {/* AVATAR (FIRST LETTER FIXED) */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {displayName}
                        </div>

                        {/* EMAIL UNDER NAME */}
                        <div className="text-xs text-slate-500 truncate">
                          {user?.email || "No email"}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT HOVER PANEL */}
                    <div className="flex items-center gap-2 opacity-100  transition">
                      {/* NOTIFICATION */}
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <Switch
                          checked={isNotif}
                          onCheckedChange={() => toggleNotif(id)}
                        />
                      </div>

                      {/* ROLE CHANGE */}
                      <select
                        value={m.role}
                        onChange={(e) =>
                          updateMember(id, {
                            role: e.target.value as WorkspaceRole,
                          })
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-2 text-xs font-medium text-slate-700 transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                      >
                        <option value="viewer">viewer</option>
                        <option value="member">member</option>
                        <option value="manager">manager</option>
                      </select>

                      {/* DELETE */}
                      <button
                        onClick={() => removeMember(id)}
                        className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end border-t p-5 gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>

            <Button onClick={submit} disabled={isLoading}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
