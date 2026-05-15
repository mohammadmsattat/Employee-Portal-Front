import { useMemo, useState } from "react";
import { useCreateFolderMutation } from "@/rtk/Tasks/folderApi";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

/* =========================
   TYPES
========================= */

export const VISIBILITY = ["private", "public"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const ROLES = ["viewer", "member", "manager"] as const;
export type WorkspaceRole = (typeof ROLES)[number];

interface Member {
  user: string;
  role: WorkspaceRole;
}

interface Props {
  workspaceId: string | null;
  onClose?: () => void;
  refetchTree?: () => void;
}

/* =========================
   HOOK
========================= */

export const useCreateFolder = ({
  workspaceId,
  onClose,
  refetchTree,
}: Props) => {
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const { data: staffRes } = useGetAllStaffQuery({});

  const staffData = useMemo(() => staffRes?.data || [], [staffRes]);

  const [name, setName] = useState("");

  const [visibility, setVisibility] =
    useState<Visibility>("private");

  const [members, setMembers] = useState<Member[]>([]);

  const [selectedUser, setSelectedUser] = useState("");

  const [role, setRole] =
    useState<WorkspaceRole>("viewer");

  const reset = () => {
    setName("");
    setVisibility("private");
    setMembers([]);
    setSelectedUser("");
    setRole("viewer");
  };

  const addMember = () => {
    if (!selectedUser) return;

    const exists = members.some(
      (m) => m.user === selectedUser
    );

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
    setMembers((prev) =>
      prev.filter((m) => m.user !== id)
    );
  };

const submit = async () => {
  if (!name.trim() || !workspaceId) return;
console.log(members);

  try {
    await createFolder({
      data: {
        name: name.trim(),
        visibility,
        order: 0,

        members:
          visibility === "private"
            ? members.map((m) => ({
                user: m.user,
                role: m.role,
              }))
            : [],
      },
      workspaceId,
    }).unwrap();

    await refetchTree?.();

    reset();
    onClose?.();
  } catch (err) {
    console.error(err);
  }
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

    reset,
  };
};