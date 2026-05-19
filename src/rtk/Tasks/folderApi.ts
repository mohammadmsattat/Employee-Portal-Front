import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

// ===============================
// HELPERS
// ===============================
const buildFolderBaseUrl = (workspaceId: string) =>
  `/api/workspaces/${workspaceId}/folders`;

const buildFolderMemberUrl = (workspaceId: string, folderId: string) =>
  `${buildFolderBaseUrl(workspaceId)}/${folderId}/members`;

// ===============================
// API
// ===============================
export const folderApi = createApi({
  reducerPath: "folderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),

  tagTypes: ["Folder"],

  endpoints: (builder) => ({

    // =========================
    // GET FOLDERS
    // =========================
    getFolders: builder.query<any, string>({
      query: (workspaceId) =>
        `${buildFolderBaseUrl(workspaceId)}?companyId=${getCompanyId()}`,
      providesTags: ["Folder"],
    }),

    // =========================
    // GET SINGLE FOLDER
    // =========================
    getFolderById: builder.query<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) =>
        `${buildFolderBaseUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["Folder"],
    }),

    // =========================
    // CREATE FOLDER
    // =========================
    createFolder: builder.mutation<any, { workspaceId: string; data: any }>({
      query: ({ workspaceId, data }) => ({
        url: `${buildFolderBaseUrl(workspaceId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // =========================
    // UPDATE FOLDER
    // =========================
    updateFolder: builder.mutation<
      any,
      { workspaceId: string; folderId: string; data: any }
    >({
      query: ({ workspaceId, folderId, data }) => ({
        url: `${buildFolderBaseUrl(workspaceId)}/${folderId}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // =========================
    // DELETE FOLDER
    // =========================
    deleteFolder: builder.mutation<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) => ({
        url: `${buildFolderBaseUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
    }),

    // =========================
    // ADD MEMBER
    // =========================
    addFolderMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        userId: string;
        role: string;
        notificationsEnabled:boolean
      }
    >({
      query: ({ workspaceId, folderId, userId, role ,notificationsEnabled }) => ({
        url: `${buildFolderMemberUrl(workspaceId, folderId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: { userId, role ,notificationsEnabled },
      }),
      invalidatesTags: ["Folder"],
    }),

    // =========================
    // REMOVE MEMBER
    // =========================
    removeFolderMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        userId: string;
      }
    >({
      query: ({ workspaceId, folderId, userId }) => ({
        url: `${buildFolderMemberUrl(workspaceId, folderId)}/${userId}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
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