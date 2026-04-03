import baseURL, { leavesEndPoint } from "@/Api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= IMPORT TYPES =================
import {
  PolicyLeaveType,
  LeavesResponse,
  LeaveResponse,
} from "@/rtk/interfaces";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

// ================= API SLICE =================
export const leavesApi = createApi({
  reducerPath: "leavesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Leaves"],
  endpoints: (builder) => ({
    // ================= GET ALL =================
    getAllLeaves: builder.query<
      LeavesResponse,
      { keyword?: string; page?: number; limit?: number; policyId?: string }
    >({
      query: ({ keyword = "", page = 1, limit = 10, policyId = "" }) => {
        const queryParams = new URLSearchParams({
          companyId: getCompanyId()!,
          keyword,
          limit: limit.toString(),
          page: page.toString(),
          policyId,
        });

        return `${leavesEndPoint}/staff?${queryParams.toString()}`;
      },
      providesTags: ["Leaves"],
    }),

    // ================= GET ONE =================
    getOneLeave: builder.query<LeaveResponse, string>({
      query: (id) => {
        const companyId = localStorage.getItem("company") || "";
        return `${leavesEndPoint}/${id}?companyId=${companyId}`;
      },
      providesTags: ["Leaves"],
    }),

    // ================= CREATE =================
    createLeave: builder.mutation<LeaveResponse, Partial<PolicyLeaveType>>({
      query: (data) => {
        const companyId = localStorage.getItem("company") || "";
        return {
          url: `${leavesEndPoint}?companyId=${companyId}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Leaves"],
    }),

    // ================= UPDATE =================
    updateLeave: builder.mutation<
      LeaveResponse,
      { id: string; data: Partial<PolicyLeaveType> }
    >({
      query: ({ id, data }) => {
        const companyId = localStorage.getItem("company") || "";
        return {
          url: `${leavesEndPoint}/${id}?companyId=${companyId}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Leaves"],
    }),

    // ================= DELETE =================
    deleteLeave: builder.mutation<{ status: boolean; message: string }, string>(
      {
        query: (id) => {
          const companyId = localStorage.getItem("company") || "";
          return {
            url: `${leavesEndPoint}/${id}?companyId=${companyId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Leaves"],
      },
    ),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetAllLeavesQuery,
  useGetOneLeaveQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leavesApi;
