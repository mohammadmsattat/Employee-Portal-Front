import { cn } from "@/lib/utils";

type TaskStatus =
  | "todo"
  | "in_progress"
  | "review"
  | "done"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusStyles: Record<TaskStatus, string> = {
    todo: "bg-slate-100 text-slate-600 border-slate-200",

    in_progress: "bg-blue-100 text-blue-600 border-blue-200",

    review: "bg-yellow-100 text-yellow-700 border-yellow-200",

    done: "bg-green-100 text-green-700 border-green-200",

    pending: "bg-primary/10 text-primary border-primary/20",

    approved:
      "bg-status-approved/10 text-status-approved border-status-approved/20",

    rejected:
      "bg-status-rejected/10 text-status-rejected border-status-rejected/20",

    cancelled:
      "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
  };

  const statusLabels: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "In Review",
    done: "Done",

    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;