import { X, ListPlus, Users, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateList,
  VISIBILITY,
  type Visibility,
  type Role,
} from "@/hooks/Tasks/CreateModels/useCreateList";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";
import { Switch } from "@/components/ui/switch";

export const AddListModal = ({
  isOpen,
  onClose,
  workspaceId,
  folderId,
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
    updateMember,
    removeMember,
    submit,
    isLoading,
  } = useCreateList({
    workspaceId,
    folderId,
    onClose,
    refetchTree,
  });

  if (!isOpen) return null;

  const isPrivate = visibility === "private";

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-lg">
        <div className="rounded-[32px] border border-white/60 bg-white/95 shadow-xl backdrop-blur-xl">
          {/* HEADER */}
          <div className="p-5 border-b relative">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <ListPlus className="mr-1 h-3 w-3" />
              New List
            </div>

            <h3 className="mt-2 text-xl font-bold">Create List</h3>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-4 max-h-[60vh]">
            {" "}
            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">List name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            {/* VISIBILITY */}
            <div>
              <label className="text-xs text-slate-500">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
              >
                {VISIBILITY.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            {/* MEMBERS */}
            {isPrivate && (
              <div className="space-y-3">
                <label className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Members
                </label>

                <div className="flex gap-2">
                  <MemberSearchSelect
                    options={staffData || []}
                    selectedValue={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="Search employee..."
                  />

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="rounded-xl border px-2 py-2 text-sm"
                  >
                    <option value="viewer">viewer</option>
                    <option value="member">member</option>
                    <option value="manager">manager</option>
                  </select>

                  <Button
                    onClick={addMember}
                    className="h-10 w-10 bg-blue-600 text-white rounded-xl"
                  >
                    +
                  </Button>
                </div>

                {/* LIST */}
                {members.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {members.map((m) => {
                      const user = staffData?.find((u) => u._id === m.user);

                      const displayName =
                        user?.fullName || user?.email || "Unknown";

                      const initial = displayName.charAt(0).toUpperCase();

                      const isNotif = m.notificationEnabled;

                      return (
                        <div
                          key={m.user}
                          className="flex justify-between items-center rounded-2xl border bg-white p-4"
                        >
                          {/* LEFT */}
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                              {initial}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">
                                {displayName}
                              </span>
                              <span className="text-xs text-slate-500">
                                {user.email}
                              </span>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1">
                              <Bell className="h-4 w-4 text-slate-500" />

                              <Switch
                                checked={isNotif}
                                onCheckedChange={() =>
                                  updateMember(m.user, {
                                    notificationEnabled: !isNotif,
                                  })
                                }
                              />
                            </div>

                            <select
                              value={m.role}
                              onChange={(e) =>
                                updateMember(m.user, {
                                  role: e.target.value as Role,
                                })
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-2 text-xs font-medium text-slate-700 transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                            >
                              <option value="viewer">viewer</option>
                              <option value="member">member</option>
                              <option value="manager">manager</option>
                            </select>

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
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-5 border-t">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={isLoading}
              className="bg-blue-600 text-white"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
