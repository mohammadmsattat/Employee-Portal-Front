import { useMemo, useState } from "react";
import { X, Plus, Users, Loader2 } from "lucide-react";
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

  const { data, isLoading, refetch } = useGetWorkspaceByIdQuery(workspaceId, {
    skip: !workspaceId,
  });
  console.log(data);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const { data: staffData, isError } = useGetAllStaffQuery({
    // directManager: user._id,
  });

  const [updateWorkspace] = useUpdateWorkspaceMutation();

  const [addMember, { isLoading: adding }] = useAddWorkspaceMemberMutation();

  const [removeMember, { isLoading: removing }] =
    useRemoveWorkspaceMemberMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("member");

  if (!isOpen) return null;

  const members = data?.data?.members || [];

  const handleAdd = async () => {
    if (!selectedUser) return;

    try {
      const exists = members.some((m) => m.user?._id === selectedUser);

      if (exists) {
        toast({
          title: "Info",
          description: "User already exists → role may be updated instead",
        });
      } else {
        // ➕ إضافة عضو جديد
        await addMember({
          id: workspaceId,
          userId: selectedUser,
          role,
        }).unwrap();
      }

      setSelectedUser("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemove = async (userId: string) => {
    console.log(userId);

    try {
      const result = await removeMember({
        id: workspaceId,
        userId,
      }).unwrap();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="max-h-[88vh]  rounded-t-[28px] sm:rounded-[32px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {/* HEADER */}
          <div className="relative p-5 border-b border-slate-200/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Users className="h-4 w-4" />
              Workspace Members
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {workspace?.name}
            </h3>

            <button
              onClick={onClose}
              className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5">
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

            {/* MEMBERS LIST */}
            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {members.map((m: any) => {
                const memberUser = m.user;

                const isOwner = m.role === "owner";

                const isProtectedOwner = isOwner;

                return (
                  <div
                    key={memberUser?._id}
                    className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex min-w-0 items-center gap-3">
                        {/* AVATAR */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-1 ring-blue-200">
                          {(memberUser?.fullName || memberUser?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* INFO */}
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
                        {isProtectedOwner ? (
                          <div className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                            Owner
                          </div>
                        ) : (
                          <select
                            value={m.role}
                            onChange={async (e) => {
                              const newRole = e.target.value;

                              try {
                                const res = await updateWorkspace({
                                  id: workspaceId,
                                  data: {
                                    members: members.map((member) => {
                                      const memberId = member?.user?._id;

                                      if (!memberId) return member;

                                      return memberId === memberUser?._id
                                        ? { ...member, role: newRole }
                                        : member;
                                    }),
                                  },
                                }).unwrap();
                                refetch();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="manager">Manager</option>
                          </select>
                        )}

                        {/* REMOVE */}
                        {!isProtectedOwner && (
                          <button
                            onClick={() => handleRemove(memberUser?._id)}
                            disabled={removing}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:opacity-50"
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
