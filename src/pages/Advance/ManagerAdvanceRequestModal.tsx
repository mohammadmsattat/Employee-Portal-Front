import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface Props {
  request: any;
  onClose: () => void;
  onApprove: (request: any) => void;
  onReject: (request: any, reason: string) => void;
  submitting: boolean;
}

const ManagerAdvanceRequestModal = ({ request, onClose, onApprove, onReject, submitting }: Props) => {
  const {t} = useTranslation();
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
    <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100">
      <div className="sm:w-1/3 text-sm font-medium text-gray-500">{label}</div>
      <div className="sm:w-2/3 text-sm text-gray-800 mt-1 sm:mt-0 break-words">{value || "-"}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-portal-header">{t("managerAdvanceRequestModal.title")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-100 px-4">
          <FieldRow label={t("managerAdvanceRequestModal.employee")} value={request.userId?.fullName} />
          <FieldRow label={t("managerAdvanceRequestModal.advanceType")} value={request.advanceTypeId?.typeKey} />
          <FieldRow label={t("managerAdvanceRequestModal.requestedAt")} value={safeFormat(request.createdAt)} />
          <FieldRow label={t("managerAdvanceRequestModal.amount")} value={request.amount} />
          <FieldRow label={t("managerAdvanceRequestModal.reason")} value={request.reason} />
          <FieldRow label={t("managerAdvanceRequestModal.status")} value={<StatusBadge status={request.status} />} />
          {request.attachment && (
            <FieldRow
              label={t("managerAdvanceRequestModal.attachment")}
              value={
                <a href={request.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                  {t("managerAdvanceRequestModal.viewFile")}
                </a>
              }
            />
          )}
        </div>

        {/* Actions */}
        {request.status === "pending" && !isRejecting && (
          <div className="flex justify-end gap-3 mt-6">
            <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => onApprove(request)} disabled={submitting}>
              {t("managerAdvanceRequestModal.approve")}
            </Button>
            <Button variant="destructive" onClick={() => setIsRejecting(true)} disabled={submitting}>
              {t("managerAdvanceRequestModal.reject")}
            </Button>
          </div>
        )}

        {isRejecting && (
          <div className="space-y-3 mt-6">
            <textarea
              placeholder={t("managerAdvanceRequestModal.rejectionReasonPlaceholder")}
              className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={submitting}>
                {t("managerAdvanceRequestModal.cancel")}
              </Button>
              <Button variant="destructive" onClick={() => onReject(request, rejectReason)} disabled={submitting || !rejectReason.trim()}>
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