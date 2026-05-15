// ===================== AUTH TYPES =====================

// ===== LOGIN =====
export interface LoginRequest {
  email: string;
  password: string;
}
export interface User {
  _id: string;
  fullName: string;
  email: string;
  companyId: string;
  groupId: any;

  branch?: any;
  department?: any;
  position?: any;

  phoneNumber?: string;
  nationality?: string;

  [key: string]: any;
}
export interface LoginResponse {
  status: string;
  company: string;
  token: string;
  data: User;
}
// ===== SIGN OUT =====
export interface SignOutRequest {
  email: string;
}

export interface SignOutResponse {
  status: boolean;
  message?: string;
}

// ===== FORGOT PASSWORD =====
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message?: string;
}

// ===== VERIFY RESET CODE =====
export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  status: boolean;
  message?: string;
}

// ===== RESET PASSWORD =====
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message?: string;
}

// ===================== FINGERPRINT TYPES =====================
export interface IFingerprint {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deviceId?: string;
}

export interface CreateFingerprintRequest {
  userId: string;
  fingerprintData: string;
  deviceId?: string;
  note?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

// ===================== LEAVE TYPES =====================
import { LeaveRequestStatus } from "@/interfaces";

export interface LeaveRule {
  days: number;
}

export interface PolicyLeaveType {
  _id: string;
  typeKey: string;
  policyId: string;
  annualRules?: LeaveRule[];
  sickRules?: LeaveRule[];
  maternityRules?: LeaveRule[];
  singleRules?: LeaveRule;
}

export interface LeavesResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  data: PolicyLeaveType[];
}

export interface LeaveResponse {
  status: boolean;
  data: PolicyLeaveType;
}

export type LeaveStatus = LeaveRequestStatus;

export interface LeaveType {
  _id: string;
  typeKey: string;
}

export interface userId {
  _id: string;
  fullName: string;
}

export interface LeaveRequest {
  _id: string;
  userId: userId;
  companyId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string | null;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestsResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  summary?: {
    totalBalance: number;
    used: number;
    remaining: number;
    pending: number;
  };
  data: LeaveRequest[];
}

export interface LeaveRequestResponse {
  status: boolean;
  data: LeaveRequest;
}

export interface LeaveLog {
  _id: string;
  userId: { _id: string; fullName: string; email: string };
  companyId: string;
  leaveType: { _id: string; typeKey: string; name?: string };
  leaveRequestId: string;
  startDate: string;
  endDate: string;
  days: number;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveLogsResponse {
  status: boolean;
  results: number;
  data: LeaveLog[];
}
// ===================== OVERTIME TYPES =====================
export interface OvertimeType {
  _id: string;
  typeKey: string;
  name?: string;
  description?: string;
}

export type OvertimeStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface OvertimeRequest {
  _id: string;
  userId: { _id: string; fullName: string; email: string };
  managerId: { _id: string; fullName?: string };
  companyId: string;
  overtimeTypeId: OvertimeType;
  workDate: string;
  startTime: string;
  endTime: string;
  hours?: number;
  reason: string;
  attachment?: string | null;
  rejectionReason?: string | null;
  status: OvertimeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OvertimeRequestsResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  summary?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  data: OvertimeRequest[];
}

export interface OvertimeRequestResponse {
  status: boolean;
  data: OvertimeRequest;
}
// ===================== OVERTIME TYPES =====================
export interface OvertimeType {
  _id: string;
  typeKey: string;
  name?: string;
  description?: string;
  applicableDayType?: "workday" | "holiday";
  requiresAttachment?: boolean;
  rateMultiplier?: number;
}

export interface OvertimeTypesResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  data: OvertimeType[];
}

// ===================== OVERTIME POLICIES =====================
export interface OvertimePolicy {
  _id: string;
  policyName: string;
  code: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface OvertimePoliciesResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  data: OvertimePolicy[];
}

// ===================== OVERTIME LOG TYPES =====================

