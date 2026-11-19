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

export interface DailyFingerprintGroup {
  _id?: string;
  date: string;
  records: AttendanceFingerprint[];
  latestRecord?: string;
  totalRecords?: number;
}

export interface GetMyDailyFingerprintsParams {
  startDate?: string;
  endDate?: string;
}
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
        `${fingerprintEndPoint}`,

      providesTags: ["Fingerprint"],
    }),

    /* ================= GET MY DAILY ATTENDANCE ================= */
  getMyDailyFingerprints: builder.query<
  ApiResponse<DailyFingerprintGroup[]>,
  GetMyDailyFingerprintsParams
>({
  query: ({ startDate, endDate } = {}) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    const queryString = params.toString();

    return queryString
      ? `${fingerprintByDayEndPoint}?${queryString}`
      : fingerprintByDayEndPoint;
  },

  providesTags: ["Fingerprint"],
}),
    /* ================= CREATE CHECK-IN / CHECK-OUT ================= */

    createLogedFingerprint: builder.mutation<
      ApiResponse<AttendanceFingerprint>,
      {
        type: "Check-in" | "Check-out";
        latitude: number;
        longitude: number;
      }
    >({
      query: (body) => ({
        url: `${fingerprintEndPoint}`,
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
