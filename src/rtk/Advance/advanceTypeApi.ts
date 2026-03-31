import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { advanceTypeEndPoint } from "@/Api/GlobalData";
import {
  AdvanceType,
  AdvanceTypesResponse,
  AdvanceTypeResponse,
} from "../interfaces";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const advanceTypeApi = createApi({
  reducerPath: "advanceTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["AdvanceTypes"],
  endpoints: (builder) => ({
    getAllAdvanceTypes: builder.query<
      AdvanceTypesResponse,
      { policyId?: string; page?: number; limit?: number }
    >({
      query: ({ policyId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (policyId) params.append("policyId", policyId);

        return `${advanceTypeEndPoint}?${params.toString()}`;
      },
      providesTags: ["AdvanceTypes"],
    }),

    getOneAdvanceType: builder.query<AdvanceTypeResponse, string>({
      query: (id) =>
        `${advanceTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["AdvanceTypes"],
    }),

    updateAdvanceType: builder.mutation<
      AdvanceTypeResponse,
      { id: string; data: Partial<AdvanceType> }
    >({
      query: ({ id, data }) => ({
        url: `${advanceTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdvanceTypes"],
    }),

    deleteAdvanceType: builder.mutation<
      { status: string; message: string },
      string
    >({
      query: (id) => ({
        url: `${advanceTypeEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvanceTypes"],
    }),
  }),
});

export const {
  useGetAllAdvanceTypesQuery,
  useGetOneAdvanceTypeQuery,
  useUpdateAdvanceTypeMutation,
  useDeleteAdvanceTypeMutation,
} = advanceTypeApi;