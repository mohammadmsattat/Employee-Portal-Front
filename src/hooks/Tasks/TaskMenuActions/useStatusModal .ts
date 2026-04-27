import { useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { Task, TaskStatus } from "@/interfaces/tasks";

export const useStatusModal = ({
  task,
  onClose,
  onCloseModal,
}: {
  task: Task;
  onClose: () => void;
}) => {
  const [updateTask] = useUpdateTaskMutation();
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const handleSave = async () => {
    try {
      await updateTask({
        id: task._id,
        data: {
          status,
        },
      }).unwrap();

      onClose();
      onCloseModal()
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return { status, setStatus, handleSave };
};