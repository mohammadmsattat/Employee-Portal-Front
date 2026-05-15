import { useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

export const useStatusModal = ({
  entity,
  onClose,
  listId,
  refetchTasks
}: {
  entity: any;
  onClose: () => void;
  listId: string;
  refetchTasks: () => void;
}) => {
  const [updateTask] = useUpdateTaskMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();

  const data = entity?.data;

  const [status, setStatus] = useState(data?.status);

  const handleSave = async () => {
    try {
      if (entity.type === "task") {
        await updateTask({
          listId,
          id: data._id,
          data: { status },
        }).unwrap();
        refetchTasks();
      }

      if (entity.type === "subtask") {
        await updateSubTask({
          listId,
          taskId: entity.parentTaskId,
          subTaskId: data._id,
          data: { status },
        }).unwrap();

        refetchTasks();
      }

      onClose();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return { status, setStatus, handleSave };
};