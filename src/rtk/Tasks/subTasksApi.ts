import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import baseURL, { buildSubTaskUrl } from "@/Api/GlobalData";
import { taskApi } from "./tasksApi";

const getJWT = () => localStorage.getItem("token");

type GetSubTasksArgs = {
  taskId: string;
};

type GetSubTaskArgs = {
  taskId: string;
  subTaskId: string;
};

type CreateSubTaskArgs = {
  taskId: string;
  data: any;
};

type UpdateSubTaskArgs = {
  taskId: string;
  subTaskId: string;
  data: any;
};

type DeleteSubTaskArgs = {
  taskId: string;
  subTaskId: string;
};

type SubTaskChecklistArgs = {
  taskId: string;
  subTaskId: string;
  itemId: string;
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
    // =====================================
    // GET ALL SUBTASKS
    // GET /api/tasks/:taskId/subtasks
    // =====================================
    getAllSubTasks: builder.query<any, GetSubTasksArgs>({
      query: ({ taskId }) => buildSubTaskUrl(taskId),

      providesTags: ["SubTasks"],
    }),

    // =====================================
    // GET SUBTASK BY ID
    // GET /api/tasks/:taskId/subtasks/:subTaskId
    // =====================================
    getSubTaskById: builder.query<any, GetSubTaskArgs>({
      query: ({ taskId, subTaskId }) =>
        `${buildSubTaskUrl(taskId)}/${subTaskId}`,

      providesTags: ["SubTasks"],
    }),

    // =====================================
    // CREATE SUBTASK
    // POST /api/tasks/:taskId/subtasks
    // =====================================
    createSubTask: builder.mutation<any, CreateSubTaskArgs>({
      query: ({ taskId, data }) => ({
        url: buildSubTaskUrl(taskId),
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // لا نحدّث Tasks cache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // UPDATE SUBTASK
    // PATCH /api/tasks/:taskId/subtasks/:subTaskId
    // =====================================
    updateSubTask: builder.mutation<any, UpdateSubTaskArgs>({
      query: ({ taskId, subTaskId, data }) => ({
        url: `${buildSubTaskUrl(taskId)}/${subTaskId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // لا نحدّث Tasks cache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // DELETE SUBTASK
    // DELETE /api/tasks/:taskId/subtasks/:subTaskId
    // =====================================
    deleteSubTask: builder.mutation<any, DeleteSubTaskArgs>({
      query: ({ taskId, subTaskId }) => ({
        url: `${buildSubTaskUrl(taskId)}/${subTaskId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // لا نحدّث Tasks cache إذا فشل الطلب
        }
      },
    }),

    // =====================================
    // ADD SUBTASK CHECKLIST ITEM
    // =====================================
    addSubTaskChecklistItem: builder.mutation<
      any,
      {
        taskId: string;
        subTaskId: string;
        data: {
          title: string;
        };
      }
    >({
      query: ({ taskId, subTaskId, data }) => ({
        url: `${buildSubTaskUrl(taskId)}/${subTaskId}/checklist`,

        method: "POST",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // الطلب فشل
        }
      },
    }),

    // =====================================
    // UPDATE SUBTASK CHECKLIST ITEM
    // =====================================
    updateSubTaskChecklistItem: builder.mutation<
      any,
      SubTaskChecklistArgs & {
        data: {
          title?: string;
          isDone?: boolean;
        };
      }
    >({
      query: ({ taskId, subTaskId, itemId, data }) => ({
        url: `${buildSubTaskUrl(taskId)}/${subTaskId}/checklist/${itemId}`,

        method: "PATCH",
        body: data,
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // الطلب فشل
        }
      },
    }),

    // =====================================
    // DELETE SUBTASK CHECKLIST ITEM
    // =====================================
    deleteSubTaskChecklistItem: builder.mutation<any, SubTaskChecklistArgs>({
      query: ({ taskId, subTaskId, itemId }) => ({
        url: `${buildSubTaskUrl(taskId)}/${subTaskId}/checklist/${itemId}`,

        method: "DELETE",
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // الطلب فشل
        }
      },
    }),

    // =====================================
    // TOGGLE SUBTASK CHECKLIST ITEM
    // =====================================
    toggleSubTaskChecklistItem: builder.mutation<any, SubTaskChecklistArgs>({
      query: ({ taskId, subTaskId, itemId }) => ({
        url: `${buildSubTaskUrl(
          taskId,
        )}/${subTaskId}/checklist/${itemId}/toggle`,

        method: "PATCH",
      }),

      invalidatesTags: ["SubTasks"],

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(taskApi.util.invalidateTags(["Tasks"]));
        } catch {
          // الطلب فشل
        }
      },
    }),
  }),
});

export const {
  useGetAllSubTasksQuery,
  useGetSubTaskByIdQuery,
  useCreateSubTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useAddSubTaskChecklistItemMutation,
  useUpdateSubTaskChecklistItemMutation,
  useDeleteSubTaskChecklistItemMutation,
  useToggleSubTaskChecklistItemMutation,
} = subTaskApi;
