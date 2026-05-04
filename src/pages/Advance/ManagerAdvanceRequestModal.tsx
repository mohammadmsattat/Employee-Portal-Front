import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { CheckCircle2, HandCoins, X, XCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:max-w-2xl sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 bg-slate-950 px-5 py-5 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30">
              <HandCoins className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase text-emerald-100">
                {request.advanceTypeId?.typeKey || "-"}
              </p>
              <h2 className="truncate text-xl font-bold text-white">
                {t("managerAdvanceRequestModal.title")}
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
            label={t("managerAdvanceRequestModal.employee")}
            value={request.userId?.fullName}
          />
          <FieldRow
            label={t("managerAdvanceRequestModal.advanceType")}
            value={request.advanceTypeId?.typeKey}
          />
          <FieldRow
            label={t("managerAdvanceRequestModal.requestedAt")}
            value={safeFormat(request.createdAt)}
          />
          <FieldRow
            label={t("managerAdvanceRequestModal.amount")}
            value={request.amount}
          />
          <FieldRow
            label={t("managerAdvanceRequestModal.reason")}
            value={request.reason}
          />
          <FieldRow
            label={t("managerAdvanceRequestModal.status")}
            value={<StatusBadge status={request.status} />}
          />
          {request.attachment && (
            <FieldRow
              label={t("managerAdvanceRequestModal.attachment")}
              value={
                <a
                  href={request.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  {t("managerAdvanceRequestModal.viewFile")}
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
              {t("managerAdvanceRequestModal.approve")}
            </Button>
            <Button
              variant="destructive"
              className="h-11 rounded-lg"
              onClick={() => setIsRejecting(true)}
              disabled={submitting}
            >
              <XCircle className="me-2 h-4 w-4" />
              {t("managerAdvanceRequestModal.reject")}
            </Button>
          </div>
        )}

        {isRejecting && (
          <div className="space-y-3 border-t border-slate-200 p-5">
            <textarea
              placeholder={t(
                "managerAdvanceRequestModal.rejectionReasonPlaceholder",
              )}
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
                {t("managerAdvanceRequestModal.cancel")}
              </Button>
              <Button
                variant="destructive"
                className="h-11 rounded-lg"
                onClick={() => onReject(request, rejectReason)}
                disabled={submitting || !rejectReason.trim()}
              >
                {t("managerAdvanceRequestModal.submitRejection")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAdvanceRequestModal;
