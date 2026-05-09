import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { buildFolderUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

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

    // GET FOLDERS (by workspace)
    getFolders: builder.query<any, string>({
      query: (workspaceId) =>
        `${buildFolderUrl(workspaceId)}?companyId=${getCompanyId()}`,
      providesTags: ["Folder"],
    }),

    // CREATE FOLDER
    createFolder: builder.mutation<any, any>({
      query: ({ data, workspaceId }) => ({
        url: `${buildFolderUrl(workspaceId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // UPDATE FOLDER
    updateFolder: builder.mutation<any, { workspaceId: string; id: string; data: any }>({
      query: ({ workspaceId, id, data }) => ({
        url: `${buildFolderUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // DELETE FOLDER
    deleteFolder: builder.mutation<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) => ({
        url: `${buildFolderUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Folder"],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = folderApi;