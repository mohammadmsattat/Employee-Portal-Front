import { createApi } from "@reduxjs/toolkit/query/react";
import { workspaceEndPoint } from "@/Api/GlobalData";
import { baseQueryWithReauth } from "../Auth/baseQuery";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Workspace"],

  endpoints: (builder) => ({
    getMyWorkspaces: builder.query<any, void>({
      query: () => workspaceEndPoint,
      providesTags: ["Workspace"],
    }),

    getWorkspaceTree: builder.query<any, void>({
      query: () => `${workspaceEndPoint}/tree`,
      providesTags: ["Workspace"],
    }),

    getWorkspaceById: builder.query<any, string>({
      query: (id) => `${workspaceEndPoint}/${id}`,
      providesTags: ["Workspace"],
    }),

    createWorkspace: builder.mutation<any, any>({
      query: (data) => ({
        url: workspaceEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),

    updateWorkspace: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${workspaceEndPoint}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),

    deleteWorkspace: builder.mutation<any, string>({
      query: (id) => ({
        url: `${workspaceEndPoint}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),

    addWorkspaceMember: builder.mutation<
      any,
      { id: string; userId: string; role: string }
    >({
      query: ({ id, userId, role }) => ({
        url: `${workspaceEndPoint}/${id}/members`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: ["Workspace"],
    }),

    removeWorkspaceMember: builder.mutation<
      any,
      { id: string; userId: string }
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
