// src/Api/GlobalData.ts

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

// ================= AUTH =================
export const HrLogInEndPoint = "/api/hrauth/login";
export const HrSignOutEndPoint = "/api/hr/singout";
export const HrSwitchCompanyEndPoint = "/api/hrauth/switch-company";

// ===== PASSWORD RESET =====
export const HrForgotPasswordEndPoint = "/api/hrauth/forgot-password";
export const HrVerifyResetCodeEndPoint = "/api/hrauth/verify-resetcode";
export const HrResetPasswordEndPoint = "/api/hrauth/reset-password";

export const fingerprintEndPoint = "/api/finger-print/loged";
export const fingerprintByDayEndPoint = "/api/finger-print/days";
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

//staff endpoint
export const StaffEndPoint = "/api/staff";

//tasks Endpoints
export const taskEndPoint = "/api/tasks";
export const subTaskEndPoint = "/api/subtasks";
export const commentEndPoint = "/api/comments";
export const attachmentEndPoint = "/api/attachments";

export const workspaceEndPoint = "/api/workspace";
export const folderEndPoint = "/api/folder";

export const buildListUrl = (workspaceId: string, folderId: string) =>
  `/api/workspaces/${workspaceId}/folders/${folderId}/lists`;

export const buildFolderUrl = (workspaceId: string) =>
  `/api/workspaces/${workspaceId}/folders`;
export const buildTaskUrl = (listId: string) => `/api/lists/${listId}/tasks`;

export const buildSubTaskUrl = (taskId: string) =>
  `/api/tasks/${taskId}/subtasks`;

export const timeTrackingEndPoint = "/api/time-tracking";
// ================= EXPORT BASE =================
export default baseURL;
