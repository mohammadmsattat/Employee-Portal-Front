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
  leaveLogs: LeaveLog[] = [],
): LeaveBalance[] => {
  const toNumber = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const getLeaveTypeId = (lt: any): string => {
    if (!lt) return "";
    if (typeof lt === "string") return lt;
    return lt._id || "";
  };

  const getTotalAllowed = (leaveType: PolicyLeaveType) => {
    switch (leaveType.typeKey) {
      /* ================== ANNUAL ================== */
      case "annual":
        return (
          leaveType.annualRules?.reduce(
            (acc, r) => acc + toNumber(r.days),
            0,
          ) || 0
        );

      /* ================== SICK ================== */
      case "sick":
        return (
          leaveType.sickRules?.reduce((acc, r) => acc + toNumber(r.days), 0) ||
          0
        );

      /* ================== MATERNITY ================== */
      case "maternity":
        return (
          leaveType.maternityRules?.reduce(
            (acc, r) => acc + toNumber(r.days),
            0,
          ) || 0
        );

      /* ================== SINGLE RULE BASE TYPES ================== */
      case "paternity":
      case "marriage":
      case "bereavement":
      case "hajj":
      case "special":
      case "unpaid":
        return toNumber(leaveType.singleRules?.days);

      default:
        return 0;
    }
  };

  return leaveTypes.map((leaveType) => {
    /* ================= TOTAL ================= */
    const totalAllowed = getTotalAllowed(leaveType);

    /* ================= USED DAYS ================= */
    const usedDays = leaveLogs
      .filter((log) => {
        const logTypeId = getLeaveTypeId(log.leaveType);
        return logTypeId === leaveType._id;
      })
      .reduce((acc, log) => {
        const days =
          toNumber((log as any)?.calculation?.totalDays) ||
          toNumber((log as any)?.days);

        return acc + days;
      }, 0);

    /* ================= RESULT ================= */
    return {
      _id: leaveType._id,
      typeKey: leaveType.typeKey,
      policyId: leaveType.policyId,
      totalAllowed,
      usedDays,
      remainingDays: Math.max(totalAllowed - usedDays, 0),
      requiresAttachment: (leaveType as any)?.requiresAttachment || false,
    };
  });
};
