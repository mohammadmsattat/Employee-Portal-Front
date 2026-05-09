import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { workspaceEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),

  tagTypes: ["Workspace"],

  endpoints: (builder) => ({
    // GET ALL
    getMyWorkspaces: builder.query<any, void>({
      query: () => `${workspaceEndPoint}&companyId=${getCompanyId()}`,
      providesTags: ["Workspace"],
    }),

    getWorkspaceTree: builder.query<any, void>({
      query: () => `${workspaceEndPoint}/tree?companyId=${getCompanyId()}`,
      providesTags: ["Workspace"],
    }),
    // GET ONE
    getWorkspaceById: builder.query<any, void>({
      query: (id) => `${workspaceEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["Workspace"],
    }),

    // CREATE
    createWorkspace: builder.mutation<any, any>({
      query: (data) => ({
        url: `${workspaceEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),

    // UPDATE
    updateWorkspace: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${workspaceEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),

    // DELETE
    deleteWorkspace: builder.mutation<any, string>({
      query: (id) => ({
        url: `${workspaceEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),

    // ADD MEMBER
    addWorkspaceMember: builder.mutation<
      any,
      { id: string; userId: string; role: string }
    >({
      query: ({ id, userId, role }) => ({
        url: `${workspaceEndPoint}/${id}/members?companyId=${getCompanyId()}`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: ["Workspace"],
    }),

    // REMOVE MEMBER
    removeWorkspaceMember: builder.mutation<
      any,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `${workspaceEndPoint}/${id}/members/${userId}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useGetMyWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
  useGetWorkspaceTreeQuery,
} = workspaceApi;
