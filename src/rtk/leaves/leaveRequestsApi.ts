import baseURL, { leaveRequestEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= IMPORT TYPES =================
import {
  LeaveRequest,
  LeaveRequestsResponse,
  LeaveRequestResponse,
} from "@/rtk/interfaces";

/* ================= CONFIG ================= */
const getCompanyId = () => localStorage.getItem("company");

/* ================= API SLICE ================= */
export const leaveRequestsApi = createApi({
  reducerPath: "leaveRequestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["LeaveRequests"],
  endpoints: (builder) => ({
    getAllLeaveRequests: builder.query<
      LeaveRequestsResponse,
      {
        page?: number;
        limit?: number;
        managerId?: string;
        status?: string;
        leaveType?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        managerId = "",
        status,
        leaveType,
        startDate,
        endDate,
        search,
      }) => {
        console.log(leaveType);

        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(managerId ? { managerId } : {}),
          ...(status ? { status } : {}),
          ...(leaveType ? { leaveType } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
          ...(search ? { search } : {}),
        });
        return `${leaveRequestEndPoint}?${params.toString()}`;
      },
      providesTags: ["LeaveRequests"],
    }),

    getOneLeaveRequest: builder.query<LeaveRequestResponse, string>({
      query: (id) => `${leaveRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["LeaveRequests"],
    }),

    getMyLeaveRequests: builder.query<
      LeaveRequestsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(status ? { status } : {}),
        });
        return `${leaveRequestEndPoint}/my-requests?${params.toString()}`;
      },
      providesTags: ["LeaveRequests"],
    }),
    getApprovalRequests: builder.query<
      LeaveRequestsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(status ? { status } : {}),
        });
        return `${leaveRequestEndPoint}/my-approvals?${params.toString()}`;
      },
      providesTags: ["LeaveRequests"],
    }),

    createLeaveRequest: builder.mutation<LeaveRequestResponse, FormData>({
      query: (data) => ({
        url: `${leaveRequestEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests"],
    }),

    updateLeaveRequest: builder.mutation<
      LeaveRequestResponse,
      { id: string; data: Partial<LeaveRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${leaveRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests"],
    }),

    deleteLeaveRequest: builder.mutation<
      { status: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `${leaveRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),

    changeLeaveRequestStatus: builder.mutation<
      LeaveRequestResponse,
      { id: string; action: "approve" | "reject"; reason?: string }
    >({
      query: ({ id, action, reason }) => ({
        url: `${leaveRequestEndPoint}/handle-leave-status/${id}?companyId=${getCompanyId()}`,
        method: "POST",
        body: reason ? { action, reason } : { action },
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */
export const {
  useGetAllLeaveRequestsQuery,
  useGetOneLeaveRequestQuery,
  useGetMyLeaveRequestsQuery,
  useGetApprovalRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
  useChangeLeaveRequestStatusMutation,
} = leaveRequestsApi;
