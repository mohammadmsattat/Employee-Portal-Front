import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { taskEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Tasks"],

  endpoints: (builder) => ({
    getAllTasks: builder.query<any, void>({
      query: () => `${taskEndPoint}?companyId=${getCompanyId()}`,
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query<any, string>({
      query: (id) => `${taskEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `${taskEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${taskEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<any, string>({
      query: (id) => ({
        url: `${taskEndPoint}/${id}?companyId=${getCompanyId()}`,
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