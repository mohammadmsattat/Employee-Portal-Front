import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

const formatDateForInput = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const matchedDate = value.match(/^\d{4}-\d{2}-\d{2}/);

    if (matchedDate) {
      return matchedDate[0];
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const useDatesModal = ({
  entity,
  isOpen,
  onClose,
  listId,
  refetchTasks,
}) => {
  const { toast } = useToast();

  const [updateTask, { isLoading: updatingTask }] = useUpdateTaskMutation();

  const [updateSubTask, { isLoading: updatingSubTask }] =
    useUpdateSubTaskMutation();

  // يدعم entity المباشرة والشكل القديم { type, data }
  const data = entity?.data || entity;

  const entityType =
    entity?.type === "subtask" || Boolean(data?.task || data?.parentTaskId)
      ? "subtask"
      : "task";

  const parentTaskValue =
    entity?.parentTaskId || data?.parentTaskId || data?.task;

  const parentTaskId =
    typeof parentTaskValue === "object"
      ? parentTaskValue?._id
      : parentTaskValue;

  const [dates, setDates] = useState({
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    if (!isOpen || !data?._id) return;

    setDates({
      startDate: formatDateForInput(data.startDate),
      dueDate: formatDateForInput(data.dueDate),
    });
  }, [isOpen, data?._id, data?.startDate, data?.dueDate]);

  const handleSave = async () => {
    if (!data?._id) {
      toast({
        title: "Update failed",
        description: "Task information is missing.",
        variant: "destructive",
      });

      return;
    }

    if (dates.startDate && dates.dueDate && dates.dueDate < dates.startDate) {
      toast({
        title: "Invalid dates",
        description: "Due date cannot be before start date.",
        variant: "destructive",
      });

      return;
    }

    const payload = {
      startDate: dates.startDate || null,
      dueDate: dates.dueDate || null,
    };

    try {
      if (entityType === "task") {
        if (!listId) {
          throw new Error("List ID is missing.");
        }

        await updateTask({
          listId,
          id: data._id,
          data: payload,
        }).unwrap();
      }

      if (entityType === "subtask") {
        if (!parentTaskId) {
          throw new Error("Parent task ID is missing.");
        }

        await updateSubTask({
          listId,
          taskId: parentTaskId,
          subTaskId: data._id,
          data: payload,
        }).unwrap();
      }

      await Promise.resolve(refetchTasks?.());

      toast({
        title: "Dates updated",
        description: `${
          entityType === "subtask" ? "Subtask" : "Task"
        } dates updated successfully.`,
      });

      onClose();
    } catch (error) {
      console.error("Update dates failed", error);

      toast({
        title: "Update failed",
        description:
          error?.data?.message || error?.message || "Failed to update dates.",
        variant: "destructive",
      });
    }
  };

  return {
    dates,
    setDates,
    handleSave,
    isSaving: updatingTask || updatingSubTask,
  };
};
