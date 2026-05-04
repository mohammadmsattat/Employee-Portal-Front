import { PolicyLeaveType, LeaveLog } from "@/rtk/interfaces";

export interface LeaveBalance {
  _id: string;
  typeKey: string;
  policyId?: string;
  totalAllowed: number;
  usedDays: number;
  remainingDays: number;
  requiresAttachment?: boolean;
}

export const calculateLeaveBalances = (
  leaveTypes: PolicyLeaveType[] = [],
  leaveLogs: LeaveLog[] = []
): LeaveBalance[] => {
  const toNumber = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getLeaveTypeId = (leaveType: unknown) => {
    if (!leaveType) return "";
    if (typeof leaveType === "string") return leaveType;
    return (leaveType as { _id?: string })._id || "";
  };

  return leaveTypes.map((leaveType) => {
    let totalAllowed = 0;

    switch (leaveType.typeKey) {
      case "annual":
        if (leaveType.annualRules?.length) {
          totalAllowed = toNumber(leaveType.annualRules[0].days);
        }
        break;

      case "sick":
        if (leaveType.sickRules?.length) {
          totalAllowed = leaveType.sickRules.reduce(
            (acc, rule) => acc + toNumber(rule.days),
            0
          );
        }
        break;

      case "maternity":
        if (leaveType.maternityRules?.length) {
          totalAllowed = leaveType.maternityRules.reduce(
            (acc, rule) => acc + toNumber(rule.days),
            0
          );
        }
        break;

      default:
        totalAllowed = toNumber(leaveType.singleRules?.days);
        break;
    }

    const usedDays = leaveLogs
      .filter((log) => getLeaveTypeId(log.leaveType) === leaveType?._id)
      .reduce((acc, log) => acc + toNumber(log.days), 0);

    return {
      _id: leaveType._id,
      typeKey: leaveType.typeKey,
      policyId: leaveType.policyId,
      totalAllowed,
      usedDays,
      remainingDays: Math.max(totalAllowed - usedDays, 0),
      requiresAttachment: (leaveType as any).requiresAttachment || false,
    };
  });
};
