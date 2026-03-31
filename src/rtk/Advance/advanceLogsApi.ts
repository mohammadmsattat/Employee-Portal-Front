import baseURL, { advanceLogsEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAdvanceLogsResponse } from "../interfaces";

// ================= IMPORT TYPES =================

// ================= CONFIG =================
const companyId = localStorage.getItem("company");

// ================= API SLICE =================
export const advanceLogsApi = createApi({
  reducerPath: "advanceLogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["AdvanceLogs"],
  endpoints: (builder) => ({
    // ===== Get my advance logs =====
    getMyAdvanceLogs: builder.query<
      IAdvanceLogsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
          companyId: companyId!,
          page: page.toString(),
          limit: limit.toString(),
        });

        return `${advanceLogsEndPoint}/my?${params.toString()}`;
      },
      providesTags: ["AdvanceLogs"],
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetMyAdvanceLogsQuery,
} = advanceLogsApi;