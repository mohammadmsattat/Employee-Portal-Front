import { useMemo, useState } from "react";
import { X, Plus, Users, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetWorkspaceByIdQuery,
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMutation,
} from "@/rtk/Tasks/workspaceApi";

import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

import { useToast } from "@/hooks/use-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workspace: any;
};

export const ManageMembersModal = ({ isOpen, onClose, workspace }: Props) => {
  const { toast } = useToast();

  const workspaceId = workspace?._id;

  const { data, refetch } = useGetWorkspaceByIdQuery(workspaceId, {
    skip: !workspaceId,
  });

  const { data: staffData } = useGetAllStaffQuery({});

  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const [addMember, { isLoading: adding }] = useAddWorkspaceMemberMutation();
  const [removeMember, { isLoading: removing }] =
    useRemoveWorkspaceMemberMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("member");

  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const [successMemberId, setSuccessMemberId] = useState<string | null>(null);

  if (!isOpen) return null;

  const members = data?.data?.members || [];

  const handleAdd = async () => {
    if (!selectedUser) return;

    try {
      const exists = members.some((m) => m.user?._id === selectedUser);

      if (!exists) {
        await addMember({
          id: workspaceId,
          userId: selectedUser,
          role,
        }).unwrap();

        toast({ title: "Member added" });
        refetch();
      }

      setSelectedUser("");
    } catch (err) {
      toast({ title: "Add failed", variant: "destructive" });
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMember({
        id: workspaceId,
        userId,
      }).unwrap();

      toast({ title: "Member removed" });
      refetch();
    } catch (err) {
      toast({ title: "Remove failed", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="max-h-[88vh] rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[32px]">
          {/* HEADER */}
          <div className="relative border-b border-slate-200/70 p-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Users className="h-4 w-4" />
              Workspace Members
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {workspace?.name}
            </h3>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="space-y-5 p-5">
            {/* ADD MEMBER */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500">Add Member</label>

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
                  disabled={adding}
                  className="h-10 w-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* MEMBERS */}
            <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
              {members.map((m: any) => {
                const memberUser = m.user;
                const isOwner = m.role === "owner";

                const isUpdating = updatingMemberId === memberUser?._id;
                const isSuccess = successMemberId === memberUser?._id;

                return (
                  <div
                    key={memberUser?._id}
                    className={`group relative rounded-2xl border px-4 py-3 transition
                      ${
                        isUpdating
                          ? "border-blue-300 bg-blue-50/40"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                  >
                    {/* subtle loader overlay */}
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 opacity-100">
                      {/* LEFT */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-1 ring-blue-200">
                          {(memberUser?.fullName || memberUser?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">
                            {memberUser?.fullName || "Unknown User"}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {memberUser?.email}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-2">
                        {/* ROLE */}
                        {isOwner ? (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                            Owner
                          </div>
                        ) : (
                          <div className="relative flex items-center">
                            <select
                              value={m.role}
                              disabled={isUpdating}
                              onChange={async (e) => {
                                const newRole = e.target.value;

                                try {
                                  setUpdatingMemberId(memberUser?._id);
                                  setSuccessMemberId(null);

                                  await updateWorkspace({
                                    id: workspaceId,
                                    data: {
                                      members: members.map((member) => {
                                        const id = member?.user?._id;
                                        if (!id) return member;

                                        return id === memberUser?._id
                                          ? { ...member, role: newRole }
                                          : member;
                                      }),
                                    },
                                  }).unwrap();

                                  await refetch();

                                  setSuccessMemberId(memberUser?._id);
                                  setTimeout(
                                    () => setSuccessMemberId(null),
                                    1200,
                                  );

                                  toast({
                                    title: "Role updated",
                                    description: `${memberUser?.fullName} → ${newRole}`,
                                  });
                                } catch (err) {
                                  toast({
                                    title: "Update failed",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setUpdatingMemberId(null);
                                }
                              }}
                              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-medium text-slate-700 transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="member">Member</option>
                              <option value="manager">Manager</option>
                            </select>

                            {/* success tick */}
                            {isSuccess && (
                              <CheckCircle2 className="absolute right-2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                        )}

                        {/* REMOVE */}
                        {!isOwner && (
                          <button
                            onClick={() => handleRemove(memberUser?._id)}
                            disabled={removing || isUpdating}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
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
          <div className="flex justify-end gap-2 border-t border-slate-200/70 p-5">
            <Button onClick={onClose} variant="outline" className="rounded-2xl">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
