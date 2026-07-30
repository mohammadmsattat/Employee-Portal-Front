import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { CheckCircle2, TimerReset, X, XCircle, UserRound, CalendarDays, Clock3, Paperclip } from "lucide-react";

interface Props {
  request: any;
  onClose: () => void;
  onApprove: (request: any) => void;
  onReject: (request: any, reason: string) => void;
  submitting: boolean;
}

const ManagerOvertimeRequestModal = ({
  request,
  onClose,
  onApprove,
  onReject,
  submitting,
}: Props) => {
  const { t } = useTranslation();
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  if (!request) return null;

  const safeFormat = (date: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "PPP p");
  };

  const formatDate = (date?: string | Date) =>
    date ? format(new Date(date), "PPP") : "-";

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return "-";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "-";

    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(2) : "-";
  };

  // FieldRow with table-like design
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

  const handleRejectClick = () => setIsRejecting(true);
  const submitRejection = () => onReject(request, rejectReason);

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-2xl sm:rounded-2xl">
        {/* Header with Gradient matching Layout */}
        <div
          className="relative overflow-hidden px-5 py-4 sm:px-7 sm:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
          }}
        >
          {/* Decorative blur elements */}
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-indigo-200/20 blur-2xl" />

          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-blue-200/40 sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:rounded-xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40">
                <TimerReset className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {t("managerOvertimeRequestModal.title") || "Overtime Request"}
                </p>

                <h3 className="text-lg font-bold text-blue-900">
                  {request?.overtimeTypeId?.typeKey || "Overtime Request"}
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
            <TimerReset className="h-3.5 w-3.5" />
            <span>
              {request?.hours || calculateHours(request?.startTime, request?.endTime) || "0"} hours
            </span>
          </div>
        </div>

        {/* Body - Table-like rows */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-2 sm:space-y-0 px-4 sm:border sm:rounded-lg sm:border-slate-200">
            {/* Employee */}
            <FieldRow
              label={t("managerOvertimeRequestModal.employee") || "Employee"}
              value={request?.userId?.fullName}
            />

            {/* Overtime Type */}
            <FieldRow
              label={t("managerOvertimeRequestModal.overtimeType") || "Overtime Type"}
              value={request?.overtimeTypeId?.typeKey}
            />

            {/* Work Date */}
            <FieldRow
              label={t("managerOvertimeRequestModal.workDate") || "Work Date"}
              value={formatDate(request?.workDate)}
            />

            {/* Start Time */}
            <FieldRow
              label={t("managerOvertimeRequestModal.startTime") || "Start Time"}
              value={request?.startTime ? format(new Date(request.startTime), "hh:mm a") : "-"}
            />

            {/* End Time */}
            <FieldRow
              label={t("managerOvertimeRequestModal.endTime") || "End Time"}
              value={request?.endTime ? format(new Date(request.endTime), "hh:mm a") : "-"}
            />

            {/* Total Hours */}
            <FieldRow
              label={t("managerOvertimeRequestModal.totalHours") || "Total Hours"}
              value={request?.hours || calculateHours(request?.startTime, request?.endTime) || "-"}
            />

            {/* Reason */}
            <FieldRow
              label={t("managerOvertimeRequestModal.reason") || "Reason"}
              value={request?.reason}
            />

            {/* Status */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
              <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                {t("managerOvertimeRequestModal.status") || "Status"}
              </div>
              <div className="sm:w-2/3">
                <StatusBadge status={request?.status} />
              </div>
            </div>

            {/* Rejection Reason */}
            {request?.status === "rejected" && request?.rejectionReason && (
              <div className="rounded-lg border border-red-100 bg-red-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-red-100 sm:bg-transparent sm:px-0">
                <div className="mb-1 text-xs font-medium uppercase text-red-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                  {t("managerOvertimeRequestModal.rejectionReason") || "Rejection Reason"}
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
                  {t("managerOvertimeRequestModal.attachment") || "Attachment"}
                </div>
                <div className="sm:w-2/3">
                  <a
                    href={request.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    <Paperclip className="h-4 w-4" />
                    {t("managerOvertimeRequestModal.viewFile") || "View File"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          {request?.status === "pending" && !isRejecting && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-11 w-full rounded-2xl sm:rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                {t("buttons.close") || "Close"}
              </Button>

              <Button
                variant="outline"
                onClick={handleRejectClick}
                disabled={submitting}
                className="h-11 w-full rounded-2xl sm:rounded-lg border-red-200 px-6 font-medium text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {t("managerOvertimeRequestModal.reject") || "Reject"}
              </Button>

              <Button
                className="h-11 w-full rounded-2xl sm:rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 sm:w-auto"
                onClick={() => onApprove(request)}
                disabled={submitting}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("managerOvertimeRequestModal.approve") || "Approve"}
              </Button>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("managerOvertimeRequestModal.rejectionReason") || "Rejection Reason"}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder={
                    t("managerOvertimeRequestModal.rejectPlaceholder") ||
                    "Enter rejection reason..."
                  }
                  className="min-h-[80px] resize-none rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsRejecting(false)}
                  disabled={submitting}
                  className="h-11 w-full rounded-2xl sm:rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  {t("buttons.cancel") || "Cancel"}
                </Button>

                <Button
                  variant="outline"
                  onClick={submitRejection}
                  disabled={submitting || !rejectReason.trim()}
                  className="h-11 w-full rounded-2xl sm:rounded-lg border-red-200 px-6 font-medium text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                >
                  {t("managerOvertimeRequestModal.submitRejection") || "Submit Rejection"}
                </Button>
              </div>
            </div>
          )}

          {request?.status !== "pending" && !isRejecting && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-11 rounded-2xl sm:rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerOvertimeRequestModal;