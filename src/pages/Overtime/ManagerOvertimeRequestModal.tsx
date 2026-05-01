import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { CheckCircle2, TimerReset, X, XCircle } from "lucide-react";

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

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return "-";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "-";

    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(2) : "-";
  };

  const FieldRow = ({ label, value }: any) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:max-w-2xl sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 bg-slate-950 px-5 py-5 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-100 ring-1 ring-orange-400/30">
              <TimerReset className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase text-orange-100">
                {request.overtimeTypeId?.typeKey || "-"}
              </p>
              <h2 className="truncate text-xl font-bold text-white">
                {t("managerOvertimeRequestModal.title")}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-200 transition hover:bg-white/15 hover:text-white"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <FieldRow
            label={t("managerOvertimeRequestModal.employee")}
            value={request.userId?.fullName}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.overtimeType")}
            value={request.overtimeTypeId?.typeKey}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.workDate")}
            value={safeFormat(request.workDate)}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.startTime")}
            value={safeFormat(request.startTime)}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.endTime")}
            value={safeFormat(request.endTime)}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.totalHours")}
            value={
              request.hours
                ? request.hours
                : calculateHours(request.startTime, request.endTime)
            }
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.status")}
            value={<StatusBadge status={request.status} />}
          />
          <FieldRow
            label={t("managerOvertimeRequestModal.reason")}
            value={request.reason}
          />
          {request.status === "rejected" && request.rejectionReason && (
            <FieldRow
              label={t("managerOvertimeRequestModal.rejectionReason")}
              value={
                <span className="font-semibold text-red-600">
                  {request.rejectionReason}
                </span>
              }
            />
          )}
          {request.attachment && (
            <FieldRow
              label={t("managerOvertimeRequestModal.attachment")}
              value={
                <a
                  href={request.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  {t("managerOvertimeRequestModal.viewFile")}
                </a>
              }
            />
          )}
        </div>

        {request.status === "pending" && !isRejecting && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 px-5 py-4">
            <Button
              className="h-11 rounded-lg bg-green-600 text-white hover:bg-green-700"
              onClick={() => onApprove(request)}
              disabled={submitting}
            >
              <CheckCircle2 className="me-2 h-4 w-4" />
              {t("managerOvertimeRequestModal.approve")}
            </Button>
            <Button
              variant="destructive"
              className="h-11 rounded-lg"
              onClick={() => setIsRejecting(true)}
              disabled={submitting}
            >
              <XCircle className="me-2 h-4 w-4" />
              {t("managerOvertimeRequestModal.reject")}
            </Button>
          </div>
        )}

        {isRejecting && (
          <div className="space-y-3 border-t border-slate-200 p-5">
            <textarea
              placeholder={t("managerOvertimeRequestModal.rejectPlaceholder")}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 rounded-lg"
                onClick={() => setIsRejecting(false)}
                disabled={submitting}
              >
                {t("managerOvertimeRequestModal.cancel")}
              </Button>
              <Button
                variant="destructive"
                className="h-11 rounded-lg"
                onClick={() => onReject(request, rejectReason)}
                disabled={submitting || !rejectReason.trim()}
              >
                {t("managerOvertimeRequestModal.submitRejection")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerOvertimeRequestModal;
