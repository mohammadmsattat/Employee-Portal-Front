
export type LeaveStatus = "pending" | "approved" | "rejected";
export interface LeaveRequest {
  _id: string;
  leaveType?: { name: string };
  startDate: string;
  endDate: string;
  status: LeaveStatus;
}

// ===== UI Layer =====
