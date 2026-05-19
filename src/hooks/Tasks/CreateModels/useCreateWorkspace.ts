import { useMemo, useState } from "react";
import { useCreateWorkspaceMutation } from "@/rtk/Tasks/workspaceApi";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

export type WorkspaceRole = "viewer" | "member" | "manager";

export interface WorkspaceMemberInput {
  user: string;
  role: WorkspaceRole;
  status: "active" | "invited";
  notificationEnabled: boolean;
}

interface UseWorkspaceProps {
  onClose?: () => void;
}

export const useCreateWorkspace = ({ onClose }: UseWorkspaceProps) => {
  const { data: staffData } = useGetAllStaffQuery({});
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const [name, setName] = useState("");
  const [members, setMembers] = useState<WorkspaceMemberInput[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("member");

  const reset = () => {
    setName("");
    setMembers([]);
    setSelectedUser("");
    setRole("member");
  };

  /* =========================
     RULE: notification by role
  ========================= */
  const getNotificationByRole = (role: WorkspaceRole) => {
    return role === "manager";
  };

  /* =========================
     ADD MEMBER
  ========================= */
  const addMember = () => {
    if (!selectedUser) return;

    const exists = members.some((m) => m.user === selectedUser);
    if (exists) return;

    const notificationEnabled = getNotificationByRole(role);

    setMembers((prev) => [
      ...prev,
      {
        user: selectedUser,
        role,
        status: "active",
        notificationEnabled,
      },
    ]);

    setSelectedUser("");
    setRole("member");
  };

  /* =========================
     UPDATE MEMBER (ROLE + NOTIF SYNC)
  ========================= */
  const updateMember = (
    userId: string,
    payload: Partial<WorkspaceMemberInput>
  ) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.user !== userId) return m;

        const newRole = payload.role ?? m.role;

        return {
          ...m,
          ...payload,
          role: newRole,
          // 👇 enforce rule automatically if role changed
          notificationEnabled:
            payload.notificationEnabled !== undefined
              ? payload.notificationEnabled
              : getNotificationByRole(newRole),
        };
      })
    );
  };

  /* =========================
     REMOVE
  ========================= */
  const removeMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.user !== userId));
  };

  /* =========================
     SUBMIT
  ========================= */
const submit = async () => {
  if (!name.trim()) return;

  const payload = {
    name: name.trim(),
    members: members.map((m) => ({
      user: m.user,
      role: m.role,
      status: m.status,
      notificationsEnabled: m.notificationEnabled, 
    })),
  };

  await createWorkspace(payload).unwrap();

  reset();
  onClose?.();
};

  return {
    name,
    setName,
    members,
    selectedUser,
    setSelectedUser,
    role,
    setRole,
    addMember,
    removeMember,
    updateMember,
    submit,
    isLoading,
    staffData,
  };
};