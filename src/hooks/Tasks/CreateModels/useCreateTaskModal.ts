// useAddTaskModal.tsx - نسخة معدلة مع الـ Validation

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

interface ValidationErrors {
  title?: string;
  list?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  startDate?: string;
  dueDate?: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});

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

  // ✅ عند فتح المودال، تعيين الـ List المحددة كقيمة افتراضية
  useEffect(() => {
    if (isOpen && listId) {
      setFormData((prev) => ({
        ...prev,
        list: listId,
      }));
    }
  }, [isOpen, listId]);

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
    setErrors({});
  };

  // ✅ Validate a single field
  const validateField = (field: string, value: any): boolean => {
    const newErrors = { ...errors };

    switch (field) {
      case "title":
        if (!value?.trim()) {
          newErrors.title = "Title is required";
        } else {
          delete newErrors.title;
        }
        break;

      case "list":
        if (!value) {
          newErrors.list = "List is required";
        } else {
          delete newErrors.list;
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
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors.assignedTo = "Please assign a team member";
        } else {
          delete newErrors.assignedTo;
        }
        break;

      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else {
          delete newErrors.startDate;
        }
        break;

      case "dueDate":
        if (!value) {
          newErrors.dueDate = "Due date is required";
        } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
          newErrors.dueDate = "Due date must be after start date";
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

  // ✅ Validate all fields
  const validateAll = (): boolean => {
    const fieldsToValidate = [
      { field: "title", value: formData.title },
      { field: "list", value: formData.list },
      { field: "status", value: formData.status },
      { field: "priority", value: formData.priority },
      { field: "assignedTo", value: formData.assignedTo },
      { field: "startDate", value: formData.startDate },
      { field: "dueDate", value: formData.dueDate },
    ];

    let isValid = true;
    const newErrors: ValidationErrors = {};

    fieldsToValidate.forEach(({ field, value }) => {
      switch (field) {
        case "title":
          if (!value?.trim()) {
            newErrors.title = "Title is required";
            isValid = false;
          }
          break;
        case "list":
          if (!value) {
            newErrors.list = "List is required";
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
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors.assignedTo = "Please assign a team member";
            isValid = false;
          }
          break;
        case "startDate":
          if (!value) {
            newErrors.startDate = "Start date is required";
            isValid = false;
          }
          break;
        case "dueDate":
          if (!value) {
            newErrors.dueDate = "Due date is required";
            isValid = false;
          } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
            newErrors.dueDate = "Due date must be after start date";
            isValid = false;
          }
          break;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // ✅ Handle field change with validation
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    // ✅ Validate all fields before submission
    if (!validateAll()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

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

      await createTask({ listId: formData.list, data: payload }).unwrap();

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
    handleFieldChange,
    handleSubmit,
    isLoading,
    errors,
    validateField,
  };
};