import { useState, useMemo, useEffect, useCallback } from "react";
import { differenceInDays, isBefore, isAfter, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateLeaveRequestMutation,
  useGetMyLeaveRequestsQuery,
} from "@/rtk/leaves/leaveRequestsApi";
import { useGetAllLeavesQuery } from "@/rtk/leaves/LeavesApi";
import { useGetMyLeaveLogsQuery } from "@/rtk/leaves/LeaveLogsApi";
import { calculateLeaveBalances } from "@/lib/leaveBalance";

interface FormState {
  leaveType: string;
  startDate?: Date;
  endDate?: Date;
  reason: string;
  attachment: File | null;
}

/** ✅ FIX: missing function */
const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const useAddLeaveRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toast } = useToast();

  const group = useMemo(() => {
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

  const leavePolicyId =
    group?.leavePolicy?._id ||
    group?.leavePolicy ||
    group?.policiesSnapshot?.leavePolicy?._id ||
    group?.policiesSnapshot?.leavePolicy ||
    user?.groupId?.leavePolicy?._id ||
    user?.groupId?.leavePolicy ||
    user?.payrollGroupId?.policiesSnapshot?.leavePolicy?._id ||
    user?.payrollGroupId?.policiesSnapshot?.leavePolicy ||
    "";

  const [formData, setFormData] = useState<FormState>({
    leaveType: "",
    startDate: undefined,
    endDate: undefined,
    reason: "",
    attachment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];

  const maxFileSize = 5 * 1024 * 1024;

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { data: leaveTypesData, isLoading: isLeaveTypesLoading } =
    useGetAllLeavesQuery(
      { page: 1, limit: 100, policyId: leavePolicyId },
      { skip: !leavePolicyId },
    );

  const { data: leaveLogsData } = useGetMyLeaveLogsQuery({
    page: 1,
    limit: 200,
  });

  const { data: myLeaveRequestsData } = useGetMyLeaveRequestsQuery({
    page: 1,
    limit: 1,
  });

  const leaveBalances = useMemo(() => {
    if (!leaveTypesData?.data || !leaveLogsData?.data) return [];
    return calculateLeaveBalances(leaveTypesData.data, leaveLogsData.data);
  }, [leaveTypesData, leaveLogsData]);

  const [createLeaveRequest] = useCreateLeaveRequestMutation();

const normalize = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
console.log(group);

const isHoliday = useCallback((date: Date) => {
  if (!group?.calendarRules?.length) return false;

  const d = normalize(date);

  return group.calendarRules.some((rule: any) => {
    if (rule.effectType !== "FULL_DAY_OFF") return false;

    if (rule.patternType === "SINGLE_DATE") {
      return isSameDay(d, normalize(rule.startDate));
    }

    if (rule.patternType === "RECURRING_WEEKLY") {
      const weekDays = [
        "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ];
      return rule.daysOfWeek?.includes(weekDays[d.getDay()]);
    }

    if (rule.patternType === "DATE_RANGE") {
      const start = normalize(rule.startDate);
      const end = normalize(rule.endDate);

      return d >= start && d <= end;
    }

    return false;
  });
}, [group]);

  const numberOfDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = normalizeDate(formData.startDate);
    const end = normalizeDate(formData.endDate);

    if (start > end) return 0;

    let count = 0;
    let cursor = new Date(start);

    while (cursor <= end) {
      if (!isHoliday(cursor)) count++;

      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }

    return count;
  }, [formData.startDate, formData.endDate, isHoliday]);

  const getLeaveTypeName = (type: any) => {
    if (!type?.typeKey) return "Leave";

    const map: Record<string, string> = {
      annual: "Annual Leave",
      maternity: "Maternity Leave",
      sick: "Sick Leave",
      paternity: "Paternity Leave",
      marriage: "Marriage Leave",
      bereavement: "Bereavement Leave",
      hajj: "Hajj Leave",
      unpaid: "Unpaid Leave",
    };

    return map[type.typeKey] || "Leave";
  };

  const handleDateSelect = (field: "startDate" | "endDate", date?: Date) => {
    if (!date) return;

    if (isHoliday(date)) {
      toast({
        title: "Holiday Selected",
        description: "This date is an official holiday/weekend.",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const selectedLeave = leaveBalances.find(
      (lb: any) => lb._id === formData.leaveType,
    );

    const remainingDays =
      selectedLeave?.remainingDays ??
      myLeaveRequestsData?.summary?.remaining ??
      0;

    const requiresAttachment = selectedLeave?.requiresAttachment || false;

    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason?.trim()
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isAfter(formData.startDate, formData.endDate)) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after or equal to start date.",
        variant: "destructive",
      });
      return;
    }

    if (numberOfDays > remainingDays) {
      toast({
        title: "Insufficient Balance",
        description: `You have only ${remainingDays} day(s) remaining.`,
        variant: "destructive",
      });
      return;
    }

    if (requiresAttachment && !formData.attachment) {
      toast({
        title: "Attachment Required",
        description: "This leave type requires uploading a document.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("leaveType", formData.leaveType);
      formDataToSend.append("startDate", formData.startDate.toISOString());
      formDataToSend.append("endDate", formData.endDate.toISOString());
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("managerId", user.directManager);
      formDataToSend.append("userId", user._id);
      formDataToSend.append("days", numberOfDays.toString());
      formDataToSend.append("companyId", user.companyId);

      if (formData.attachment) {
        if (!validateFile(formData.attachment)) {
          setIsSubmitting(false);
          return;
        }

        formDataToSend.append("attachment", formData.attachment);
      }

      await createLeaveRequest(formDataToSend).unwrap();

      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been successfully submitted.",
      });

      setFormData({
        leaveType: "",
        startDate: undefined,
        endDate: undefined,
        reason: "",
        attachment: null,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLeave = leaveBalances.find(
    (lb: any) => lb._id === formData.leaveType,
  );

  const effectiveSelectedLeave = selectedLeave
    ? {
        ...selectedLeave,
        remainingDays:
          selectedLeave.remainingDays ??
          myLeaveRequestsData?.summary?.remaining ??
          0,
      }
    : formData.leaveType && myLeaveRequestsData?.summary
      ? {
          _id: formData.leaveType,
          typeKey:
            leaveTypesData?.data?.find(
              (type: any) => type._id === formData.leaveType,
            )?.typeKey || "Leave",
          totalAllowed: myLeaveRequestsData.summary.totalBalance,
          usedDays: myLeaveRequestsData.summary.used,
          remainingDays: myLeaveRequestsData.summary.remaining,
          requiresAttachment:
            leaveTypesData?.data?.find(
              (type: any) => type._id === formData.leaveType,
            )?.requiresAttachment || false,
        }
      : selectedLeave;

  return {
    formData,
    setFormData,
    isSubmitting,
    leaveTypesData,
    isLeaveTypesLoading,
    leaveBalances,
    numberOfDays,
    handleDateSelect,
    handleSubmit,
    isHoliday,
    group,
    selectedLeave: effectiveSelectedLeave,
    getLeaveTypeName,
  };
};
