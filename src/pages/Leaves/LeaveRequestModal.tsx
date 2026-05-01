import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Paperclip,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

interface LeaveRequestModalProps {
  request: any;
  onClose: () => void;
  onApprove: (req: any) => void;
  onReject: (req: any, reason: string) => void;
  submitting: boolean;
}

const LeaveRequestModal = ({
  request,
  onClose,
  onApprove,
  onReject,
  submitting,
}: LeaveRequestModalProps) => {
  const { t } = useTranslation();

  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const calculateDays = (start?: string | Date, end?: string | Date) => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.max(1, Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1);
  };

  const formatDate = (date?: string | Date) =>
    date ? format(new Date(date), "PPP") : "-";

  const handleRejectClick = () => setIsRejecting(true);
  const submitRejection = () => onReject(request, rejectReason);

  const FieldRow = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3 sm:flex sm:w-full sm:items-start sm:border-0 sm:border-b sm:border-gray-100 sm:bg-transparent sm:px-0">
      <div className="mb-1 text-xs font-medium uppercase text-gray-500 sm:mb-0 sm:w-1/3 sm:text-sm sm:normal-case">
        {label}
      </div>
      <div className="break-words text-sm font-medium text-gray-800 sm:w-2/3 sm:font-normal">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 px-0 pt-8 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-gray-200 bg-white p-4 shadow-xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-gray-200 pb-4 sm:mb-6 sm:pb-2">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-blue-600 sm:hidden">
              <FileText className="h-4 w-4" />
              <span>{request?.leaveType?.typeKey || "-"}</span>
            </div>
            <h2 className="text-xl font-bold text-portal-header sm:text-2xl">
              {t("leaveRequestModal.title")}
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500 sm:hidden">
              {request?.userId?.fullName || "-"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-gray-500 transition-colors hover:bg-slate-50 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-[auto_1fr] gap-3 rounded-lg bg-slate-50/70 p-4 sm:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gray-200">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">
              {request?.userId?.fullName || "-"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={request?.status} />
              <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium">
                {calculateDays(request?.startDate, request?.endDate)}{" "}
                {t("leaveRequestModal.days")}
              </span>
            </div>
          </div>
          <div className="col-span-2 mt-1 flex items-center gap-2 rounded-md bg-gray-200 px-3 py-2 text-sm">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="min-w-0">
              {formatDate(request?.startDate)} - {formatDate(request?.endDate)}
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-2 gap-x-2 md:block">
            <div className="md:w-full">
              <FieldRow
                label={t("leaveRequestModal.employee")}
                value={request?.userId?.fullName}
              />
            </div>

            <div className="md:w-full">
              <FieldRow
                label={t("leaveRequestModal.leaveType")}
                value={request?.leaveType?.typeKey}
              />
            </div>
          </div>

          <FieldRow
            label={t("leaveRequestModal.reason")}
            value={request?.reason}
          />

          {request?.status === "rejected" && request?.rejectionReason && (
            <FieldRow
              label={t("leaveRequestModal.rejectionReason")}
              value={
                <span className="font-medium text-red-600">
                  {request.rejectionReason}
                </span>
              }
            />
          )}

          {request?.attachment && (
            <FieldRow
              label={t("leaveRequestModal.attachment")}
              value={
                <a
                  href={request.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 underline transition-colors hover:text-blue-700"
                >
                  <Paperclip className="h-4 w-4" />
                  {t("leaveRequestModal.viewFile")}
                </a>
              }
            />
          )}
        </div>

        {request?.status === "pending" && !isRejecting && (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2">
            <Button
              className="h-11 bg-green-600 text-sm text-white hover:bg-green-700 sm:h-10 sm:px-4"
              onClick={() => onApprove(request)}
              disabled={submitting}
            >
              <CheckCircle2 className="me-2 h-4 w-4" />
              {t("leaveRequestModal.approve")}
            </Button>

            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={submitting}
              className="h-11 text-sm sm:h-10 sm:px-4"
            >
              <XCircle className="me-2 h-4 w-4" />
              {t("leaveRequestModal.reject")}
            </Button>
          </div>
        )}

        {isRejecting && (
          <div className="mt-6 space-y-3">
            <textarea
              placeholder={t("leaveRequestModal.rejectPlaceholder")}
              className="w-full resize-none rounded-md border border-slate-200 p-3 text-start text-sm outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={submitting}
                className="h-11 sm:h-10 sm:flex-none"
              >
                {t("leaveRequestModal.cancel")}
              </Button>

              <Button
                variant="destructive"
                onClick={submitRejection}
                disabled={submitting}
                className="h-11 sm:h-10 sm:flex-none"
              >
                {t("leaveRequestModal.submitRejection")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestModal;

