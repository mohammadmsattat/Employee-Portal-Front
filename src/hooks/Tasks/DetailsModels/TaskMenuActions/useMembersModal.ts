import { useEffect, useState } from "react";

import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

import { useToast } from "@/hooks/use-toast";

interface UseMembersModalArgs {
  isOpen: boolean;
  onClose: () => void;
  entity: any;
  workspaceId?: string;
  listId: string;
  refetchTasks?: () => unknown;
}

export const useMembersModal = ({
  isOpen,
  onClose,
  entity,
  listId,
  refetchTasks,
}: UseMembersModalArgs) => {
  const { toast } = useToast();

  const [updateTask, { isLoading: updatingTask }] = useUpdateTaskMutation();

  const [updateSubTask, { isLoading: updatingSubTask }] =
    useUpdateSubTaskMutation();

  const {
    data: staffResponse,
    isLoading: staffLoading,
    isError: staffError,
  } = useGetAllStaffQuery({});

  /*
   * يدعم الشكلين القديم والجديد.
   */
  const task = entity?.data || entity;

  const entityType =
    entity?.type === "subtask" || Boolean(task?.task) ? "subtask" : "task";

  const parentTaskId =
    entity?.parentTaskId ||
    (typeof task?.task === "object" ? task?.task?._id : task?.task);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  /*
   * assignedTo يمكن أن تحتوي:
   * ObjectIds
   * أو staff objects بعد populate.
   */
  useEffect(() => {
    if (!isOpen || !task?._id) return;

    const memberIds = Array.isArray(task?.assignedTo)
      ? task.assignedTo
          .map((member: any) => {
            if (typeof member === "string") {
              return member;
            }

            return member?._id;
          })
          .filter(Boolean)
      : [];

    setSelectedMembers(memberIds);
  }, [isOpen, task?._id, task?.updatedAt]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMembers([]);
    }
  }, [isOpen]);

  /*
   * نعيد overflow إلى قيمته السابقة بعد إغلاق Modal.
   */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const toggleMember = (userId: string) => {
    setSelectedMembers((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId],
    );
  };

  const addMember = (userId: string) => {
    setSelectedMembers((previous) =>
      previous.includes(userId) ? previous : [...previous, userId],
    );
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((previous) => previous.filter((id) => id !== userId));
  };

  const handleSave = async () => {
    if (!task?._id) {
      toast({
        title: "Update failed",
        description: "Task information is missing.",
        variant: "destructive",
      });

      return;
    }

    try {
      if (entityType === "task") {
        if (!listId) {
          throw new Error("List ID is missing");
        }

        await updateTask({
          listId,
          id: task._id,
          data: {
            assignedTo: selectedMembers,
          },
        }).unwrap();
      }

      if (entityType === "subtask") {
        if (!parentTaskId) {
          throw new Error("Parent task ID is missing");
        }

        await updateSubTask({
          taskId: parentTaskId,
          subTaskId: task._id,
          data: {
            assignedTo: selectedMembers,
          },
        }).unwrap();
      }

      await Promise.resolve(refetchTasks?.());

      toast({
        title: "Members updated",
        description: `${
          entityType === "subtask" ? "Subtask" : "Task"
        } members updated successfully.`,
      });

      onClose();
    } catch (error: any) {
      console.error("Failed to update members", error);

      toast({
        title: "Update failed",
        description:
          error?.data?.message || error?.message || "Failed to update members.",
        variant: "destructive",
      });
    }
  };

  const staff = Array.isArray(staffResponse?.data)
    ? staffResponse.data
    : Array.isArray(staffResponse)
      ? staffResponse
      : [];

  return {
    staff,
    staffLoading,
    staffError,

    selectedMembers,
    toggleMember,
    addMember,
    removeMember,
    handleSave,

    isSaving: updatingTask || updatingSubTask,
  };
};
