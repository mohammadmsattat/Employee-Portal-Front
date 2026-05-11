import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildTaskUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const taskApi = createApi({
  reducerPath: "taskApi",

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

  tagTypes: ["Tasks"],

  endpoints: (builder) => ({
    // =========================
    // GET ALL TASKS
    // /api/workspaces/:workspaceId/tasks
    // =========================
    getAllTasks: builder.query<
      any,
      {
        workspaceId: string;
        listId?: string;
        status?: string;
        priority?: string;
        assignedTo?: string;
        due?: string;
      }
    >({
      query: ({ workspaceId, listId, status, priority, assignedTo, due }) => {
        const params = new URLSearchParams();

        if (listId) {
          params.append("listId", listId);
        }

        if (status) {
          params.append("status", status);
        }

        if (priority) {
          params.append("priority", priority);
        }

        if (assignedTo) {
          params.append("assignedTo", assignedTo);
        }

        if (due) {
          params.append("due", due);
        }

        params.append("companyId", getCompanyId() || "");

        return `${buildTaskUrl(workspaceId)}?${params.toString()}`;
      },

      providesTags: ["Tasks"],
    }),
    // =========================
    // GET TASK BY ID
    // /api/workspaces/:workspaceId/tasks/:id
    // =========================
    getTaskById: builder.query<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) =>
        `${buildTaskUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,

      providesTags: ["Tasks"],
    }),

    // =========================
    // CREATE TASK
    // /api/workspaces/:workspaceId/tasks
    // =========================
    createTask: builder.mutation<any, { workspaceId: string; data: any }>({
      query: ({ workspaceId, data }) => ({
        url: `${buildTaskUrl(workspaceId)}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Tasks"],
    }),

    // =========================
    // UPDATE TASK
    // /api/workspaces/:workspaceId/tasks/:id
    // =========================
    updateTask: builder.mutation<
      any,
      { workspaceId: string; id: string; data: any }
    >({
      query: ({ workspaceId, id, data }) => ({
        url: `${buildTaskUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Tasks"],
    }),

    // =========================
    // DELETE TASK
    // /api/workspaces/:workspaceId/tasks/:id
    // =========================
    deleteTask: builder.mutation<any, { workspaceId: string; id: string }>({
      query: ({ workspaceId, id }) => ({
        url: `${buildTaskUrl(workspaceId)}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
