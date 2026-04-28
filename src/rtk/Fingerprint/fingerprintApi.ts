// ===================== IMPORTS =====================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, {
  fingerprintByDayEndPoint,
  fingerprintEndPoint,
} from "../../Api/GlobalData";

import { AttendanceFingerprint } from "@/interfaces/attendance";

// ===================== TYPE DEFINITIONS =====================
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
  Pages?: number;
}

// ===================== LOCAL VARIABLES =====================
const getCompanyId = () => localStorage.getItem("company");

// ===================== FINGERPRINT API =====================
export const fingerprintApi = createApi({
  reducerPath: "fingerprintApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");

      if (jwt) {
        headers.set("Authorization", `Bearer ${jwt}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Fingerprint"],

  endpoints: (builder) => ({
    /* ================= GET MY ATTENDANCE ================= */

    getMyFingerprints: builder.query<
      ApiResponse<AttendanceFingerprint[]>,
      number
    >({
      query: (page = 1) =>
        `${fingerprintEndPoint}?companyId=${getCompanyId()}&page=${page}`,

      providesTags: ["Fingerprint"],
    }),

    /* ================= GET MY DAILY ATTENDANCE ================= */
    getMyDailyFingerprints: builder.query<
      ApiResponse<AttendanceFingerprint[]>,
      number
    >({
      query: (page = 1) =>
        `${fingerprintByDayEndPoint}?companyId=${getCompanyId()}&page=${page}`,

      providesTags: ["Fingerprint"],
    }),

    /* ================= CREATE CHECK-IN / CHECK-OUT ================= */

    createLogedFingerprint: builder.mutation<
      ApiResponse<AttendanceFingerprint>,
      { type: "Check-in" | "Check-out" }
    >({
      query: (body) => ({
        url: `${fingerprintEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["Fingerprint"],
    }),
  }),
});

// ===================== EXPORT HOOKS =====================
export const {
  useGetMyFingerprintsQuery,
  useGetMyDailyFingerprintsQuery,
  useCreateLogedFingerprintMutation,
} = fingerprintApi;
