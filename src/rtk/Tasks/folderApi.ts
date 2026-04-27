import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { folderEndPoint } from "@/Api/GlobalData";

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

    // GET BY WORKSPACE
    getFolders: builder.query<any, string>({
      query: (workspaceId) =>
        `${folderEndPoint}/workspace/${workspaceId}?companyId=${getCompanyId()}`,
      providesTags: ["Folder"],
    }),

    // CREATE
    createFolder: builder.mutation<any, any>({
      query: (data) => ({
        url: `${folderEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // UPDATE
    updateFolder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${folderEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Folder"],
    }),

    // DELETE
    deleteFolder: builder.mutation<any, string>({
      query: (id) => ({
        url: `${folderEndPoint}/${id}?companyId=${getCompanyId()}`,
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