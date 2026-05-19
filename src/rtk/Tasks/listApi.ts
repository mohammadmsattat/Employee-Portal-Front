import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { buildListUrl } from "@/Api/GlobalData";

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
    // =========================
    // GET LISTS BY WORKSPACE
    // GET /api/workspaces/:workspaceId/lists
    // =========================
    getLists: builder.query<any, { workspaceId: string; folderId: string }>({
      query: ({ workspaceId, folderId }) =>
        `${buildListUrl(workspaceId, folderId)}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // =========================
    // GET ONE LIST
    // GET /api/workspaces/:workspaceId/lists/:id
    // =========================
    getListById: builder.query<
      any,
      { workspaceId: string; id: string; folderId: string }
    >({
      query: ({ workspaceId, id, folderId }) =>
        `${buildListUrl(workspaceId, folderId)}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // =========================
    // CREATE LIST
    // POST /api/workspaces/:workspaceId/lists
    // =========================
    createList: builder.mutation<
      any,
      { workspaceId: string; folderId: string; data: any }
    >({
      query: ({ workspaceId, folderId, data }) => ({
        url: `${buildListUrl(workspaceId, folderId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),

    // =========================
    // UPDATE LIST
    // PATCH /api/workspaces/:workspaceId/lists/:id
    // =========================
    updateList: builder.mutation<
      any,
      { workspaceId: string; id: string; data: any; folderId: string }
    >({
      query: ({ workspaceId, id, data, folderId }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["List"],
    }),

    // =========================
    // DELETE LIST
    // DELETE /api/workspaces/:workspaceId/lists/:id
    // =========================
    deleteList: builder.mutation<
      any,
      { workspaceId: string; id: string; folderId: string }
    >({
      query: ({ workspaceId, id, folderId }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["List"],
    }),

    // =========================
    // ADD MEMBER
    // POST /api/workspaces/:workspaceId/lists/:id/members
    // =========================
    addListMember: builder.mutation<
      any,
      {
        workspaceId: string;
        id: string;
        userId: string;
        role: string;
        folderId: string;
        notificationsEnabled: boolean;
      }
    >({
      query: ({
        workspaceId,
        id,
        userId,
        role,
        folderId,
        notificationsEnabled,
      }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}/members?companyId=${getCompanyId()}`,
        method: "POST",
        body: { userId, role, notificationsEnabled },
      }),
      invalidatesTags: ["List"],
    }),

    // =========================
    // REMOVE MEMBER
    // DELETE /api/workspaces/:workspaceId/lists/:id/members/:userId
    // =========================
    removeListMember: builder.mutation<
      any,
      { workspaceId: string; id: string; userId: string; folderId: string }
    >({
      query: ({ workspaceId, id, userId, folderId }) => ({
        url: `${buildListUrl(workspaceId, folderId)}/${id}/members/${userId}?companyId=${getCompanyId()}`,
        method: "DELETE",
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
  useRemoveListMemberMutation,
} = listApi;
