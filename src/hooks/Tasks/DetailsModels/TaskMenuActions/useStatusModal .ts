import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

import type { TaskStatus } from "@/interfaces/tasks";

interface UseStatusModalArgs {
  entity: any;
  onClose: () => void;
  listId: string;
  refetchTasks?: () => unknown;
}

export const useStatusModal = ({
  entity,
  onClose,
  listId,
  refetchTasks,
}: UseStatusModalArgs) => {
  const { toast } = useToast();

  const [updateTask, { isLoading: updatingTask }] = useUpdateTaskMutation();

  const [updateSubTask, { isLoading: updatingSubTask }] =
    useUpdateSubTaskMutation();

  /*
   * يدعم الشكلين:
   * entity = task
   * entity = { type, data }
   */
  const data = entity?.data || entity;

  const entityType =
    entity?.type === "subtask" || Boolean(data?.task) ? "subtask" : "task";

  const parentTaskId =
    entity?.parentTaskId ||
    (typeof data?.task === "object" ? data?.task?._id : data?.task);

  const [status, setStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    if (!data?._id) return;

    setStatus((data.status || "todo") as TaskStatus);
  }, [data?._id, data?.status]);

  const handleSave = async () => {
    if (!data?._id) {
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
          id: data._id,
          data: {
            status,
          },
        }).unwrap();
      }

      if (entityType === "subtask") {
        if (!parentTaskId) {
          throw new Error("Parent task ID is missing");
        }

        await updateSubTask({
          taskId: parentTaskId,
          subTaskId: data._id,
          data: {
            status,
          },
        }).unwrap();
      }

      await Promise.resolve(refetchTasks?.());

      toast({
        title: "Status updated",
        description: `${
          entityType === "subtask" ? "Subtask" : "Task"
        } status updated successfully.`,
      });

      onClose();
    } catch (error: any) {
      console.error("Failed to update status", error);

      toast({
        title: "Update failed",
        description:
          error?.data?.message || error?.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  return {
    status,
    setStatus,
    handleSave,

    isSaving: updatingTask || updatingSubTask,
  };
};
