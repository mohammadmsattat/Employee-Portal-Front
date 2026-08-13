import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { useCreateListMutation } from "@/rtk/Tasks/listApi";
import { useMemo, useState } from "react";

export const VISIBILITY = ["private", "public"] as const;
export type Visibility = (typeof VISIBILITY)[number];

export const ROLES = ["viewer", "member", "manager"] as const;
export type Role = (typeof ROLES)[number];

interface Member {
  user: string;
  role: Role;
  notificationEnabled: boolean;
}

interface UpdateMemberPayload {
  role?: Role;
  notificationEnabled?: boolean;
}

interface Props {
  workspaceId: string | null;
  folderId: string | null;
  onClose?: () => void;
  refetchTree?: () => void;
}

export const useCreateList = ({
  workspaceId,
  folderId,
  onClose,
  refetchTree,
}: Props) => {
  const [createList, { isLoading }] = useCreateListMutation();

  const { data: staffRes } = useGetAllStaffQuery({});

  const staffData = useMemo(() => {
    return staffRes?.data || [];
  }, [staffRes]);

  const [name, setName] = useState("");

  const [visibility, setVisibility] = useState<Visibility>("private");

  const [members, setMembers] = useState<Member[]>([]);

  const [selectedUser, setSelectedUser] = useState("");

  const [role, setRole] = useState<Role>("viewer");

  /* =========================
      NOTIFICATION RULE
  ========================= */

  const getNotificationByRole = (role: Role) => {
    return role === "manager";
  };

  /* =========================
      ADD MEMBER
  ========================= */

  const addMember = () => {
    if (!selectedUser) return;

    const exists = members.some((m) => m.user === selectedUser);

    if (exists) return;

    setMembers((prev) => [
      ...prev,
      {
        user: selectedUser,
        role,
        notificationEnabled: getNotificationByRole(role),
      },
    ]);

    setSelectedUser("");
    setRole("viewer");
  };

  /* =========================
      UPDATE MEMBER
  ========================= */

  const updateMember = (userId: string, payload: UpdateMemberPayload) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.user !== userId) return m;

        const updatedRole = payload.role ?? m.role;

        return {
          ...m,
          ...payload,
          role: updatedRole,

          notificationEnabled:
            payload.notificationEnabled !== undefined
              ? payload.notificationEnabled
              : getNotificationByRole(updatedRole),
        };
      }),
    );
  };

  /* =========================
      REMOVE MEMBER
  ========================= */

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.user !== id));
  };

  /* =========================
      SUBMIT
  ========================= */

  const submit = async () => {
    console.log("---");
    console.log(folderId);
    console.log(workspaceId);
    
    if (!name.trim() || !workspaceId || !folderId) {
      return;
    }
    console.log("-||||");

    try {
      await createList({
        workspaceId,
        folderId,
        data: {
          name: name.trim(),
          workspace: workspaceId,
          folder: folderId,
          visibility,

          members:
            visibility === "private"
              ? members.map((m) => ({
                  user: m.user,
                  role: m.role,
                  notificationsEnabled: Boolean(m.notificationEnabled),
                }))
              : [],
        },
      }).unwrap();

      await refetchTree?.();

      onClose?.();

      setName("");
      setMembers([]);
      setSelectedUser("");
      setRole("viewer");
      setVisibility("private");
    } catch (error) {
      console.error("Create list failed:", error);
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
    updateMember,
    removeMember,

    submit,

    isLoading,
  };
};
