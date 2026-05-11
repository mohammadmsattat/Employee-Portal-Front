import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildSubTaskUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

type GetSubTasksArgs = {
  workspaceId: string;
  taskId: string;
};

type GetSubTaskArgs = {
  workspaceId: string;
  taskId: string;
  subTaskId: string;
};

type CreateSubTaskArgs = {
  workspaceId: string;
  taskId: string;
  data: any;
};

type UpdateSubTaskArgs = {
  workspaceId: string;
  taskId: string;
  subTaskId: string;
  data: any;
};

type DeleteSubTaskArgs = {
  workspaceId: string;
  taskId: string;
  subTaskId: string;
};

export const subTaskApi = createApi({
  reducerPath: "subTaskApi",

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

  tagTypes: ["SubTasks"],

  endpoints: (builder) => ({
    /* =========================
       GET ALL
    ========================= */
    getAllSubTasks: builder.query<any, GetSubTasksArgs>({
      query: ({ workspaceId, taskId }) => buildSubTaskUrl(workspaceId, taskId),

      providesTags: ["SubTasks"],
    }),

    /* =========================
       GET BY ID
    ========================= */
    getSubTaskById: builder.query<any, GetSubTaskArgs>({
      query: ({ workspaceId, taskId, subTaskId }) =>
        `${buildSubTaskUrl(workspaceId, taskId)}/${subTaskId}?companyId=${getCompanyId()}`,

      providesTags: ["SubTasks"],
    }),

    /* =========================
       CREATE
    ========================= */
    createSubTask: builder.mutation<any, CreateSubTaskArgs>({
      query: ({ workspaceId, taskId, data }) => ({
        url: `${buildSubTaskUrl(workspaceId, taskId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],
    }),

    /* =========================
       UPDATE
    ========================= */
    updateSubTask: builder.mutation<any, UpdateSubTaskArgs>({
      query: ({ workspaceId, taskId, subTaskId, data }) => ({
        url: `${buildSubTaskUrl(workspaceId, taskId)}/${subTaskId}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],
    }),

    /* =========================
       DELETE
    ========================= */
    deleteSubTask: builder.mutation<any, DeleteSubTaskArgs>({
      query: ({ workspaceId, taskId, subTaskId }) => ({
        url: `${buildSubTaskUrl(workspaceId, taskId)}/${subTaskId}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),

      invalidatesTags: ["SubTasks"],
    }),
  }),
});

export const {
  useGetAllSubTasksQuery,
  useGetSubTaskByIdQuery,
  useCreateSubTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
} = subTaskApi;
