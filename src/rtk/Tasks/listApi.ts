import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildListUrl } from "@/Api/GlobalData";
import { workspaceApi } from "@/rtk/Tasks/workspaceApi";

const getJWT = () => localStorage.getItem("token");

type GetListsArgs = {
  workspaceId: string;
  folderId: string;
  page?: number;
  limit?: number;
  search?: string;
};

export const listApi = createApi({
  reducerPath: "listApi",

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

  tagTypes: ["List"],

  endpoints: (builder) => ({
    // =====================================
    // GET LISTS BY FOLDER
    // GET /api/workspaces/:workspaceId/folders/:folderId/lists
    // =====================================
    getLists: builder.query<any, GetListsArgs>({
      query: ({ workspaceId, folderId, page, limit, search }) => {
        const params = new URLSearchParams();

        if (page !== undefined) {
          params.set("page", String(page));
        }

        if (limit !== undefined) {
          params.set("limit", String(limit));
        }

        if (search) {
          params.set("search", search);
        }

        const queryString = params.toString();
        const url = buildListUrl(workspaceId, folderId);

        return queryString ? `${url}?${queryString}` : url;
      },

      providesTags: ["List"],
    }),

    // =====================================
    // GET LIST BY ID
    // =====================================
    getListById: builder.query<
      any,
      {
        workspaceId: string;
        folderId: string;
        id: string;
      }
    >({
      query: ({ workspaceId, folderId, id }) =>
        `${buildListUrl(workspaceId, folderId)}/${id}`,

      providesTags: ["List"],
    }),

    // =====================================
    // CREATE LIST
    // =====================================
    createList: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        data: any;
      }
    >({
      query: ({ workspaceId, folderId, data }) => ({
        url: buildListUrl(workspaceId, folderId),
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["List"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدّث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // UPDATE LIST
    // =====================================
    updateList: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        id: string;
        data: any;
      }
    >({
      query: ({ workspaceId, folderId, id, data }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["List"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدّث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // DELETE LIST
    // =====================================
    deleteList: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        id: string;
      }
    >({
      query: ({ workspaceId, folderId, id }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["List"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
        }
      },
    }),

    // =====================================
    // ADD LIST MEMBER
    // =====================================
    addListMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        id: string;
        userId: string;
        role: string;
      }
    >({
      query: ({ workspaceId, folderId, id, userId, role }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}/members`,

        method: "POST",

        body: {
          userId,
          role,
        },
      }),

      invalidatesTags: ["List"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدّث الـcache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // REMOVE LIST MEMBER
    // =====================================
    removeListMember: builder.mutation<
      any,
      {
        workspaceId: string;
        folderId: string;
        id: string;
        userId: string;
      }
    >({
      query: ({ workspaceId, folderId, id, userId }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}/members/${userId}`,

        method: "DELETE",
      }),

      invalidatesTags: ["List"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(workspaceApi.util.invalidateTags(["Workspace"]));
        } catch {
          // لا نحدّث الـcache إذا فشل الطلب
        }
      },
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
  useRemoveListMemberMutation,
} = listApi;
