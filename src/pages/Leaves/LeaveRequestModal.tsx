import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";

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
  console.log("555");
  
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // if (!request) return null;

  // ===== حل مشكلة TypeScript =====
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
    <div className="flex flex-col sm:flex-row sm:items-start py-2 sm:py-3 border-b border-gray-100 w-full">
      <div className="sm:w-1/3 text-sm font-medium text-gray-500 mb-1 sm:mb-0">
        {label}
      </div>
      <div className="sm:w-2/3 text-sm text-gray-800 break-words">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-2xl p-5 sm:p-6 border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-portal-header">
            Leave Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 sm:space-y-3">
          <FieldRow label="Employee" value={request?.userId?.fullName} />
          <FieldRow label="Leave Type" value={request?.leaveType?.typeKey} />
          <FieldRow
            label="Period"
            value={`${formatDate(request?.startDate)} – ${formatDate(request?.endDate)}`}
          />
          <FieldRow
            label="Days"
            value={calculateDays(request?.startDate, request?.endDate)}
          />
          <FieldRow
            label="Status"
            value={<StatusBadge status={request?.status} />}
          />
          <FieldRow label="Reason" value={request?.reason} />
          {request?.status === "rejected" && request?.rejectionReason && (
            <FieldRow
              label="Rejection Reason"
              value={
                <span className="text-red-600 font-medium">
                  {request.rejectionReason}
                </span>
              }
            />
          )}
          {request?.attachment && (
            <FieldRow
              label="Attachment"
              value={
                <a
                  href={request.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 transition-colors"
                >
                  View File
                </a>
              }
            />
          )}
        </div>

        {/* Actions */}
        {request?.status === "pending" && !isRejecting && (
          <div className="flex justify-end gap-2 mt-6 flex-wrap sm:flex-nowrap">
            <Button
              className="bg-green-600 text-white hover:bg-green-700 py-1.5 px-3 text-sm sm:py-2 sm:px-4"
              onClick={() => onApprove(request)}
              disabled={submitting}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={submitting}
              className="py-1.5 px-3 text-sm sm:py-2 sm:px-4"
            >
              Reject
            </Button>
          </div>
        )}

        {isRejecting && (
          <div className="space-y-3 mt-6">
            <textarea
              placeholder="Reason for rejection"
              className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={submitting}
                className="flex-1 sm:flex-none py-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={submitRejection}
                disabled={submitting}
                className="flex-1 sm:flex-none py-2"
              >
                Submit Rejection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestModal;
