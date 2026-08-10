// ManageMembersModal.jsx - نسخة محسنة بتصميم متطابق مع المنصة

import { useMemo, useState } from "react";
import {
  X,
  Plus,
  Users,
  Loader2,
  CheckCircle2,
  Trash2,
  Bell,
  UserPlus,
  Briefcase,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

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
          notificationsEnabled: role === "manager",
        }).unwrap();

        toast({ title: "Member added" });
        refetch();
      } else {
        toast({
          title: "Info",
          description: "Member already exists in this workspace",
        });
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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
      <div className="flex max-h-[96vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-h-[92vh] sm:max-w-2xl sm:rounded-2xl">
        
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
                <Briefcase className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-blue-600/80 sm:text-xs">
                  Manage Members
                </p>

                <h3 className="text-base font-bold text-blue-900 sm:text-lg">
                  {workspace?.name || "Workspace Members"}
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

          {/* Members count badge */}
          <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
            <Users className="h-3.5 w-3.5" />
            <span>
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6">
          <div className="grid gap-4">
            {/* Add Member Section */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                <UserPlus className="mr-1.5 inline h-4 w-4 text-blue-500" />
                Add Member
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1">
                  <MemberSearchSelect
                    options={staffData?.data || []}
                    selectedValue={selectedUser}
                    onChange={setSelectedUser}
                    placeholder="Search employee..."
                  />
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-900 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-11 sm:flex-none sm:rounded-lg sm:px-3 sm:text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                  </select>

                  <Button
                    onClick={handleAdd}
                    disabled={adding || !selectedUser}
                    className="h-10 w-10 shrink-0 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 sm:h-11 sm:w-11 sm:rounded-lg"
                  >
                    {adding ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Members ({members.length})
              </label>

              <div className="max-h-[42vh] space-y-2 overflow-y-auto overscroll-contain sm:max-h-[44vh] md:max-h-[46vh]">
                {members.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center sm:p-8 sm:rounded-lg">
                    <Users className="mx-auto h-7 w-7 text-slate-300 sm:h-8 sm:w-8" />
                    <p className="mt-1.5 text-sm font-medium text-slate-500 sm:mt-2">
                      No members in this workspace
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 sm:mt-1">
                      Add members to collaborate on this workspace
                    </p>
                  </div>
                ) : (
                  members.map((m: any) => {
                    const memberUser = m.user;
                    const isOwner = m.role === "owner";

                    const isUpdating = updatingMemberId === memberUser?._id;
                    const isSuccess = successMemberId === memberUser?._id;

                    return (
                      <div
                        key={memberUser?._id}
                        className={`relative flex flex-col gap-2 rounded-2xl border p-3 transition sm:gap-3 sm:p-4 sm:rounded-lg sm:flex-row sm:items-center sm:justify-between ${
                          isUpdating
                            ? "border-blue-300 bg-blue-50/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Loading overlay */}
                        {isUpdating && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 sm:rounded-lg">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                          </div>
                        )}

                        {/* LEFT */}
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 sm:h-10 sm:w-10 sm:rounded-lg">
                            {(memberUser?.fullName ||
                              memberUser?.email ||
                              "?")[0]?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-800">
                              {memberUser?.fullName || "Unknown User"}
                            </div>
                            <div className="truncate text-[11px] text-slate-500 sm:text-xs">
                              {memberUser?.email}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {/* Notification */}
                          <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-1 sm:px-3 sm:py-1.5">
                            <Bell className="h-3 w-3 text-slate-500 sm:h-3.5 sm:w-3.5" />
                            <Switch
                              checked={Boolean(m.notificationsEnabled)}
                              disabled={isUpdating}
                              onCheckedChange={async (checked) => {
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
                                          ? {
                                              ...member,
                                              notificationsEnabled: checked,
                                            }
                                          : member;
                                      }),
                                    },
                                  }).unwrap();

                                  await refetch();

                                  setSuccessMemberId(memberUser?._id);

                                  setTimeout(() => {
                                    setSuccessMemberId(null);
                                  }, 1200);

                                  toast({
                                    title: checked
                                      ? "Notifications enabled"
                                      : "Notifications disabled",
                                    description: memberUser?.fullName,
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
                              className="data-[state=checked]:bg-blue-600 [&>span]:h-3 [&>span]:w-3 sm:[&>span]:h-3.5 sm:[&>span]:w-3.5"
                            />
                          </div>

                          {/* Role */}
                          {isOwner ? (
                            <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:px-3.5 sm:py-1.5">
                              Owner
                            </span>
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
                                      1200
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
                                className="h-8 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 pr-7 text-[11px] font-medium text-slate-700 transition hover:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-60 sm:h-9 sm:rounded-lg sm:px-2.5 sm:pr-8 sm:text-xs"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                              </select>

                              {isSuccess && (
                                <CheckCircle2 className="absolute right-1.5 h-3.5 w-3.5 text-green-600 animate-pulse sm:right-2 sm:h-4 sm:w-4" />
                              )}
                            </div>
                          )}

                          {/* Delete */}
                          {!isOwner && (
                            <button
                              onClick={() => handleRemove(memberUser?._id)}
                              disabled={removing || isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50 sm:h-9 sm:w-9 sm:rounded-lg"
                            >
                              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-7">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-10 w-full rounded-2xl border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:h-11 sm:w-auto sm:rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};