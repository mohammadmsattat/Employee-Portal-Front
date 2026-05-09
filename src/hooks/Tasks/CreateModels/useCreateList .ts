import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { useCreateListMutation } from "@/rtk/Tasks/listApi";
import { useState, useMemo } from "react";

/* =========================
   TYPES (SOURCE OF TRUTH)
========================= */

export const VISIBILITY = ["private", "public"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const ROLES = ["viewer", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

interface Member {
  user: string;
  role: Role;
}

interface Props {
  workspaceId: string | null;
  folderId: string | null;
  onClose?: () => void;
  refetchTree?: () => void;
}

/* =========================
   HOOK
========================= */

export const useCreateList = ({
  workspaceId,
  folderId,
  onClose,
  refetchTree,
}: Props) => {
  const [createList, { isLoading }] = useCreateListMutation();

  const { data: staffRes } = useGetAllStaffQuery({});

  const staffData = useMemo(() => staffRes?.data || [], [staffRes]);

  const [name, setName] = useState<string>("");

  const [visibility, setVisibility] = useState<Visibility>("private");

  const [members, setMembers] = useState<Member[]>([]);

  const [selectedUser, setSelectedUser] = useState<string>("");

  const [role, setRole] = useState<Role>("viewer");

  const reset = () => {
    setName("");
    setVisibility("private");
    setMembers([]);
    setSelectedUser("");
    setRole("viewer");
  };

  const addMember = () => {
    if (!selectedUser) return;

    const exists = members.some((m) => m.user === selectedUser);
    if (exists) return;

    setMembers((prev) => [
      ...prev,
      {
        user: selectedUser,
        role,
      },
    ]);

    setSelectedUser("");
    setRole("viewer");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.user !== id));
  };

  const submit = async () => {
    if (!name.trim() || !workspaceId || !folderId) return;
    console.log(workspaceId);

    await createList({
      workspaceId,
      data: {
        name: name.trim(),
        workspace: workspaceId,
        folder: folderId,
        visibility,
        members: visibility === "private" ? members : [],
      },
    }).unwrap();
    await refetchTree();
    reset();
    onClose?.();
  };

  return {
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
    removeMember,
    submit,
    isLoading,
  };
};
