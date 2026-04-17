// src/Api/GlobalData.ts

const baseURL = "http://localhost:8001";
// const baseURL = "http://192.168.137.1:8001";

// ================= AUTH =================
export const HrLogInEndPoint = "/api/hrauth/login";
export const HrSignOutEndPoint = "/api/hr/singout";

// ===== PASSWORD RESET =====
export const HrForgotPasswordEndPoint = "/api/hrauth/forgot-password";
export const HrVerifyResetCodeEndPoint = "/api/hrauth/verify-resetcode";
export const HrResetPasswordEndPoint = "/api/hrauth/reset-password";

export const fingerprintEndPoint = "/api/finger-print/loged";
export const leavesEndPoint = "/api/leaves";
export const leaveRequestEndPoint = "/api/leave-request";
export const leavesLogsEndPoint = "/api/leave-logs";

export const overtimeRequestEndPoint = "/api/overtime-request";
export const overtimePolicyEndPoint = "/api/overtime-policy";
export const overtimeTypeEndPoint = "/api/overtime-types";
export const overtimeLogsEndPoint = "/api/overtime-logs";

export const advancePolicyEndPoint = "/api/advance-policy";
export const advanceTypeEndPoint = "/api/advance-types";
export const advanceRequestEndPoint = "/api/advance-request";
export const advanceLogsEndPoint = "/api/advance-logs";

export const notificationsEndPoint = "/api/notification";

//tasks Endpoints
export const taskEndPoint = "/api/tasks";
export const subTaskEndPoint = "/api/subtasks";
export const commentEndPoint = "/api/comments";
export const attachmentEndPoint = "/api/attachments";

// ================= EXPORT BASE =================
export default baseURL;
