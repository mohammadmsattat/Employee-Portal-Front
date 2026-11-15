// useAddTaskModal.tsx - نسخة محدثة مع دعم رفع المرفقات

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUploadAttachmentMutation } from "@/rtk/Tasks/attachmentsApi";
import { useGetAllStaffQuery } from "@/rtk/Staff/StaffApi";
import { validateFile } from "@/utils/attachment.helper";

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
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [errors, setErrors] = useState<ValidationErrors>({});

  // ✅ NEW: pending files state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

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

  // ✅ NEW: beforeunload warning لو فيه ملفات معلقة
  useEffect(() => {
    if (!isOpen || pendingFiles.length === 0) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isOpen, pendingFiles.length]);

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
    setPendingFiles([]); // ✅ NEW
  };

  // ✅ NEW: Add pending file with validation
  const addPendingFile = (file: File) => {
    if (!file) return;

    const { valid, error } = validateFile(file);

    if (!valid) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // منع رفع نفس الملف مرتين (نفس الاسم + الحجم + النوع)
    const isDuplicate = pendingFiles.some(
      (f) =>
        f.name === file.name && f.size === file.size && f.type === file.type,
    );

    if (isDuplicate) {
      toast({
        title: "File already added",
        description: `"${file.name}" is already in the list.`,
        variant: "destructive",
      });
      return;
    }

    setPendingFiles((prev) => [...prev, file]);
  };

  // ✅ NEW: Remove pending file by index
  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
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
        } else if (
          formData.startDate &&
          new Date(value) < new Date(formData.startDate)
        ) {
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
          } else if (
            formData.startDate &&
            new Date(value) < new Date(formData.startDate)
          ) {
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

  // ✅ NEW: استخراج taskId من الـ response بشكل مرن
  // بيدعم الأشكال المحتملة للـ response من الـ Backend
  const extractTaskId = (response: any): string | null => {
    if (!response) return null;

    return (
      response?._id ||
      response?.id ||
      response?.data?._id ||
      response?.data?.id ||
      response?.task?._id ||
      response?.task?.id ||
      response?.data?.task?._id ||
      response?.data?.task?.id ||
      null
    );
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

      // =====================================
      // 1. CREATE TASK
      // =====================================
      const createResult = await createTask({
        listId: formData.list,
        data: payload,
      }).unwrap();

      const taskId = extractTaskId(createResult);

      if (!taskId) {
        // الـ task اتعمل بس مش عارفين الـ ID — نبلغ المستخدم
        console.error("createTask response:", createResult);
        toast({
          title: "Task Created",
          description:
            "Task was created, but attachments could not be uploaded. Please add them from the task view.",
          variant: "default",
        });
        reset();
        onClose();
        return;
      }

      // =====================================
      // 2. UPLOAD ATTACHMENTS (if any)
      // =====================================
      let uploadedCount = 0;
      let failedCount = 0;

      if (pendingFiles.length > 0) {
        setIsUploadingFiles(true);

        try {
          const results = await Promise.allSettled(
            pendingFiles.map((file) =>
              uploadAttachment({
                listId: formData.list,
                taskId,
                file,
              }).unwrap(),
            ),
          );

          uploadedCount = results.filter(
            (r) => r.status === "fulfilled",
          ).length;
          failedCount = results.filter((r) => r.status === "rejected").length;

          // لو فيه فشل، اطبع تفاصيله في الكونسول للمساعدة في الديباج
          if (failedCount > 0) {
            results.forEach((result, i) => {
              if (result.status === "rejected") {
                console.error(
                  `Failed to upload "${pendingFiles[i].name}":`,
                  result.reason,
                );
              }
            });
          }
        } finally {
          setIsUploadingFiles(false);
        }
      }

      // =====================================
      // 3. SHOW RESULT TO USER
      // =====================================
      if (failedCount > 0) {
        toast({
          title: "Task Created",
          description: `Task created with ${uploadedCount} attachment(s). ${failedCount} failed to upload. You can retry them from the task view.`,
          variant: "default",
        });
      } else if (uploadedCount > 0) {
        toast({
          title: "Task Created",
          description: `Task created successfully with ${uploadedCount} attachment(s).`,
        });
      } else {
        toast({
          title: "Task Created",
          description: "Task has been successfully created.",
        });
      }

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
    isLoading: isLoading || isUploadingFiles, // ✅ NEW: يعتبر loading لو بيرفع ملفات
    errors,
    validateField,
    // ✅ NEW
    pendingFiles,
    addPendingFile,
    removePendingFile,
  };
};
