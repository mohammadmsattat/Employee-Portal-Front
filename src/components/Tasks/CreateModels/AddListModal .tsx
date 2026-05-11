import { useEffect } from "react";
import { X, ListPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateList,
  VISIBILITY,
  type Visibility,
  type Role,
} from "@/hooks/Tasks/CreateModels/useCreateList ";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

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
    search,
    setSearch,
    filteredStaff,
    visibility,
    setVisibility,
    members,
    selectedUser,
    setSelectedUser,
    role,
    setRole,
    staffData,
    addMember,
    submit,
    isLoading,
    removeMember,
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
        <div className="rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[32px]">
          {" "}
          {/* HEADER */}
          <div className="p-5 border-b border-slate-200/70">
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
              <ListPlus className="me-1 h-3 w-3" />
              New List
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Create List
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Organize tasks inside folder
            </p>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* BODY */}
          <div className="max-h-[60vh]  p-5 space-y-4">
            {" "}
            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">List name </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            {/* VISIBILITY */}
            {/* <div>
              <label className="text-xs text-slate-500">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
              >
                {VISIBILITY.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div> */}
            {/* MEMBERS */}
            {/* {isPrivate && ( */}
              <div className="space-y-2">
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
                    className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
                  >
                    <option value="viewer">viewer</option>
                    <option value="member">member</option>
                    <option value="manager">manager</option>
                  </select>

                  <Button
                    onClick={addMember}
                    className="h-12 w-full rounded-2xl bg-blue-600 px-4 font-semibold text-white sm:w-auto"
                  >
                    +
                  </Button>
                </div>
                {/* LIST */}
                {isPrivate && members.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-auto">
                    {members.map((m) => {
                      const user = staffData?.find((u) => u._id === m.user);

                      return (
                        <div
                          key={m.user}
                          className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                        >
                          {/* LEFT */}
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                              {(user?.fullName || user?.email || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-800">
                                {user?.fullName || user?.email}
                              </span>

                              <span className="text-xs text-slate-500">
                                {m.role}
                              </span>
                            </div>
                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() => removeMember(m.user)}
                            className="text-red-500 hover:text-red-600 text-xl"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            {/* )} */}
          </div>
          {/* FOOTER */}
          <div className="flex justify-end gap-2 p-5 border-t border-slate-200/70">
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
