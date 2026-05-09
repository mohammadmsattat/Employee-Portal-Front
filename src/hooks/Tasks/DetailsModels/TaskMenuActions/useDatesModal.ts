import { useEffect, useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { Task } from "@/interfaces/tasks";

interface Props {
  task: Task;
  onClose: () => void;
  workspaceId: string;
}

export const useDatesModal = ({ task, onClose ,workspaceId}: Props) => {
  const [updateTask] = useUpdateTaskMutation();

  const [dates, setDates] = useState({
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setDates({
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split("T")[0]
          : "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [task]);

  const handleSave = async () => {
    try {
      await updateTask({
        workspaceId,
        id: task._id,
        data: {
          startDate: dates.startDate,
          dueDate: dates.dueDate,
        },
      }).unwrap();

      onClose();
    } catch (err) {
      console.error("Update dates failed", err);
    }
  };

  return { dates, setDates, handleSave };
};