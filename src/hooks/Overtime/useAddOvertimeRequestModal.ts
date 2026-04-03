import { useState, useMemo, useEffect } from "react";
import { differenceInMinutes, isAfter, isBefore, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useCreateOvertimeRequestMutation } from "@/rtk/Overtime/overtimeRequestsApi";
import { useGetAllOvertimeTypesQuery } from "@/rtk/Overtime/overtimeTypeApi";
import { useGetMyOvertimeLogsQuery } from "@/rtk/Overtime/overtimeLogs";

// Import Overtime types
import type {
  IOvertimeType,
  IOvertimeFormState,
  IGroup,
  IUser,
  IOvertimeLog,
} from "@/interfaces";
import { OvertimeLog } from "@/rtk/interfaces";

export const useAddOvertimeRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<IOvertimeFormState>({
    overtimeType: "",
    workDate: undefined,
    startTime: undefined,
    endTime: undefined,
    hours: undefined,
    reason: "",
    attachment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const group: IGroup | null = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("group") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const {
    data: overtimeTypesData,
    isLoading: isOvertimeTypesLoading,
    error,
  } = useGetAllOvertimeTypesQuery(
    { policyId: group?.overtimePolicy?._id || "" },
    { skip: !group?.overtimePolicy?._id },
  );

  const { data: overtimeLogs } = useGetMyOvertimeLogsQuery({
    page: 1,
    limit: 50,
  });

  const [createOvertimeRequest] = useCreateOvertimeRequestMutation();

  // ---------------------- File Validation ----------------------
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File) => {
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const isMimeValid = allowedMimeTypes.includes(file.type);
    const isExtensionValid = allowedExtensions.includes(extension);

    if (!isMimeValid || !isExtensionValid) {
      toast({
        title: "Invalid File Type",
        description: "Allowed formats: JPG, PNG, PDF, DOC, DOCX only.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // ---------------------- Helpers ----------------------
  const calculateHours = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);
    const startDate = new Date(0, 0, 0, sH, sM);
    const endDate = new Date(0, 0, 0, eH, eM);
    const diffMinutes = differenceInMinutes(endDate, startDate);
    return diffMinutes > 0 ? diffMinutes / 60 : 0;
  };

  const parseTimeToDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const handleDateSelect = (field: keyof IOvertimeFormState, date: Date) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const isHoliday = (date: Date) => {
    if (!group?.calendarRules) return false;

    return group.calendarRules.some((rule: any) => {
      if (rule.effectType !== "FULL_DAY_OFF") return false;

      if (rule.patternType === "SINGLE_DATE")
        return isSameDay(date, new Date(rule.startDate));

      if (rule.patternType === "RECURRING_WEEKLY") {
        const weekDays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return rule.daysOfWeek?.some(
          (day: string) => weekDays[date.getDay()] === day,
        );
      }

      if (rule.patternType === "DATE_RANGE") {
        const start = new Date(rule.startDate);
        const end = new Date(rule.endDate);
        return (
          isSameDay(date, start) ||
          isSameDay(date, end) ||
          (isAfter(date, start) && isBefore(date, end))
        );
      }

      return false;
    });
  };

  const selectedOvertime: IOvertimeType | null = useMemo(() => {
    return (
      overtimeTypesData?.data?.find((o) => o._id === formData.overtimeType) ||
      null
    );
  }, [formData.overtimeType, overtimeTypesData]);

  // ---------------------- Effects ----------------------
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const hours = calculateHours(formData.startTime, formData.endTime);
      setFormData((prev) => ({ ...prev, hours }));
    } else {
      setFormData((prev) => ({ ...prev, hours: undefined }));
    }
  }, [formData.startTime, formData.endTime]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ---------------------- Submit Handler ----------------------
  const handleSubmit = async () => {
    if (!user) return;

    if (
      !formData.overtimeType ||
      !formData.workDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.reason
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOvertime) return;

    const startTimeDate = parseTimeToDate(
      formData.workDate,
      formData.startTime,
    );
    const endTimeDate = parseTimeToDate(formData.workDate, formData.endTime);
    const hours = differenceInMinutes(endTimeDate, startTimeDate) / 60;

    if (endTimeDate <= startTimeDate) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOvertime.dailyLimit && hours > selectedOvertime.dailyLimit) {
      toast({
        title: "Daily Limit Exceeded",
        description: `Max hours per day: ${selectedOvertime.dailyLimit}`,
        variant: "destructive",
      });
      return;
    }

    if (selectedOvertime.weeklyLimit) {
      const startOfWeek = new Date(formData.workDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const weeklyHours =
        overtimeLogs?.data
          ?.filter((log: OvertimeLog) => {
            const logDate = new Date(log.approvedAt);
            const logUserId = log.userId._id; // Use the _id field
            return (
              logDate >= startOfWeek &&
              logDate <= formData.workDate! &&
              log.overtimeType._id === selectedOvertime._id &&
              logUserId === user._id
            );
          })
          .reduce((sum, log) => sum + log.hours, 0) || 0;

      if (weeklyHours + hours > selectedOvertime.weeklyLimit) {
        toast({
          title: "Weekly Limit Exceeded",
          description: `Max hours per week for this overtime type: ${selectedOvertime.weeklyLimit}`,
          variant: "destructive",
        });
        return;
      }
    }

    if (selectedOvertime.requiresAttachment && !formData.attachment) {
      toast({
        title: "Attachment Required",
        description: "This overtime type requires uploading a document.",
        variant: "destructive",
      });
      return;
    }

    if (formData.attachment && !validateFile(formData.attachment)) return;

    setIsSubmitting(true);

    try {
      const formToSend = new FormData();
      formToSend.append("overtimeTypeId", formData.overtimeType);
      formToSend.append("workDate", formData.workDate.toISOString());
      formToSend.append("startTime", startTimeDate.toISOString());
      formToSend.append("endTime", endTimeDate.toISOString());
      formToSend.append("hours", hours.toString());
      formToSend.append("reason", formData.reason);
      formToSend.append("userId", user._id);
      formToSend.append("companyId", user.companyId);
      formToSend.append("managerId", user.directManager);

      if (formData.attachment)
        formToSend.append("attachment", formData.attachment);

      await createOvertimeRequest(formToSend).unwrap();

      toast({
        title: "Overtime Request Submitted",
        description: "Your overtime request has been successfully submitted.",
      });

      setFormData({
        overtimeType: "",
        workDate: undefined,
        startTime: undefined,
        endTime: undefined,
        hours: undefined,
        reason: "",
        attachment: null,
      });

      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit overtime request.",
        variant: "destructive",
      });
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    overtimeTypesData,
    isOvertimeTypesLoading,
    handleSubmit,
    calculateHours,
    selectedOvertime,
    group,
    isHoliday,
    handleDateSelect,
    validateFile,
  };
};
