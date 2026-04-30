import { useEffect } from "react";
import { X, ListPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateList,
  VISIBILITY,
  type Visibility,
  type Role,
} from "@/hooks/Tasks/CreateModels/useCreateList ";

export const AddListModal = ({ isOpen, onClose, workspaceId, folderId }) => {
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
    submit,
    isLoading,
  } = useCreateList({
    workspaceId,
    folderId,
    onClose,
  });

  if (!isOpen) return null;

  const isPrivate = visibility === "private";

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-lg">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[32px]">
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
          <div className="p-5 space-y-4">
            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">List name </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:shadow-md"
              />
            </div>

            {/* VISIBILITY */}
            <div>
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
            </div>

            {/* MEMBERS */}
            {isPrivate && (
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

                    {staffData?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName || u.email}
                      </option>
                    ))}
                  </select>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
                  >
                    <option value="viewer">viewer</option>
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>

                  <Button
                    onClick={addMember}
                    className="h-12 w-full rounded-2xl bg-blue-600 px-4 font-semibold text-white sm:w-auto"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}
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
