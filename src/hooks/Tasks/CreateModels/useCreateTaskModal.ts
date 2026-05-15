import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";

interface FormState {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string[];
  dueDate?: Date;
  startDate?: Date;
  tags: string;
  list: string;
  workspace: string;
}

export const useAddTaskModal = ({
  isOpen,
  onClose,
  listId,
}: {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}) => {
  const { toast } = useToast();
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const { data } = useGetAllStaffQuery({});

  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: [],
    dueDate: undefined,
    startDate: undefined,
    tags: "",
    list: "",
    workspace: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const reset = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: [],
      dueDate: undefined,
      startDate: undefined,
      tags: "",
      list: "",
      workspace: "",
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,

        assignedTo: formData.assignedTo,

        dueDate: formData.dueDate,
        startDate: formData.startDate,

        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],

        list: formData.list,
        workspace: formData.workspace,

        companyId: user.companyId,
        createdBy: user._id,
      };

      await createTask({ listId, data: payload }).unwrap();

      toast({
        title: "Task Created",
        description: "Task has been successfully created.",
      });

      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task.",
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
