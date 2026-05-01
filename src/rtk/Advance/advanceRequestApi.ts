import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { advanceRequestEndPoint } from "@/Api/GlobalData";
import { AdvanceRequestsResponse, AdvanceRequestResponse } from "../interfaces";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const advanceRequestApi = createApi({
  reducerPath: "advanceRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["AdvanceRequests"],
  endpoints: (builder) => ({
    /* ================== MY REQUESTS ================== */
    getMyAdvanceRequests: builder.query<
      AdvanceRequestsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status }) => {
        let url = `${advanceRequestEndPoint}/my-requests?companyId=${getCompanyId()}&page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["AdvanceRequests"],
    }),

    getMyApprovalRequests: builder.query<
      AdvanceRequestsResponse,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: ({ page = 1, limit = 10, status, search }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        });
        return `${advanceRequestEndPoint}/my-approvals?${params.toString()}`;
      },
      providesTags: ["AdvanceRequests"],
    }),

    /* ================== ALL REQUESTS FOR MANAGER ================== */
    getAllAdvanceRequests: builder.query<
      AdvanceRequestsResponse,
      { page?: number; limit?: number; status?: string; managerId?: string }
    >({
      query: ({ page = 1, limit = 20, status, managerId }) => {
        let url = `${advanceRequestEndPoint}?companyId=${getCompanyId()}&page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (managerId) url += `&managerId=${managerId}`;
        return url;
      },
      providesTags: ["AdvanceRequests"],
    }),

    /* ================== SINGLE REQUEST ================== */
    getOneAdvanceRequest: builder.query<AdvanceRequestResponse, string>({
      query: (id) =>
        `${advanceRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["AdvanceRequests"],
    }),

    /* ================== CREATE ================== */
    createAdvanceRequest: builder.mutation<AdvanceRequestResponse, FormData>({
      query: (data) => ({
        url: `${advanceRequestEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdvanceRequests"],
    }),

    /* ================== UPDATE ================== */
    updateAdvanceRequest: builder.mutation<
      AdvanceRequestResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `${advanceRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdvanceRequests"],
    }),

    /* ================== DELETE ================== */
    deleteAdvanceRequest: builder.mutation<
      { status: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `${advanceRequestEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvanceRequests"],
    }),

    /* ================== HANDLE STATUS (APPROVE/REJECT) ================== */
    handleAdvanceStatus: builder.mutation<
      AdvanceRequestResponse,
      { id: string; action: "approve" | "reject"; rejectionReason?: string }
    >({
      query: ({ id, action, rejectionReason }) => ({
        url: `${advanceRequestEndPoint}/handle-advance-status/${id}?companyId=${getCompanyId()}`,
        method: "POST",
        body: { action, reason: rejectionReason },
      }),
      invalidatesTags: ["AdvanceRequests"],
    }),
  }),
});

export const {
  useGetMyAdvanceRequestsQuery,
  useGetMyApprovalRequestsQuery,
  useGetAllAdvanceRequestsQuery,
  useGetOneAdvanceRequestQuery,
  useCreateAdvanceRequestMutation,
  useUpdateAdvanceRequestMutation,
  useDeleteAdvanceRequestMutation,
  useHandleAdvanceStatusMutation,
} = advanceRequestApi;
