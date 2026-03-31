import baseURL, { overtimeRequestEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= IMPORT TYPES =================
import {
  OvertimeRequest,
  OvertimeRequestsResponse,
  OvertimeRequestResponse,
} from "@/rtk/interfaces";

/* ================= CONFIG ================= */
const getCompanyId = () => localStorage.getItem("company");

/* ================= API SLICE ================= */
export const overtimeRequestsApi = createApi({
  reducerPath: "overtimeRequestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["OvertimeRequests"],
  endpoints: (builder) => ({
    getAllOvertimeRequests: builder.query<
      OvertimeRequestsResponse,
      {
        page?: number;
        limit?: number;
        managerId?: string;
        status?: string;
        userId?: string;
        search?: string;
      }
    >({
      query: ({ page = 1, limit = 10, managerId, status, userId, search }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(managerId ? { managerId } : {}),
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
          ...(userId ? { userId } : {}),
        });
        return `${overtimeRequestEndPoint}?${params.toString()}`;
      },
      providesTags: ["OvertimeRequests"],
    }),

    getOneOvertimeRequest: builder.query<OvertimeRequestResponse, string>({
      query: (id) => `${overtimeRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["OvertimeRequests"],
    }),

    getMyOvertimeRequests: builder.query<
      OvertimeRequestsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(status ? { status } : {}),
        });
        return `${overtimeRequestEndPoint}/my-requests?${params.toString()}`;
      },
      providesTags: ["OvertimeRequests"],
    }),
    getMyApprovalOvertimeRequests: builder.query<
      OvertimeRequestsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(status ? { status } : {}),
        });
        return `${overtimeRequestEndPoint}/my-approvals?${params.toString()}`;
      },
      providesTags: ["OvertimeRequests"],
    }),

    createOvertimeRequest: builder.mutation<OvertimeRequestResponse, FormData>({
      query: (data) => ({
        url: `${overtimeRequestEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OvertimeRequests"],
    }),

    updateOvertimeRequest: builder.mutation<
      OvertimeRequestResponse,
      { id: string; data: Partial<OvertimeRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${overtimeRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["OvertimeRequests"],
    }),

    deleteOvertimeRequest: builder.mutation<
      { status: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `${overtimeRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OvertimeRequests"],
    }),

    changeOvertimeRequestStatus: builder.mutation<
      OvertimeRequestResponse,
      { id: string; action: "approve" | "reject"; reason?: string }
    >({
      query: ({ id, action, reason }) => ({
        url: `${overtimeRequestEndPoint}/handle-overtime-status/${id}?companyId=${getCompanyId()}`,
        method: "POST",
        body: reason ? { action, reason } : { action },
      }),
      invalidatesTags: ["OvertimeRequests"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */
export const {
  useGetAllOvertimeRequestsQuery,
  useGetOneOvertimeRequestQuery,
  useGetMyOvertimeRequestsQuery,
  useGetMyApprovalOvertimeRequestsQuery,
  useCreateOvertimeRequestMutation,
  useUpdateOvertimeRequestMutation,
  useDeleteOvertimeRequestMutation,
  useChangeOvertimeRequestStatusMutation,
} = overtimeRequestsApi;
