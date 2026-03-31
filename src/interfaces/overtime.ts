// ---------------------- Overtime Type ----------------------
export interface IOvertimeType {
  _id: string;
  typeKey: string;                // e.g., "normal" | "holiday"
  dailyLimit?: number;            // maximum hours per day
  weeklyLimit?: number;           // maximum hours per week
  requiresAttachment?: boolean;    // attachment required
  applicableDayType?:string;       // e.g., "weekday", "weekend", "holiday"
  rateMultiplier?: number;         // pay rate multiplier
  leaveMultiplier?: number;       // leave earned multiplier
  givesLeaveBalance?: boolean;    // whether it contributes to leave balance
  policyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------- Overtime Log ----------------------
export interface IOvertimeLog {
  _id: string;
  userId: string;
  overtimeRequestId: string;
  overtimeType: IOvertimeType;    // reference to type
  hours: number;
  approvedAt: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  managerComment?: string;
  calculatedPay?: number;

}

// ---------------------- Form State ----------------------
export interface IOvertimeFormState {
  overtimeType: string;
  workDate?: Date;
  startTime?: string;
  endTime?: string;
  hours?: number;
  reason: string;
  attachment: File | null;
}

// ---------------------- Group & User ----------------------
export interface IGroup {
  overtimePolicy?: { _id: string };
  calendarRules?: any[];           // can be further typed later
}

