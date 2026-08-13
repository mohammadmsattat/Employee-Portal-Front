// AddListModal.jsx - نسخة محسنة بتصميم متطابق مع المنصة

import { X, ListPlus, Users, Bell, Trash2, List, UserPlus, Eye, EyeOff, Plus } from "lucide-react";
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
  console.log(workspaceId);
  console.log(folderId);
  
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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
      <div className="flex max-h-[96vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-h-[92vh] sm:max-w-xl md:max-w-2xl sm:rounded-2xl">
        
        {/* ===== HEADER ===== */}
        <div
          className="relative shrink-0 overflow-hidden px-4 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
          }}
        >
          {/* Decorative blur elements */}
          <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/20 blur-2xl sm:-right-10 sm:-top-12 sm:h-32 sm:w-32" />
          <div className="absolute -left-8 top-6 h-20 w-20 rounded-full bg-indigo-200/20 blur-2xl sm:-left-10 sm:top-8 sm:h-24 sm:w-24" />

          {/* Mobile handle */}
          <div className="mx-auto mb-2.5 h-1 w-12 rounded-full bg-slate-300/60 sm:hidden" />

          <div className="relative flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40 sm:h-11 sm:w-11 sm:rounded-xl">
                <List className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-blue-600/80 sm:text-xs">
                  Create List
                </p>

                <h3 className="text-base font-bold text-blue-900 sm:text-lg">
                  New List
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Visibility Badge */}
          <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
            {isPrivate ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span className="capitalize">
              {visibility} list
            </span>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6">
          <div className="grid gap-3.5 sm:gap-4">
            {/* List Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 sm:mb-1.5 sm:text-sm">
                List name <span className="text-red-500">*</span>
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter list name..."
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-11 sm:rounded-lg sm:px-4"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 sm:mb-1.5 sm:text-sm">
                Visibility <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {VISIBILITY.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v as Visibility)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-medium transition sm:rounded-lg sm:px-4 ${
                      visibility === v
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200/50"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {v === "public" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                    <span className="capitalize">{v}</span>
                  </button>
                ))}
              </div>

              <p className="mt-1.5 text-xs text-slate-500">
                {isPrivate
                  ? "Only invited members can view and access this list"
                  : "All workspace members can view and access this list"}
              </p>
            </div>

            {/* Members Section (only for private) */}
            {isPrivate && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 sm:mb-1.5 sm:text-sm">
                    <Users className="mr-1 inline h-3.5 w-3.5 text-blue-500 sm:h-4 sm:w-4" />
                    Members
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                      <MemberSearchSelect
                        options={staffData || []}
                        selectedValue={selectedUser}
                        onChange={setSelectedUser}
                        placeholder="Search employee..."
                      />
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-11 sm:flex-none sm:rounded-lg sm:px-3 sm:text-sm"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="member">Member</option>
                        <option value="manager">Manager</option>
                      </select>

                      <Button
                        onClick={addMember}
                        className="h-10 w-10 shrink-0 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 sm:h-11 sm:w-11 sm:rounded-lg"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 sm:mb-1.5 sm:text-sm">
                    Added Members ({members?.length || 0})
                  </label>

                  <div className="max-h-[36vh] space-y-2 overflow-y-auto overscroll-contain sm:max-h-[38vh] md:max-h-[40vh]">
                    {members?.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center sm:p-8 sm:rounded-lg">
                        <UserPlus className="mx-auto h-7 w-7 text-slate-300 sm:h-8 sm:w-8" />
                        <p className="mt-1.5 text-sm font-medium text-slate-500 sm:mt-2">
                          No members added yet
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 sm:mt-1">
                          Search and add members above
                        </p>
                      </div>
                    ) : (
                      members.map((m) => {
                        const user = staffData?.find((u) => u._id === m.user);

                        const id = m?.user;
                        const displayName =
                          user?.fullName || user?.email || "Unknown User";
                        const initial = displayName.charAt(0).toUpperCase();
                        const isNotif = m?.notificationEnabled ?? true;

                        return (
                          <div
                            key={id}
                            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 active:bg-slate-50/50 sm:gap-3 sm:p-4 sm:rounded-lg sm:flex-row sm:items-center sm:justify-between"
                          >
                            {/* LEFT */}
                            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700 sm:h-10 sm:w-10 sm:rounded-lg">
                                {initial}
                              </div>

                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-800">
                                  {displayName}
                                </div>
                                <div className="truncate text-[11px] text-slate-500 sm:text-xs">
                                  {user?.email || "No email"}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              {/* Notification */}
                              <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-1 sm:px-3 sm:py-1.5">
                                <Bell className="h-3 w-3 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                <Switch
                                  checked={isNotif}
                                  onCheckedChange={() =>
                                    updateMember(id, {
                                      notificationEnabled: !isNotif,
                                    })
                                  }
                                  className="data-[state=checked]:bg-blue-600 [&>span]:h-3 [&>span]:w-3 sm:[&>span]:h-3.5 sm:[&>span]:w-3.5"
                                />
                              </div>

                              {/* Role */}
                              <select
                                value={m.role}
                                onChange={(e) =>
                                  updateMember(id, {
                                    role: e.target.value as Role,
                                  })
                                }
                                className="h-8 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-9 sm:rounded-lg sm:px-2.5 sm:text-xs"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                              </select>

                              {/* Delete */}
                              <button
                                onClick={() => removeMember(id)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600 sm:h-9 sm:w-9 sm:rounded-lg"
                              >
                                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-7">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 w-full rounded-2xl border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:h-11 sm:w-auto sm:rounded-lg"
            >
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={isLoading || !name.trim()}
              className="h-10 w-full rounded-2xl bg-blue-600 px-4 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:h-11 sm:w-auto sm:rounded-lg sm:px-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </span>
              ) : (
                "Create List"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListModal;