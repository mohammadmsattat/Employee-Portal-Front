// hooks/SubTasks/useCreateSubTask.ts

import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { useCreateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

// ===== Types =====
type Props = {
  taskId: string;
  workspaceId: string;
  onClose: () => void;
  refetchTasks: () => void;
  isOpen: boolean;
};

interface FormState {
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string | null;
}

interface ValidationErrors {
  title?: string;
  priority?: string;
  status?: string;
  assignedTo?: string;
  dueDate?: string;
}

// ===== Default Values =====
const INITIAL_FORM_STATE: FormState = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  assignedTo: "",
  dueDate: null,
};

export const useCreateSubTask = ({
  taskId,
  workspaceId,
  onClose,
  refetchTasks,
  isOpen,
}: Props) => {
  const { toast } = useToast();
  const [createSubTask, { isLoading }] = useCreateSubTaskMutation();
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Get current user from localStorage
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // Fetch all staff members
  const { data } = useGetAllStaffQuery({});

  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);

  // ===== Reset form when modal opens =====
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }
  }, [isOpen]);

  // ===== Reset form when taskId changes =====
  useEffect(() => {
    if (isOpen && taskId) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }
  }, [taskId, isOpen]);

  // ===== Helper: Check if date is in the past =====
  const isDateInPast = (date: string | Date): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // ===== Validate a single field =====
  const validateField = (field: string, value: any): boolean => {
    const newErrors = { ...errors };

    switch (field) {
      case "title":
        if (!value?.trim()) {
          newErrors.title = "SubTask title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else if (value.trim().length > 100) {
          newErrors.title = "Title must not exceed 100 characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "status":
        if (!value) {
          newErrors.status = "Status is required";
        } else {
          delete newErrors.status;
        }
        break;

      case "priority":
        if (!value) {
          newErrors.priority = "Priority is required";
        } else {
          delete newErrors.priority;
        }
        break;

      case "assignedTo":
        if (!value) {
          newErrors.assignedTo = "Please assign a team member";
        } else {
          delete newErrors.assignedTo;
        }
        break;

      case "dueDate":
        if (!value) {
          newErrors.dueDate = "Due date is required";
        } else if (isDateInPast(value)) {
          newErrors.dueDate = "Due date cannot be in the past";
        } else {
          delete newErrors.dueDate;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Validate all fields =====
  const validateAll = (): boolean => {
    const fieldsToValidate = [
      { field: "title", value: formData.title },
      { field: "status", value: formData.status },
      { field: "priority", value: formData.priority },
      { field: "assignedTo", value: formData.assignedTo },
      { field: "dueDate", value: formData.dueDate },
    ];

    let isValid = true;
    const newErrors: ValidationErrors = {};

    fieldsToValidate.forEach(({ field, value }) => {
      switch (field) {
        case "title":
          if (!value?.trim()) {
            newErrors.title = "SubTask title is required";
            isValid = false;
          } else if (value.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters";
            isValid = false;
          } else if (value.trim().length > 100) {
            newErrors.title = "Title must not exceed 100 characters";
            isValid = false;
          }
          break;

        case "status":
          if (!value) {
            newErrors.status = "Status is required";
            isValid = false;
          }
          break;

        case "priority":
          if (!value) {
            newErrors.priority = "Priority is required";
            isValid = false;
          }
          break;

        case "assignedTo":
          if (!value) {
            newErrors.assignedTo = "Please assign a team member";
            isValid = false;
          }
          break;

        case "dueDate":
          if (!value) {
            newErrors.dueDate = "Due date is required";
            isValid = false;
          } else if (isDateInPast(value)) {
            newErrors.dueDate = "Due date cannot be in the past";
            isValid = false;
          }
          break;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // ===== Handle field change with validation =====
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // ===== Reset form and errors =====
  const reset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  // ===== Handle form submission =====
  const handleSubmit = async () => {
    // Validate all fields before submission
    if (!validateAll()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
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
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        status: formData.status,
        priority: formData.priority,
        assignedTo: assignedToFinal ? [assignedToFinal] : [],
        dueDate: formData.dueDate,
      };

      await createSubTask({
        workspaceId,
        taskId,
        data: payload,
      }).unwrap();

      toast({
        title: "Success",
        description: "SubTask created successfully",
      });

      reset();
      refetchTasks();
      onClose();
    } catch (error: any) {
      console.error("Error creating subtask:", error);
      
      const errorMessage = error?.data?.message || "Failed to create subtask";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    data,
    formData,
    setFormData,
    handleFieldChange,
    handleSubmit,
    isLoading,
    errors,
    reset,
  };
};