import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import baseURL, { overtimeTypeEndPoint } from "@/Api/GlobalData";
import { OvertimeType, OvertimeTypesResponse } from "../interfaces";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const overtimeTypeApi = createApi({
  reducerPath: "overtimeTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["OvertimeTypes"],
  endpoints: (builder) => ({
    getAllOvertimeTypes: builder.query<
      OvertimeTypesResponse,
      { keyword?: string; page?: number; limit?: number; policyId?: string }
    >({
      query: ({ keyword = "", page = 1, limit = 10, policyId }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          keyword,
          page: page.toString(),
          limit: limit.toString(),
          ...(policyId ? { policyId } : {}),
        });
        return `${overtimeTypeEndPoint}?${params.toString()}`;
      },
      providesTags: ["OvertimeTypes"],
    }),
    getOneOvertimeType: builder.query<{ status: boolean; data: OvertimeType }, string>({
      query: (id) => `${overtimeTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["OvertimeTypes"],
    }),
    createOvertimeType: builder.mutation<{ status: boolean; data: OvertimeType }, Partial<OvertimeType>>({
      query: (data) => ({
        url: `${overtimeTypeEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OvertimeTypes"],
    }),
    updateOvertimeType: builder.mutation<{ status: boolean; data: OvertimeType }, { id: string; data: Partial<OvertimeType> }>({
      query: ({ id, data }) => ({
        url: `${overtimeTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["OvertimeTypes"],
    }),
    deleteOvertimeType: builder.mutation<{ status: boolean; message: string }, string>({
      query: (id) => ({
        url: `${overtimeTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OvertimeTypes"],
    }),
  }),
});

export const {
  useGetAllOvertimeTypesQuery,
  useGetOneOvertimeTypeQuery,
  useCreateOvertimeTypeMutation,
  useUpdateOvertimeTypeMutation,
  useDeleteOvertimeTypeMutation,
} = overtimeTypeApi;