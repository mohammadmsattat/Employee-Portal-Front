import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildFolderUrl } from "@/Api/GlobalData";
import { workspaceApi } from "@/rtk/Tasks/workspaceApi";

const getJWT = () => localStorage.getItem("token");

const buildFolderMemberUrl = (workspaceId: string, folderId: string) =>
  `${buildFolderUrl(workspaceId)}/${folderId}/members`;

export const folderApi = createApi({
  reducerPath: "folderApi",

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

  tagTypes: ["Folder"],

  endpoints: (builder) => ({
    // =====================================
    // GET FOLDERS
    // GET /api/workspaces/:workspaceId/folders
    // =====================================
    getFolders: builder.query<any, string>({
      query: (workspaceId) => buildFolderUrl(workspaceId),

      providesTags: ["Folder"],
    }),

    // =====================================
    // GET FOLDER BY ID
    // GET /api/workspaces/:workspaceId/folders/:folderId
    // =====================================
    getFolderById: builder.query<
      any,
      {
        workspaceId: string;
        id: string;
      }
    >({
      query: ({ workspaceId, id }) => `${buildFolderUrl(workspaceId)}/${id}`,

      providesTags: ["Folder"],
    }),

    // =====================================
    // CREATE FOLDER
    // POST /api/workspaces/:workspaceId/folders
    // =====================================
    createFolder: builder.mutation<
      any,
      {
        workspaceId: string;
        data: any;
      }
    >({
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
        } catch {
          // لا نحدث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // UPDATE FOLDER
    // PATCH /api/workspaces/:workspaceId/folders/:folderId
    // =====================================
    updateFolder: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        data: any;
      }
    >({
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
        } catch {
          // لا نحدث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // DELETE FOLDER
    // DELETE /api/workspaces/:workspaceId/folders/:folderId
    // =====================================
    deleteFolder: builder.mutation<
      any,
      {
        workspaceId: string;
        id: string;
      }
    >({
      query: ({ workspaceId, id }) => ({
        url: `${buildFolderUrl(workspaceId)}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Folder"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // ADD FOLDER MEMBER
    // POST /api/workspaces/:workspaceId/folders/:folderId/members
    // =====================================
    addFolderMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        userId: string;
        role: string;
      }
    >({
      query: ({ workspaceId, folderId, userId, role }) => ({
        url: buildFolderMemberUrl(workspaceId, folderId),
        method: "POST",
        body: {
          userId,
          role,
        },
      }),

      invalidatesTags: ["Folder"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // REMOVE FOLDER MEMBER
    // DELETE /api/workspaces/:workspaceId/folders/:folderId/members/:userId
    // =====================================
    removeFolderMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        userId: string;
      }
    >({
      query: ({ workspaceId, folderId, userId }) => ({
        url: `${buildFolderMemberUrl(workspaceId, folderId)}/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Folder"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
        }
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
