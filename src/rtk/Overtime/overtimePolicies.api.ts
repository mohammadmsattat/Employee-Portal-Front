import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import baseURL, { overtimePolicyEndPoint } from "@/Api/GlobalData";
import { OvertimePolicy, OvertimePoliciesResponse } from "../interfaces";

const getJWT = () => Cookies.get("Token");
const getCompanyId = () => Cookies.get("DB_Name");

export const overtimePolicyApi = createApi({
  reducerPath: "overtimePolicyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["OvertimePolicies"],
  endpoints: (builder) => ({
    getAllOvertimePolicies: builder.query<
      OvertimePoliciesResponse,
      { keyword?: string; page?: number; limit?: number }
    >({
      query: ({ keyword = "", page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          keyword,
          page: page.toString(),
          limit: limit.toString(),
        });
        return `${overtimePolicyEndPoint}?${params.toString()}`;
      },
      providesTags: ["OvertimePolicies"],
    }),
    getOneOvertimePolicy: builder.query<{ status: boolean; data: OvertimePolicy }, string>({
      query: (id) => `${overtimePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["OvertimePolicies"],
    }),
    createOvertimePolicy: builder.mutation<{ status: boolean; data: OvertimePolicy }, Partial<OvertimePolicy>>({
      query: (data) => ({
        url: `${overtimePolicyEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OvertimePolicies"],
    }),
    updateOvertimePolicy: builder.mutation<{ status: boolean; data: OvertimePolicy }, { id: string; data: Partial<OvertimePolicy> }>({
      query: ({ id, data }) => ({
        url: `${overtimePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OvertimePolicies"],
    }),
    deleteOvertimePolicy: builder.mutation<{ status: boolean; message: string }, string>({
      query: (id) => ({
        url: `${overtimePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OvertimePolicies"],
    }),
  }),
});

export const {
  useGetAllOvertimePoliciesQuery,
  useGetOneOvertimePolicyQuery,
  useCreateOvertimePolicyMutation,
  useUpdateOvertimePolicyMutation,
  useDeleteOvertimePolicyMutation,
} = overtimePolicyApi;