// OvertimeLogsApi.ts
import baseURL, { overtimeLogsEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= IMPORT TYPES =================
import {  OvertimeLogsResponse } from "@/rtk/interfaces";

// ================= CONFIG =================
const getCompanyId = () => localStorage.getItem("company"); 

// ================= API SLICE =================
export const overtimeLogsApi = createApi({
  reducerPath: "overtimeLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["OvertimeLogs"],
  endpoints: (builder) => ({
    // ===== Get my overtime logs =====
    getMyOvertimeLogs: builder.query<OvertimeLogsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
        });
        return `${overtimeLogsEndPoint}/my?${params.toString()}`;
      },
      providesTags: ["OvertimeLogs"],
    }),

  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetMyOvertimeLogsQuery,
} = overtimeLogsApi;