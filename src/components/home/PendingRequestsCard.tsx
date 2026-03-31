import { Clock } from "lucide-react";
import PortalCard from "@/components/portal/PortalCard";
import { TFunction } from "i18next";

interface PendingRequest {
  _id: string;
  status: string;
  requestType: "Leave" | "Advance" | "Overtime";
  startDate?: string;
  endDate?: string;
  leaveType?: { typeKey: string };
  advanceTypeId?: { typeKey: string };
  overtimeTypeId?: { typeKey: string };
  amount?: number;
  startTime?: string;
  endTime?: string;
  attachment?: string | null;
}

interface PendingRequestsCardProps {
  pendingRequests: PendingRequest[];
  t: TFunction;
}

const PendingRequestsCard = ({
  pendingRequests,
  t,
}: PendingRequestsCardProps) => {
  return (
    <PortalCard
      title={t("homePage.pendingRequests", "Pending Requests")}
      icon={<Clock className="h-5 w-5" />}
    >
      {pendingRequests.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          {t("homePage.noPendingRequests", "No pending requests")}
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {/* Header */}
          <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground px-3 pb-2 border-b">
            <span>{t("homePage.type", "Type")}</span>
            <span className="text-center">
              {t("homePage.details", "Details")}
            </span>
            <span className="text-right">{t("homePage.status", "Status")}</span>
          </div>

          {/* Rows */}
          {pendingRequests.map((req) => {
            let typeLabel = "";
            let details: JSX.Element | string = "-";

            if (req.requestType === "Leave") {
              typeLabel = req.leaveType?.typeKey
                ? `${req.leaveType.typeKey} ${t("homePage.leave", "Leave")}`
                : t("homePage.leave", "Leave");

              details = (
                <div className="flex flex-col items-center space-y-1 text-sm text-muted-foreground">
                  <span>
                    {req.startDate && req.endDate
                      ? `${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}`
                      : "-"}
                  </span>
                </div>
              );
            }

            if (req.requestType === "Advance") {
              typeLabel = req.advanceTypeId?.typeKey
                ? `${req.advanceTypeId.typeKey} ${t("homePage.advance", "Advance")}`
                : t("homePage.advance", "Advance");

              details = (
                <div className="flex flex-col items-center space-y-1 text-sm text-muted-foreground">
                  <span>
                    {t("homePage.amount", "Amount")}: {req.amount ?? "-"}
                  </span>
                </div>
              );
            }

            if (req.requestType === "Overtime") {
              typeLabel = req.overtimeTypeId?.typeKey
                ? `${req.overtimeTypeId.typeKey} ${t("homePage.overtime", "Overtime")}`
                : t("homePage.overtime", "Overtime");

              details = (
                <div className="flex flex-col items-center space-y-1 text-sm text-muted-foreground">
                  <span>
                    {req.startTime && req.endTime
                      ? `${new Date(req.startTime).toLocaleDateString()} - ${new Date(req.endTime).toLocaleDateString()}`
                      : "-"}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={req._id}
                className="grid grid-cols-3 items-center px-3 py-2 rounded-lg bg-muted/10"
              >
                <span className="capitalize text-sm font-medium">
                  {typeLabel}
                </span>
                <span className="text-center">{details}</span>
                <span className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                    {req.status}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </PortalCard>
  );
};

export default PendingRequestsCard;