export interface OvertimeLog {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email?: string;
  };
  overtimeRequestId: string;
  overtimeType: {
    _id: string;
    typeKey: string;
    name?: string;
    description?: string;
    dailyLimit?: number;
    weeklyLimit?: number;
    rateMultiplier?: number;
    requiresAttachment?: boolean;
    applicableDayType?: "workday" | "holiday";
  };
  hours: number;
  rateMultiplier: number;
  calculatedPay?: number;
  leaveEarned?: number;
  approvedBy: {
    _id: string;
    fullName: string;
    email?: string;
  };
  approvedAt: string;
  managerComment?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OvertimeLogsResponse {
  status: boolean;
  results: number;
  data: OvertimeLog[];
}
// ===================== ADVANCE POLICY =====================

export interface AdvancePolicy {
  _id: string;
  policyName: string;
  code?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvancePoliciesResponse {
  status: string;
  page: number;
  limit: number;
  totalPages: number;
  results: number;
  data: AdvancePolicy[];
}

export interface AdvancePolicyResponse {
  status: string;
  data: AdvancePolicy;
}

// ===================== ADVANCE TYPE =====================

export interface AdvanceType {
  _id: string;
  policyId: string;
  companyId: string;
  typeKey: "monthly" | "emergency";
  maxPercentageOfSalary: number;
  requiresAttachment: boolean;
  allowInstallments: boolean;
  maxMonthsInstallments?: number | null;
  maxInstallmentPercentage: number;
  minMonthsAfterJoin: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvanceTypesResponse {
  status: string;
  page: number;
  limit: number;
  totalPages: number;
  results: number;
  data: AdvanceType[];
}

export interface AdvanceTypeResponse {
  status: string;
  data: AdvanceType;
}

// ===================== ADVANCE REQUEST =====================

export type AdvanceStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid"
  | "closed";

export interface AdvanceRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  managerId: string;
  advanceTypeId: AdvanceType;
  salarySnapshot: number;
  amount: number;
  installments?: number | null;
  installmentAmount?: number | null;
  reason?: string;
  attachment?: string | null;
  status: AdvanceStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvanceRequestsResponse {
  status: boolean;
  page?: number;
  totalPages?: number;
  results: number;
  totalItems?: number;
  summary?: {
    totalAmount: number;
    approvedAmount: number;
    pending: number;
    rejected: number;
  };
  data: AdvanceRequest[];
}

export interface AdvanceRequestResponse {
  status: boolean;
  data: AdvanceRequest;
  message?: string;
}
// ================= Advance Log Interfaces =================

export interface IAdvanceUser {
  _id: string;
  fullName: string;
  email?: string;
}

export interface IAdvanceType {
  _id: string;
  name: string;
  description?: string;
}

export interface IAdvanceLog {
  _id: string;

  userId: IAdvanceUser;

  advanceRequestId: {
    _id: string;
  };

  advanceTypeId: IAdvanceType;

  salarySnapshot: number;
  approvedAmount: number;

  installments?: number | null;
  installmentAmount?: number | null;

  approvedBy: IAdvanceUser;

  approvedAt: string;

  managerComment?: string;

  companyId: string;

  createdAt: string;
  updatedAt: string;
}

export interface IAdvanceLogsResponse {
  data: IAdvanceLog[];
  total: number;
  page: number;
  limit: number;
}

// ===================== NOTIFICATION TYPES =====================

export interface IUser {
  _id: string;
  fullName: string;
  email?: string;
}

export interface INotificationEntity {
  id: string;
  model: string;
}

export interface Notification {
  _id: string;
  recipient: IUser;
  actor?: IUser;
  title: string;
  message: string;
  entity?: INotificationEntity;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  status: boolean;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  results: number;
  data: Notification[];
}

export interface UnreadCountResponse {
  status: boolean;
  count: number;
}

export interface NotificationResponse {
  status: boolean;
  data: Notification;
  message?: string;
}

export interface MarkAllReadResponse {
  status: boolean;
  modifiedCount: number;
}
// ===================== staff interfaces =====================

export interface Staff {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  position?: string;
  branch?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffsResponse {
  status: boolean;
  page: number;
  totalPages: number;
  results: number;
  totalItems: number;
  data: Staff[];
}

export interface GetAllStaffParams {
  keyword?: string;
  limit?: number;
  page?: number;
  branchId?: string;
  position?: string;
}
