import { useEffect } from "react";
import { X, FolderPlus, Users, Plus, Bell, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

import {
  useCreateFolder,
  type WorkspaceRole,
} from "@/hooks/Tasks/CreateModels/useCreateFolder";

export const AddFolderModal = ({
  isOpen,
  onClose,
  workspaceId,
  refetchTree,
}) => {
  const {
    name,
    setName,
    visibility,
    setVisibility,
    members,
    selectedUser,
    setSelectedUser,
    role,
    setRole,
    staffData,
    addMember,
    removeMember,
    updateMember,
    submit,
    isLoading,
    reset,
  } = useCreateFolder({
    workspaceId,
    onClose,
    refetchTree,
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-lg">
        <div className="max-h-[88vh] rounded-[32px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {/* HEADER */}
          <div className="relative border-b border-slate-200/70 p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <FolderPlus className="h-4 w-4" />
              New Folder
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Create Folder
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Organize tasks inside workspace
            </p>

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
              <label className="text-xs text-slate-500">Folder name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="e.g. UI Tasks"
              />
            </div>

            {/* MEMBERS INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="h-3 w-3" />
                Members
              </label>

              <div className="flex gap-2">
                <MemberSearchSelect
                  options={staffData}
                  selectedValue={selectedUser}
                  onChange={setSelectedUser}
                  placeholder="Search employee..."
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
            </div>

            {/* MEMBERS LIST (Workspace Style Cards) */}
            <div className="max-h-[22em] space-y-3 overflow-auto">
              {members.map((m) => {
                const user = staffData.find((u) => u._id === m.user);

                const name = user?.fullName || user?.email || "Unknown";
                const initial = name.charAt(0).toUpperCase();

                const canNotify = m.role === "manager";

                return (
                  <div
                    key={m.user}
                    className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 "
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* AVATAR */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-800">
                          {name}
                        </div>

                        <div className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT HOVER ACTIONS */}
                    <div className="flex items-center gap-2 opacity-100  transition">
                      {/* NOTIFICATION */}
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1">
                        <Bell className="h-4 w-4 text-slate-500" />
                        <Switch
                          checked={m.notificationEnabled ?? false}
                          // disabled={!canNotify}
                          onCheckedChange={(v) =>
                            updateMember(m.user, {
                              notificationEnabled: v,
                            })
                          }
                        />
                      </div>

                      {/* ROLE */}
                      <select
                        value={m.role}
                        onChange={(e) =>
                          updateMember(m.user, {
                            role: e.target.value as WorkspaceRole,
                          })
                        }
                        className="rounded-xl border px-2 py-1 text-xs bg-slate-50"
                      >
                        <option value="viewer">viewer</option>
                        <option value="member">member</option>
                        <option value="manager">manager</option>
                      </select>

                      {/* DELETE */}
                      <button
                        onClick={() => removeMember(m.user)}
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
          <div className="flex justify-end gap-2 border-t border-slate-200/70 p-5">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
