import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { timeTrackingEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

const getCompanyId = () => localStorage.getItem("company");

export const timeTrackingApi = createApi({
  reducerPath: "timeTrackingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,

    prepareHeaders: (headers) => {
      const jwt = getJWT();

      if (jwt) {
        headers.set("Authorization", `Bearer ${jwt}`);
      }

      return headers;
    },
  }),

  tagTypes: ["TimeLogs"],

  endpoints: (builder) => ({
    /* =========================
       GET ALL TIME LOGS
    ========================= */
    getAllTimeLogs: builder.query<
      any,
      {
        taskId?: string;
        userId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ taskId, userId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();

        params.append("companyId", getCompanyId() || "");

        params.append("page", String(page));

        params.append("limit", String(limit));

        if (taskId) {
          params.append("taskId", taskId);
        }

        if (userId) {
          params.append("userId", userId);
        }

        return `${timeTrackingEndPoint}?${params.toString()}`;
      },

      providesTags: ["TimeLogs"],
    }),

    /* =========================
       GET SINGLE TIME LOG
    ========================= */
    getTimeLogById: builder.query<any, string>({
      query: (id) =>
        `${timeTrackingEndPoint}/${id}?companyId=${getCompanyId()}`,

      providesTags: ["TimeLogs"],
    }),

    /* =========================
       CREATE TIME LOG
    ========================= */
    createTimeLog: builder.mutation<
      any,
      {
        task?: string;
        subTask?: string;
        from: string;
        to: string;
        note?: string;
        type?: "manual" | "tracked";
      }
    >({
      query: (data) => ({
        url: `${timeTrackingEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["TimeLogs"],
    }),

    /* =========================
       UPDATE TIME LOG
    ========================= */
    updateTimeLog: builder.mutation<
      any,
      {
        id: string;
        data: any;
      }
    >({
      query: ({ id, data }) => ({
        url: `${timeTrackingEndPoint}/${id}?companyId=${getCompanyId()}`,

        method: "PATCH",

        body: data,
      }),

      invalidatesTags: ["TimeLogs"],
    }),

    /* =========================
       DELETE TIME LOG
    ========================= */
    deleteTimeLog: builder.mutation<any, string>({
      query: (id) => ({
        url: `${timeTrackingEndPoint}/${id}?companyId=${getCompanyId()}`,

        method: "DELETE",
      }),

      invalidatesTags: ["TimeLogs"],
    }),
  }),
});

export const {
  useGetAllTimeLogsQuery,
  useGetTimeLogByIdQuery,
  useCreateTimeLogMutation,
  useUpdateTimeLogMutation,
  useDeleteTimeLogMutation,
} = timeTrackingApi;
