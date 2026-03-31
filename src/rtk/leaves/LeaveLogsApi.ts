// LeaveLogsApi.ts
import baseURL, { leavesLogsEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// ================= IMPORT TYPES =================
import { LeaveLog, LeaveLogsResponse } from "@/rtk/interfaces";

// ================= CONFIG =================
const getCompanyId = () => localStorage.getItem("company");

// ================= API SLICE =================
export const leaveLogsApi = createApi({
  reducerPath: "leaveLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["LeaveLogs"],
  endpoints: (builder) => ({
    // ===== Get my leave logs =====
    getMyLeaveLogs: builder.query<LeaveLogsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
        });
        return `${leavesLogsEndPoint}/my?${params.toString()}`;
      },
      providesTags: ["LeaveLogs"],
    }),


  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetMyLeaveLogsQuery,
} = leaveLogsApi;
