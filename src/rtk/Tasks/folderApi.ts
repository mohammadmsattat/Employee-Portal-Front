import { createApi } from "@reduxjs/toolkit/query/react";
import { buildFolderUrl } from "@/Api/GlobalData";
import { workspaceApi } from "@/rtk/Tasks/workspaceApi";
import { baseQueryWithReauth } from "../Auth/baseQuery";

const buildFolderMemberUrl = (workspaceId: string, folderId: string) =>
  `${buildFolderUrl(workspaceId)}/${folderId}/members`;

export const folderApi = createApi({
  reducerPath: "folderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Folder"],

  endpoints: (builder) => ({
    getFolders: builder.query<any, string>({
      query: (workspaceId) => buildFolderUrl(workspaceId),
      providesTags: ["Folder"],
    }),

    getFolderById: builder.query<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) => `${buildFolderUrl(workspaceId)}/${id}`,
      providesTags: ["Folder"],
    }),

    createFolder: builder.mutation<any, { workspaceId: string; data: any }>({
      query: ({ workspaceId, data }) => ({
        url: buildFolderUrl(workspaceId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folder"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {}
      },
    }),

    updateFolder: builder.mutation<any, { workspaceId: string; folderId: string; data: any }>({
      query: ({ workspaceId, folderId, data }) => ({
        url: `${buildFolderUrl(workspaceId)}/${folderId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Folder"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {}
      },
    }),

    deleteFolder: builder.mutation<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) => ({
        url: `${buildFolderUrl(workspaceId)}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {}
      },
    }),

    addFolderMember: builder.mutation<any, { workspaceId: string; folderId: string; userId: string; role: string }>({
      query: ({ workspaceId, folderId, userId, role }) => ({
        url: buildFolderMemberUrl(workspaceId, folderId),
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: ["Folder"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {}
      },
    }),

    removeFolderMember: builder.mutation<any, { workspaceId: string; folderId: string; userId: string }>({
      query: ({ workspaceId, folderId, userId }) => ({
        url: `${buildFolderMemberUrl(workspaceId, folderId)}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetFolderByIdQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
  useAddFolderMemberMutation,
  useRemoveFolderMemberMutation,
} = folderApi;