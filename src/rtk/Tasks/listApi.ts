import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { listEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const listApi = createApi({
  reducerPath: "listApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),

  tagTypes: ["List"],

  endpoints: (builder) => ({

    // GET BY WORKSPACE
    getLists: builder.query<any, string>({
      query: (workspaceId) =>
        `${listEndPoint}/workspace/${workspaceId}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // GET ONE
    getListById: builder.query<any, string>({
      query: (id) => `${listEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // CREATE
    createList: builder.mutation<any, any>({
      query: (data) => ({
        url: `${listEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),

    // UPDATE
    updateList: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${listEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),

    // DELETE
    deleteList: builder.mutation<any, string>({
      query: (id) => ({
        url: `${listEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["List"],
    }),

    // ADD MEMBER
    addListMember: builder.mutation<any, { id: string; userId: string; role: string }>({
      query: ({ id, userId, role }) => ({
        url: `${listEndPoint}/${id}/members?companyId=${getCompanyId()}`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: ["List"],
    }),

  }),
});

export const {
  useGetListsQuery,
  useGetListByIdQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useAddListMemberMutation,
} = listApi; 