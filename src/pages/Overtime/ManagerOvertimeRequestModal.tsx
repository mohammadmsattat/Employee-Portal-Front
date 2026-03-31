import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/portal/StatusBadge";
import { format } from "date-fns";

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
    <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100">
      <div className="sm:w-1/3 text-sm font-medium text-gray-500">
        {label}
      </div>
      <div className="sm:w-2/3 text-sm text-gray-800 mt-1 sm:mt-0 break-words">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-portal-header">
            Overtime Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-100 px-4">

          <FieldRow
            label="Employee"
            value={request.userId?.fullName}
          />

          <FieldRow
            label="Overtime Type"
            value={request.overtimeTypeId?.typeKey}
          />

          <FieldRow
            label="Work Date"
            value={safeFormat(request.workDate)}
          />

          <FieldRow
            label="Start Time"
            value={safeFormat(request.startTime)}
          />

          <FieldRow
            label="End Time"
            value={safeFormat(request.endTime)}
          />

          <FieldRow
            label="Total Hours"
            value={
              request.hours
                ? request.hours
                : calculateHours(request.startTime, request.endTime)
            }
          />

          <FieldRow
            label="Status"
            value={<StatusBadge status={request.status} />}
          />

          <FieldRow
            label="Reason"
            value={request.reason}
          />

          {request.status === "rejected" && request.rejectionReason && (
            <FieldRow
              label="Rejection Reason"
              value={
                <span className="text-red-600 font-medium">
                  {request.rejectionReason}
                </span>
              }
            />
          )}

          {request.attachment && (
            <FieldRow
              label="Attachment"
              value={
                <a
                  href={request.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  View File
                </a>
              }
            />
          )}
        </div>

        {/* Actions */}
        {request.status === "pending" && !isRejecting && (
          <div className="flex justify-end gap-3 mt-6">
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => onApprove(request)}
              disabled={submitting}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsRejecting(true)}
              disabled={submitting}
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
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRejecting(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(request, rejectReason)}
                disabled={submitting || !rejectReason.trim()}
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

export default ManagerOvertimeRequestModal;