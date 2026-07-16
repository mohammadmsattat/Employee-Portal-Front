// components/LeaveRequestViewModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  FileText,
  Paperclip,
  X,
  Clock3,
  UserRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveRequestViewModalProps {
  request: any;
  onClose: () => void;
}

const LeaveRequestViewModal = ({
  request,
  onClose,
}: LeaveRequestViewModalProps) => {
  const { t } = useTranslation();

  const calculateDays = (start?: string | Date, end?: string | Date) => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.max(1, Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  const formatDate = (date?: string | Date) =>
    date ? format(new Date(date), "PPP") : "-";

  const formatTime = (date?: string | Date) =>
    date ? format(new Date(date), "PPp") : "-";

  // الحصول على حالة الخطوة
  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "border-emerald-200 bg-emerald-50";
      case "rejected":
        return "border-rose-200 bg-rose-50";
      case "pending":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-slate-200 bg-slate-50";
    }
  };

  // الحصول على اسم الموافق
  const getApproverName = (step: any) => {
    if (step.approverId?.fullName) return step.approverId.fullName;
    if (step.positionId?.name) return step.positionId.name;
    return "Pending";
  };

  // FieldRow component
  const FieldRow = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
      <div className="mb-1 text-xs font-medium uppercase text-slate-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
        {label}
      </div>
      <div className="break-words text-sm font-medium text-gray-800 sm:w-2/3 sm:font-normal">
        {value || "-"}
      </div>
    </div>
  );

  // Approval Flow Component
  const ApprovalFlow = ({ approval }: { approval: any }) => {
    if (!approval?.steps?.length) return null;

    const currentStepIndex = approval.currentStep
      ? Math.min(approval.currentStep - 1, approval.steps.length - 1)
      : 0;

    return (
      <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
        <div className="mb-2 text-xs font-medium uppercase text-slate-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
          Approval Flow
        </div>
        <div className="sm:w-2/3 space-y-3">
          {approval.steps.map((step: any, index: number) => {
            const isActive = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            const isFuture = index > currentStepIndex;
            const isLast = index === approval.steps.length - 1;

            return (
              <div key={index} className="relative">
                {/* الخط العمودي */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-4 top-8 w-0.5 h-6",
                      isPast ? "bg-emerald-400" : "bg-slate-200",
                    )}
                  />
                )}

                <div className="flex items-start gap-3">
                  {/* النقطة الزمنية */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-white",
                      step.status === "approved" && "bg-emerald-100",
                      step.status === "rejected" && "bg-rose-100",
                      step.status === "pending" && isActive && "bg-amber-100",
                      step.status === "pending" && !isActive && "bg-slate-100",
                    )}
                  >
                    {getStepStatusIcon(step.status)}
                  </div>

                  {/* محتوى الخطوة */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800">
                        {step.stepName || `Step ${step.stepNumber}`}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                          step.status === "approved" &&
                            "border-emerald-200 bg-emerald-50 text-emerald-600",
                          step.status === "rejected" &&
                            "border-rose-200 bg-rose-50 text-rose-600",
                          step.status === "pending" &&
                            isActive &&
                            "border-amber-200 bg-amber-50 text-amber-600",
                          step.status === "pending" &&
                            !isActive &&
                            "border-slate-200 bg-slate-50 text-slate-500",
                        )}
                      >
                        {step.status || "pending"}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      {step.approverId?.fullName ? (
                        <>
                          <User className="h-3 w-3" />
                          <span>{step.approverId.fullName}</span>
                        </>
                      ) : step.positionId?.name ? (
                        <>
                          <Briefcase className="h-3 w-3" />
                          <span>{step.positionId.name}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">No assignee</span>
                      )}
                    </div>

                    {/* تاريخ الإجراء */}
                    {step.actedAt && (
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {formatTime(step.actedAt)}
                      </div>
                    )}

                    {/* تعليق */}
                    {step.comment && (
                      <div className="mt-1 text-xs text-slate-600 bg-white/60 p-1.5 rounded border border-slate-100">
                        <span className="text-slate-400">💬 </span>
                        {step.comment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-2xl sm:rounded-2xl">
        {/* Header */}
        <div
          className="relative overflow-hidden px-5 py-4 sm:px-7 sm:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
          }}
        >
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-indigo-200/20 blur-2xl" />

          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-blue-200/40 sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:rounded-xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40">
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {t("leaveRequestModal.title") || "Leave Request"}
                </p>
                <h3 className="text-lg font-bold text-blue-900">
                  {request?.leaveType?.typeKey || "Leave Request"}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>
              {calculateDays(request?.startDate, request?.endDate)}{" "}
              {t("leaveRequestModal.days") || "days"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-2 sm:space-y-0 px-4 sm:border sm:rounded-lg sm:border-slate-200">
            {/* Leave Type */}
            <FieldRow
              label={t("leaveRequestModal.leaveType") || "Leave Type"}
              value={request?.leaveType?.typeKey}
            />

            {/* Date Range */}
            <FieldRow
              label="Date Range"
              value={`${formatDate(request?.startDate)} - ${formatDate(request?.endDate)}`}
            />

            {/* Days */}
            <FieldRow
              label={t("leaveRequestModal.days") || "Days"}
              value={`${calculateDays(request?.startDate, request?.endDate)} days`}
            />

            {/* Status */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
              <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                {t("leaveRequestModal.status") || "Status"}
              </div>
              <div className="sm:w-2/3">
                <StatusBadge status={request?.status} />
              </div>
            </div>

            {/* Reason */}
            <FieldRow
              label={t("leaveRequestModal.reason") || "Reason"}
              value={request?.reason}
            />

            {/* Rejection Reason */}
            {request?.status === "rejected" && request?.rejectionReason && (
              <div className="rounded-lg border border-red-100 bg-red-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-red-100 sm:bg-transparent sm:px-0">
                <div className="mb-1 text-xs font-medium uppercase text-red-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                  {t("leaveRequestModal.rejectionReason") || "Rejection Reason"}
                </div>
                <div className="break-words text-sm font-medium text-red-600 sm:w-2/3 sm:font-normal">
                  {request.rejectionReason}
                </div>
              </div>
            )}

            {/* Attachment */}
            {request?.attachment && (
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
                <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                  {t("leaveRequestModal.attachment") || "Attachment"}
                </div>
                <div className="sm:w-2/3">
                  <a
                    href={request.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    <Paperclip className="h-4 w-4" />
                    {t("leaveRequestModal.viewFile") || "View File"}
                  </a>
                </div>
              </div>
            )}

            {/* Approval Flow */}
            <ApprovalFlow approval={request?.approval} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="h-11 w-full rounded-2xl sm:rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestViewModal;
