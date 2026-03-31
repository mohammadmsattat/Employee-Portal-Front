import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { advancePolicyEndPoint } from "@/Api/GlobalData";
import {
  AdvancePolicy,
  AdvancePoliciesResponse,
  AdvancePolicyResponse,
} from "../interfaces";

const getCompanyId = () => localStorage.getItem("company");

export const advancePolicyApi = createApi({
  reducerPath: "advancePolicyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = localStorage.getItem("token");
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["AdvancePolicies"],
  endpoints: (builder) => ({
    getAllPolicies: builder.query<
      AdvancePoliciesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `${advancePolicyEndPoint}?companyId=${getCompanyId()}&page=${page}&limit=${limit}`,
      providesTags: ["AdvancePolicies"],
    }),

    getOnePolicy: builder.query<AdvancePolicyResponse, string>({
      query: (id) =>
        `${advancePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["AdvancePolicies"],
    }),

    createPolicy: builder.mutation<
      { status: string; data: any },
      Partial<AdvancePolicy>
    >({
      query: (data) => ({
        url: `${advancePolicyEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdvancePolicies"],
    }),

    updatePolicy: builder.mutation<
      AdvancePolicyResponse,
      { id: string; data: Partial<AdvancePolicy> }
    >({
      query: ({ id, data }) => ({
        url: `${advancePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdvancePolicies"],
    }),

    deletePolicy: builder.mutation<
      { status: string; message: string },
      string
    >({
      query: (id) => ({
        url: `${advancePolicyEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvancePolicies"],
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetOnePolicyQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} = advancePolicyApi;