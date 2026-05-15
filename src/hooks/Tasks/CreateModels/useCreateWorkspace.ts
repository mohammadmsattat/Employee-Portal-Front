import { useMemo, useState } from "react";
import { useCreateWorkspaceMutation } from "@/rtk/Tasks/workspaceApi";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

/* =========================
   TYPES
========================= */

export type WorkspaceRole = "viewer" | "member" | "manager";

export interface WorkspaceMemberInput {
  user: string;
  role: WorkspaceRole;
  status: "active" | "invited";
}

export interface StaffUser {
  _id: string;
  name?: string;
  email?: string;
}

interface UseWorkspaceProps {
  onClose?: () => void;
}

/* =========================
   HOOK
========================= */

export const useCreateWorkspace = ({ onClose }: UseWorkspaceProps) => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const { data: staffData, isError } = useGetAllStaffQuery({});

  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  /* STATE */
  const [name, setName] = useState("");
  const [members, setMembers] = useState<WorkspaceMemberInput[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("member");

  /* RESET */
  const reset = () => {
    setName("");
    setMembers([]);
    setSelectedUser("");
    setRole("member");
  };

  /* ADD MEMBER */
  const addMember = () => {
    if (!selectedUser) return;

    const exists = members.some((m) => m.user === selectedUser);
    if (exists) return;

    setMembers((prev) => [
      ...prev,
      {
        user: selectedUser,
        role,
        status: "active",
      },
    ]);

    setSelectedUser("");
    setRole("member");
  };

  /* REMOVE MEMBER */
  const removeMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.user !== userId));
  };

  /* SUBMIT */
  const submit = async () => {
    if (!name.trim()) return;

    await createWorkspace({
      name: name.trim(),
      members,
    }).unwrap();

    reset();
    onClose?.();
  };

  return {
    /* state */
    name,
    setName,
    members,
    selectedUser,
    setSelectedUser,
    role,
    setRole,

    /* derived */
    staffData,

    /* actions */
    addMember,
    removeMember,
    submit,
    reset,

    isLoading,
  };
};
