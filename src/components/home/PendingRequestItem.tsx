import { useNavigate } from "react-router-dom";
import { CalendarDays, FileText, Clock3, ChevronRight } from "lucide-react";

interface PendingRequestItemProps {
  request: any;
}

const requestTypeLabels: Record<string, string> = {
  Leave: "Leave",
  Advance: "Advance",
  Overtime: "Overtime",
};

export const PendingRequestItem = ({ request }: PendingRequestItemProps) => {
  const navigate = useNavigate();

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 text-emerald-600";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  const getRequestDetails = (request: any) => {
    switch (request.requestType) {
      case "Leave":
        return `${request.days} days`;
      case "Advance":
        return `$${request.amount}`;
      case "Overtime":
        return `${request.hours} hrs`;
      default:
        return "";
    }
  };

  const getRequestDate = (request: any) => {
    const date = new Date(request.createdAt);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Leave":
        return <CalendarDays className="h-4 w-4 text-blue-500 sm:h-4 sm:w-4" />;
      case "Advance":
        return <FileText className="h-4 w-4 text-emerald-500 sm:h-4 sm:w-4" />;
      default:
        return <Clock3 className="h-4 w-4 text-purple-500 sm:h-4 sm:w-4" />;
    }
  };

  const handleRequestClick = () => {
    switch (request.requestType) {
      case "Leave":
        navigate("/leaves/Leaves");
        break;
      case "Advance":
        navigate("/advance/my-advance-requests");
        break;
      case "Overtime":
        navigate("/overtime/my-overtime-requests");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="group rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm active:scale-[0.99] cursor-pointer sm:p-4"
      onClick={handleRequestClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            <span className="rounded-lg bg-slate-100 p-1.5 text-slate-500 sm:p-1.5">
              {getIcon(request.requestType)}
            </span>
            <p className="text-sm font-medium text-slate-700 sm:text-sm truncate">
              {requestTypeLabels[request.requestType] || request.requestType}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:px-2 sm:py-0.5 sm:text-[10px] ${getStatusStyles(
                request.status,
              )}`}
            >
              {request.status}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:mt-1.5 sm:gap-2 sm:text-xs">
            <span className="font-medium text-slate-600">
              {getRequestDetails(request)}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300 sm:h-1 sm:w-1" />
            <span>{getRequestDate(request)}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-400 sm:h-4 sm:w-4" />
      </div>
    </div>
  );
};