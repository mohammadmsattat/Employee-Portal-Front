import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { CheckCircle2, HandCoins, X, XCircle, UserRound, CalendarDays, Paperclip } from "lucide-react";

interface Props {
  request: any;
  onClose: () => void;
  onApprove: (request: any) => void;
  onReject: (request: any, reason: string) => void;
  submitting: boolean;
}

const ManagerAdvanceRequestModal = ({
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
console.log(request);

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
                <HandCoins className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {t("managerAdvanceRequestModal.title") || "Advance Request"}
                </p>

                <h3 className="text-lg font-bold text-blue-900">
                  {request?.advanceTypeId?.typeKey || "Advance Request"}
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
            <HandCoins className="h-3.5 w-3.5" />
            <span>
              {request?.amount || "0"} {t("managerAdvanceRequestModal.amount") || "amount"}
            </span>
          </div>
        </div>

        {/* Body - Table-like rows */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-2 sm:space-y-0 px-4 sm:border sm:rounded-lg sm:border-slate-200">
            {/* Employee */}
            <FieldRow
              label={t("managerAdvanceRequestModal.employee") || "Employee"}
              value={request?.userId?.fullName}
            />

            {/* Advance Type */}
            <FieldRow
              label={t("managerAdvanceRequestModal.advanceType") || "Advance Type"}
              value={request?.advanceTypeId?.typeKey}
            />

            {/* Requested At */}
            <FieldRow
              label={t("managerAdvanceRequestModal.requestedAt") || "Requested At"}
              value={safeFormat(request?.createdAt)}
            />

            {/* Amount */}
            <FieldRow
              label={t("managerAdvanceRequestModal.amount") || "Amount"}
              value={request?.amount}
            />

            {/* Reason */}
            <FieldRow
              label={t("managerAdvanceRequestModal.reason") || "Reason"}
              value={request?.reason}
            />

            {/* Status */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
              <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                {t("managerAdvanceRequestModal.status") || "Status"}
              </div>
              <div className="sm:w-2/3">
                <StatusBadge status={request?.status} />
              </div>
            </div>

            {/* Attachment */}
            {request?.attachment && (
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
                <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
                  {t("managerAdvanceRequestModal.attachment") || "Attachment"}
                </div>
                <div className="sm:w-2/3">
                  <a
                    href={request.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    <Paperclip className="h-4 w-4" />
                    {t("managerAdvanceRequestModal.viewFile") || "View File"}
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
                {t("managerAdvanceRequestModal.reject") || "Reject"}
              </Button>

              <Button
                className="h-11 w-full rounded-2xl sm:rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 sm:w-auto"
                onClick={() => onApprove(request)}
                disabled={submitting}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("managerAdvanceRequestModal.approve") || "Approve"}
              </Button>
            </div>
          )}

          {isRejecting && (
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("managerAdvanceRequestModal.rejectionReason") || "Rejection Reason"}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder={
                    t("managerAdvanceRequestModal.rejectionReasonPlaceholder") ||
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
                  {t("managerAdvanceRequestModal.submitRejection") || "Submit Rejection"}
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
                {t("buttons.close") || "Close"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAdvanceRequestModal;