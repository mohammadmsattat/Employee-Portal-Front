import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTaskMutation } from "@/rtk/Tasks/tasksApi";

interface FormState {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate?: Date;
  tags: string;
}

export const useAddTaskModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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

  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    dueDate: undefined,
    tags: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
    const assignedToFinal =
      formData.assignedTo === "me"
        ? user._id
        : formData.assignedTo
        ? formData.assignedTo
        : null;

    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignedTo: assignedToFinal ? [assignedToFinal] : [],
      dueDate: formData.dueDate,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],
      companyId: user.companyId,
      createdBy: user._id,
    };

    await createTask(payload).unwrap();

    toast({
      title: "Task Created",
      description: "Task has been successfully created.",
    });

    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "",
      dueDate: undefined,
      tags: "",
    });

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
    formData,
    setFormData,
    handleSubmit,
    isLoading,
  };
};
