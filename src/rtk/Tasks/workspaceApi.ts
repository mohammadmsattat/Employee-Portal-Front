import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { workspaceEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,

    prepareHeaders: (headers) => {
      const jwt = getJWT();

      if (jwt) {
        headers.set("Authorization", `Bearer ${jwt}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Workspace"],

  endpoints: (builder) => ({
    // =====================================
    // GET MY WORKSPACES
    // GET /api/workspace
    // =====================================
    getMyWorkspaces: builder.query<any, void>({
      query: () => workspaceEndPoint,
      providesTags: ["Workspace"],
    }),

    // =====================================
    // GET WORKSPACE TREE
    // GET /api/workspace/tree
    // =====================================
    getWorkspaceTree: builder.query<any, void>({
      query: () => `${workspaceEndPoint}/tree`,
      providesTags: ["Workspace"],
    }),

    // =====================================
    // GET WORKSPACE BY ID
    // GET /api/workspace/:workspaceId
    // =====================================
    getWorkspaceById: builder.query<any, string>({
      query: (id) => `${workspaceEndPoint}/${id}`,
      providesTags: ["Workspace"],
    }),

    // =====================================
    // CREATE WORKSPACE
    // POST /api/workspace
    // =====================================
    createWorkspace: builder.mutation<any, any>({
      query: (data) => ({
        url: workspaceEndPoint,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Workspace"],
    }),

    // =====================================
    // UPDATE WORKSPACE
    // PATCH /api/workspace/:workspaceId
    // =====================================
    updateWorkspace: builder.mutation<
      any,
      {
        id: string;
        data: any;
      }
    >({
      query: ({ id, data }) => ({
        url: `${workspaceEndPoint}/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Workspace"],
    }),

    // =====================================
    // DELETE WORKSPACE
    // DELETE /api/workspace/:workspaceId
    // =====================================
    deleteWorkspace: builder.mutation<any, string>({
      query: (id) => ({
        url: `${workspaceEndPoint}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Workspace"],
    }),

    // =====================================
    // ADD WORKSPACE MEMBER
    // POST /api/workspace/:workspaceId/members
    // =====================================
    addWorkspaceMember: builder.mutation<
      any,
      {
        id: string;
        userId: string;
        role: string;
      }
    >({
      query: ({ id, userId, role }) => ({
        url: `${workspaceEndPoint}/${id}/members`,
        method: "POST",
        body: {
          userId,
          role,
        },
      }),

      invalidatesTags: ["Workspace"],
    }),

    // =====================================
    // REMOVE WORKSPACE MEMBER
    // DELETE /api/workspace/:workspaceId/members/:userId
    // =====================================
    removeWorkspaceMember: builder.mutation<
      any,
      {
        id: string;
        userId: string;
      }
    >({
      query: ({ id, userId }) => ({
        url: `${workspaceEndPoint}/${id}/members/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useGetMyWorkspacesQuery,
  useGetWorkspaceTreeQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
} = workspaceApi;
