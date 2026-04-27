// src/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./Auth/AuthApi";

import { fingerprintApi } from "./Fingerprint/fingerprintApi";
import { leavesApi } from "./leaves/LeavesApi";
import { leaveRequestsApi } from "./leaves/leaveRequestsApi";
import { leaveLogsApi } from "./leaves/LeaveLogsApi";
import { overtimeRequestsApi } from "./Overtime/overtimeRequestsApi";
import { overtimeTypeApi } from "./Overtime/overtimeTypeApi";
import { overtimePolicyApi } from "./Overtime/overtimePolicies.api";
import { advanceTypeApi } from "./Advance/advanceTypeApi";
import { advancePolicyApi } from "./Advance/advancePolicyApi";
import { advanceRequestApi } from "./Advance/advanceRequestApi";
import { overtimeLogsApi } from "./Overtime/overtimeLogs";
import { advanceLogsApi } from "./Advance/advanceLogsApi";
import { NotificationsApi } from "./Notifications/NotificationsApi";
import { taskApi } from "./Tasks/tasksApi";
import { subTaskApi } from "./Tasks/subTasksApi";
import { commentApi } from "./Tasks/commentsApi";
import { attachmentApi } from "./Tasks/attachmentsApi";
import { staffApi } from "./Staff/StaffApi";
import { workspaceApi } from "./Tasks/workspaceApi";
import { folderApi } from "./Tasks/folderApi";
import { listApi } from "./Tasks/listApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [fingerprintApi.reducerPath]: fingerprintApi.reducer,
    [leavesApi.reducerPath]: leavesApi.reducer,
    [leaveRequestsApi.reducerPath]: leaveRequestsApi.reducer,
    [leaveLogsApi.reducerPath]: leaveLogsApi.reducer,
    [overtimeRequestsApi.reducerPath]: overtimeRequestsApi.reducer,
    [overtimeTypeApi.reducerPath]: overtimeTypeApi.reducer,
    [overtimePolicyApi.reducerPath]: overtimePolicyApi.reducer,
    [advanceTypeApi.reducerPath]: advanceTypeApi.reducer,
    [advancePolicyApi.reducerPath]: advancePolicyApi.reducer,
    [advanceRequestApi.reducerPath]: advanceRequestApi.reducer,
    [overtimeLogsApi.reducerPath]: overtimeLogsApi.reducer,
    [advanceLogsApi.reducerPath]: advanceLogsApi.reducer,
    [NotificationsApi.reducerPath]: NotificationsApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,

    //tasks
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [folderApi.reducerPath]: folderApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [subTaskApi.reducerPath]: subTaskApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [attachmentApi.reducerPath]: attachmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(fingerprintApi.middleware)
      .concat(leavesApi.middleware)
      .concat(leaveRequestsApi.middleware)
      .concat(leaveLogsApi.middleware)
      .concat(overtimeRequestsApi.middleware)
      .concat(overtimeTypeApi.middleware)
      .concat(overtimePolicyApi.middleware)
      .concat(advanceTypeApi.middleware)
      .concat(advancePolicyApi.middleware)
      .concat(advanceRequestApi.middleware)
      .concat(overtimeLogsApi.middleware)
      .concat(advanceLogsApi.middleware)
      .concat(NotificationsApi.middleware)
      .concat(staffApi.middleware)


      .concat(workspaceApi.middleware)
      .concat(folderApi.middleware)
      .concat(listApi.middleware)
      .concat(taskApi.middleware)
      .concat(subTaskApi.middleware)
      .concat(commentApi.middleware)
      .concat(attachmentApi.middleware)
});

setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
