import { useMemo, useState } from "react";
import { X, Plus, Loader2, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetListByIdQuery,
  useAddListMemberMutation,
  useRemoveListMemberMutation,
  useUpdateListMutation,
} from "@/rtk/Tasks/listApi";

import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

export const ListMembersModal = ({
  isOpen,
  onClose,
  list,
  workspace,
  folderId,
}) => {
  const listId = list?._id;

  const { data, refetch } = useGetListByIdQuery(
    { id: listId, workspaceId: workspace?._id, folderId },
    { skip: !listId || !workspace?._id },
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const { data: staffData } = useGetAllStaffQuery({});

  const [updateList] = useUpdateListMutation();
  const [addMember, { isLoading: adding }] = useAddListMemberMutation();
  const [removeMember, { isLoading: removing }] = useRemoveListMemberMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("member");

  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [successMemberId, setSuccessMemberId] = useState<string | null>(null);

  if (!isOpen) return null;

  const members = data?.data?.members || [];

  const handleAdd = async () => {
    if (!selectedUser || !workspace?._id || !listId) return;

    await addMember({
      workspaceId: workspace._id,
      folderId,
      id: listId,
      userId: selectedUser,
      role,
    }).unwrap();

    setSelectedUser("");
    refetch();
  };

  const handleRemove = async (userId) => {
    await removeMember({
      workspaceId: workspace._id,
      folderId,
      id: listId,
      userId,
    }).unwrap();

    refetch();
  };

  const handleRoleChange = async (memberUser, newRole) => {
    try {
      setUpdatingMemberId(memberUser?._id);
      setSuccessMemberId(null);

      const updatedMembers = members.map((member) => ({
        user: member.user?._id || member.user,
        role:
          member.user?._id === memberUser?._id
            ? newRole
            : member.role,
      }));

      await updateList({
        workspaceId: workspace._id,
        folderId,
        id: listId,
        data: { members: updatedMembers },
      }).unwrap();

      await refetch();

      setSuccessMemberId(memberUser?._id);
      setTimeout(() => setSuccessMemberId(null), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="max-h-[88vh] rounded-t-[28px] sm:rounded-[32px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">

          {/* HEADER */}
          <div className="relative p-5 border-b border-slate-200/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Users className="h-4 w-4" />
              List Members
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {data?.data?.name}
            </h3>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5">

            {/* ADD */}
            <div className="flex gap-2">
              <MemberSearchSelect
                options={staffData?.data || []}
                selectedValue={selectedUser}
                onChange={setSelectedUser}
                placeholder="Search employee..."
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
              >
                <option value="viewer">viewer</option>
                <option value="member">member</option>
                <option value="manager">manager</option>
              </select>

              <Button
                onClick={handleAdd}
                disabled={adding || !selectedUser}
                className="h-10 w-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* LIST */}
            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">

              {members.map((m) => {
                const memberUser = m.user;

                const isOwner = m.role === "owner";

                const isUpdating = updatingMemberId === memberUser?._id;
                const isSuccess = successMemberId === memberUser?._id;

                return (
                  <div
                    key={memberUser?._id}
                    className={`relative group rounded-2xl border px-4 py-3 transition
                      ${
                        isUpdating
                          ? "border-blue-300 bg-blue-50/40"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                  >

                    {/* overlay loader */}
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">

                      {/* LEFT */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                          {(memberUser?.fullName || memberUser?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {memberUser?.fullName}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {memberUser?.email}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-2">

                        {isOwner ? (
                          <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                            Owner
                          </span>
                        ) : (
                          <div className="relative flex items-center">
                            <select
                              value={m.role}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleRoleChange(memberUser, e.target.value)
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs disabled:opacity-60"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="member">Member</option>
                              <option value="manager">Manager</option>
                            </select>

                            {isSuccess && (
                              <CheckCircle2 className="absolute right-2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                        )}

                        {!isOwner && (
                          <button
                            onClick={() => handleRemove(memberUser?._id)}
                            disabled={removing || isUpdating}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end border-t border-slate-200/70 p-5">
            <Button onClick={onClose} variant="outline" className="rounded-2xl">
              Close
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};