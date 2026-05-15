import { useEffect, useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

export const useDatesModal = ({ entity, onClose, workspaceId,listId, refetchTasks }) => {
  const [updateTask] = useUpdateTaskMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();

  const data = entity?.data;

  const [dates, setDates] = useState({
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    if (!data) return;

    setDates({
      startDate: data.startDate
        ? new Date(data.startDate).toISOString().split("T")[0]
        : "",
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString().split("T")[0]
        : "",
    });
  }, [data?._id]);

  const handleSave = async () => {
    try {
      const payload = {
        startDate: dates.startDate,
        dueDate: dates.dueDate,
      };

      if (entity.type === "task") {
        await updateTask({
          listId,
          id: data._id,
          data: payload,
        }).unwrap();
        refetchTasks();
      }

      if (entity.type === "subtask") {
        await updateSubTask({
          listId,
          taskId: entity.parentTaskId,
          subTaskId: data._id,
          data: payload,
        }).unwrap();
        refetchTasks();
      }

      onClose();
    } catch (err) {
      console.error("Update dates failed", err);
    }
  };

  return { dates, setDates, handleSave };
};