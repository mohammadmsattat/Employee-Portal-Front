import { FileText } from "lucide-react";
import PortalCard from "@/components/portal/PortalCard";
import { TFunction } from "i18next";

interface LeaveBalance {
  _id: string;
  typeKey: string;
  totalAllowed: number;
  remainingDays: number;
}

interface LeaveBalanceCardProps {
  leaveBalances: LeaveBalance[] | undefined;
  t: TFunction;
}

const LeaveBalanceCard = ({ leaveBalances, t }: LeaveBalanceCardProps) => {
  return (
    <PortalCard
      title={t("homePage.leaves")}
      icon={<FileText className="h-5 w-5" />}
    >
      <div className="space-y-3 p-4">
        {leaveBalances?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            {t("homePage.noLeaveTypes", "No leave types available")}
          </p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 font-semibold text-sm text-muted-foreground border-b border-border pb-1">
              <span>{t("homePage.leaveType", "Leave Type")}</span>
              <span className="text-center">{t("homePage.total", "Total")}</span>
              <span className="text-right">{t("homePage.daysRemaining", "Remaining")}</span>
            </div>

            {leaveBalances.map((leave) => (
              <div
                key={leave._id}
                className="grid grid-cols-3 gap-2 items-center bg-muted/10 rounded-lg px-3 py-2"
              >
                <span className="capitalize text-sm font-medium">
                  {leave.typeKey}
                </span>
                <span className="text-center text-sm font-medium">
                  {leave.totalAllowed}
                </span>
                <span className="text-right text-sm font-semibold text-portal-header">
                  {leave.remainingDays}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalCard>
  );
};

export default LeaveBalanceCard;