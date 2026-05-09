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
    getLists: builder.query<any, { workspaceId: string }>({
      query: ({ workspaceId }) =>
        `${buildListUrl(workspaceId)}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // =========================
    // GET ONE LIST
    // GET /api/workspaces/:workspaceId/lists/:id
    // =========================
    getListById: builder.query<
      any,
      { workspaceId: string; id: string }
    >({
      query: ({ workspaceId, id }) =>
        `${buildListUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["List"],
    }),

    // =========================
    // CREATE LIST
    // POST /api/workspaces/:workspaceId/lists
    // =========================
    createList: builder.mutation<
      any,
      { workspaceId: string; data: any }
    >({
      query: ({ workspaceId, data }) => ({
        url: `${buildListUrl(workspaceId)}?companyId=${getCompanyId()}`,
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
      { workspaceId: string; id: string; data: any }
    >({
      query: ({ workspaceId, id, data }) => ({
        url: `${buildListUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
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
      { workspaceId: string; id: string }
    >({
      query: ({ workspaceId, id }) => ({
        url: `${buildListUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
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
      { workspaceId: string; id: string; userId: string; role: string }
    >({
      query: ({ workspaceId, id, userId, role }) => ({
        url: `${buildListUrl(workspaceId)}/${id}/members?companyId=${getCompanyId()}`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: ["List"],
    }),

    // =========================
    // REMOVE MEMBER
    // DELETE /api/workspaces/:workspaceId/lists/:id/members/:userId
    // =========================
    removeListMember: builder.mutation<
      any,
      { workspaceId: string; id: string; userId: string }
    >({
      query: ({ workspaceId, id, userId }) => ({
        url: `${buildListUrl(workspaceId)}/${id}/members/${userId}?companyId=${getCompanyId()}`,
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