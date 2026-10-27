import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildTaskUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

type GetAllTasksArgs = {
  listId: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  due?: string;
  includeArchived?: boolean; // ✅ جديد
};

type TaskChecklistArgs = {
  listId: string;
  taskId: string;
  itemId: string;
};

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

  tagTypes: ["Tasks", "GlobalDashboard"],

  endpoints: (builder) => ({
    // =====================================
    // GET ALL TASKS
    // GET /api/lists/:listId/tasks
    // =====================================
    getAllTasks: builder.query<any, GetAllTasksArgs>({
      query: ({
        listId,
        page,
        limit,
        status,
        priority,
        assignedTo,
        due,
        includeArchived,
      }) => {
        const params = new URLSearchParams();

        if (page !== undefined) {
          params.set("page", String(page));
        }

        if (limit !== undefined) {
          params.set("limit", String(limit));
        }

        if (status) {
          params.set("status", status);
        }

        if (priority) {
          params.set("priority", priority);
        }

        if (assignedTo) {
          params.set("assignedTo", assignedTo);
        }

        if (due) {
          params.set("due", due);
        }

        // ✅ Archived filter
        if (includeArchived) {
          params.set("includeArchived", "true");
        }

        const queryString = params.toString();
        const url = buildTaskUrl(listId);

        return queryString ? `${url}?${queryString}` : url;
      },

      providesTags: ["Tasks"],
    }),

    // =====================================
    // GET TASK BY ID
    // GET /api/lists/:listId/tasks/:taskId
    // =====================================
    getTaskById: builder.query<
      any,
      {
        listId: string;
        id: string;
      }
    >({
      query: ({ listId, id }) => `${buildTaskUrl(listId)}/${id}`,

      providesTags: ["Tasks"],
    }),

    // =====================================
    // CREATE TASK
    // POST /api/lists/:listId/tasks
    // =====================================
    createTask: builder.mutation<
      any,
      {
        listId: string;
        data: any;
      }
    >({
      query: ({ listId, data }) => ({
        url: buildTaskUrl(listId),
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // UPDATE TASK
    // PATCH /api/lists/:listId/tasks/:taskId
    // =====================================
    updateTask: builder.mutation<
      any,
      {
        listId: string;
        id: string;
        data: any;
      }
    >({
      query: ({ listId, id, data }) => ({
        url: `${buildTaskUrl(listId)}/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // DELETE TASK
    // DELETE /api/lists/:listId/tasks/:taskId
    // =====================================
    deleteTask: builder.mutation<
      any,
      {
        listId: string;
        taskId: string;
      }
    >({
      query: ({ listId, taskId }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // ARCHIVE TASK
    // PATCH /api/lists/:listId/tasks/:taskId/archive
    // =====================================
    archiveTask: builder.mutation<
      any,
      {
        listId: string;
        taskId: string;
      }
    >({
      query: ({ listId, taskId }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/archive`,
        method: "PATCH",
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // UNARCHIVE TASK
    // PATCH /api/lists/:listId/tasks/:taskId/unarchive
    // =====================================
    unarchiveTask: builder.mutation<
      any,
      {
        listId: string;
        taskId: string;
      }
    >({
      query: ({ listId, taskId }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/unarchive`,
        method: "PATCH",
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // ADD TASK CHECKLIST ITEM
    // =====================================
    addChecklistItem: builder.mutation<
      any,
      {
        listId: string;
        taskId: string;
        data: {
          title: string;
        };
      }
    >({
      query: ({ listId, taskId, data }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/checklist`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // UPDATE TASK CHECKLIST ITEM
    // =====================================
    updateChecklistItem: builder.mutation<
      any,
      TaskChecklistArgs & {
        data: {
          title?: string;
          isDone?: boolean;
        };
      }
    >({
      query: ({ listId, taskId, itemId, data }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/checklist/${itemId}`,

        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // DELETE TASK CHECKLIST ITEM
    // =====================================
    deleteChecklistItem: builder.mutation<any, TaskChecklistArgs>({
      query: ({ listId, taskId, itemId }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/checklist/${itemId}`,

        method: "DELETE",
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),

    // =====================================
    // TOGGLE TASK CHECKLIST ITEM
    // =====================================
    toggleChecklistItem: builder.mutation<any, TaskChecklistArgs>({
      query: ({ listId, taskId, itemId }) => ({
        url: `${buildTaskUrl(listId)}/${taskId}/checklist/${itemId}/toggle`,

        method: "PATCH",
      }),

      invalidatesTags: ["Tasks", "GlobalDashboard"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useArchiveTaskMutation,
  useUnarchiveTaskMutation,
  useAddChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useToggleChecklistItemMutation,
} = taskApi;
