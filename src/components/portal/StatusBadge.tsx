import { LeaveRequestStatus } from "@/interfaces";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: LeaveRequestStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusStyles = {
    pending: "bg-primary/10 text-primary border-primary/20",
    approved:
      "bg-status-approved/10 text-status-approved border-status-approved/20",
    rejected:
      "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
    cancelled:
      "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: ' "cancelled"',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
