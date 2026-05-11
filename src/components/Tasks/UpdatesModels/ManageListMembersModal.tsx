import { useMemo, useState } from "react";
import { X, Plus, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetListByIdQuery,
  useAddListMemberMutation,
  useRemoveListMemberMutation,
} from "@/rtk/Tasks/listApi";

import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

export const ListMembersModal = ({ isOpen, onClose, list, workspace }) => {
  const listId = list?._id;

  const { data, isLoading, error } = useGetListByIdQuery(
    { id: listId, workspaceId: workspace?._id },
    { skip: !listId },
  );
  console.log(error);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const { data: staffData } = useGetAllStaffQuery({
    directManager: user?._id,
  });

  const [addMember, { isLoading: adding }] = useAddListMemberMutation();
  const [removeMember, { isLoading: removing }] = useRemoveListMemberMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("member");

  if (!isOpen) return null;

  const members = data?.data?.members || [];
  console.log(members);

  const handleAdd = async () => {
    if (!selectedUser || !workspace?._id) return;
    console.log({
      workspaceId: workspace._id,
      id: listId,
      userId: selectedUser,
      role,
    });

    try {
      await addMember({
        workspaceId: workspace._id,
        id: listId,
        userId: selectedUser,
        role,
      }).unwrap();

      setSelectedUser("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember({
        workspaceId: workspace._id,
        id: listId,
        userId,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[32px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          {/* HEADER */}
          <div className="relative p-5 border-b border-slate-200/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Users className="h-4 w-4" />
              List Members
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {list?.name}
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
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select user</option>

                {staffData?.data?.map((u) => (
                  <option
                    key={u._id}
                    value={u._id}
                    disabled={members.some((m) => m.user._id === u._id)}
                  >
                    {u.fullName || u.email}
                  </option>
                ))}
              </select>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
              >
                {" "}
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
            <div className="space-y-2 max-h-64 overflow-auto">
              {members?.map((m) => {
                const user = m.user;

                return (
                  <div
                    key={user?._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                        {(user?.fullName ||
                          user?.email ||
                          "?")[0].toUpperCase()}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {user?.fullName}
                        </div>
                        <div className="text-xs text-slate-500">{m.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(user._id)}
                      disabled={removing}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end p-5 border-t border-slate-200/70">
            <Button onClick={onClose} variant="outline" className="rounded-2xl">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
