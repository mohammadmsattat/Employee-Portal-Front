import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { buildTaskUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

export const activityLogApi = createApi({
  reducerPath: "activityLogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["ActivityLogs"],
  endpoints: (builder) => ({
    getTaskActivity: builder.query<any, { listId: string; taskId: string }>({
      query: ({ listId, taskId }) => {
        return `${buildTaskUrl(listId)}/${taskId}/activity`;
      },
      providesTags: (result, error, { taskId }) => [
        { type: "ActivityLogs", id: taskId },
      ],
    }),
  }),
});

export const { useGetTaskActivityQuery } = activityLogApi;
