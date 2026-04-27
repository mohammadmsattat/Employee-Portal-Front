// hooks/SubTasks/useCreateSubTask.ts
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { useCreateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

export const useCreateSubTask = (taskId: string, onClose: () => void) => {
  const { toast } = useToast();
  const [createSubTask, { isLoading }] = useCreateSubTaskMutation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const { data } = useGetAllStaffQuery({
    directManager: user?._id,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignedTo: "",
    dueDate: null,
  });

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "SubTask title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      let assignedToFinal = null;

      if (formData.assignedTo === "me") {
        assignedToFinal = user._id;
      } else if (formData.assignedTo) {
        assignedToFinal = formData.assignedTo;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: assignedToFinal ? [assignedToFinal] : [],
        dueDate: formData.dueDate,
        task: taskId, // 🔥 الربط الأساسي
        companyId: user.companyId,
        createdBy: user._id,
        missionType: "task",
      };

      await createSubTask(payload).unwrap();

      toast({
        title: "SubTask Created",
        description: "SubTask created successfully",
      });

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assignedTo: "",
        dueDate: null,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subtask",
        variant: "destructive",
      });

      console.log(error);
    }
  };

  return {
    data,
    formData,
    setFormData,
    handleSubmit,
    isLoading,
  };
};