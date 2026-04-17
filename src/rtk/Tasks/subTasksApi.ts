import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { subTaskEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company");

export const subTaskApi = createApi({
  reducerPath: "subTaskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["SubTasks"],

  endpoints: (builder) => ({
    getAllSubTasks: builder.query<any, string | void>({
      query: (taskId) => {
        const params = new URLSearchParams({
          companyId: getCompanyId()!,
        });

        if (taskId) params.append("taskId", taskId);

        return `${subTaskEndPoint}?${params.toString()}`;
      },
      providesTags: ["SubTasks"],
    }),

    getSubTaskById: builder.query<any, string>({
      query: (id) =>
        `${subTaskEndPoint}/${id}?companyId=${getCompanyId()}`,
      providesTags: ["SubTasks"],
    }),

    createSubTask: builder.mutation<any, any>({
      query: (data) => ({
        url: `${subTaskEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubTasks"],
    }),

    updateSubTask: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${subTaskEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubTasks"],
    }),

    deleteSubTask: builder.mutation<any, string>({
      query: (id) => ({
        url: `${subTaskEndPoint}/${id}?companyId=${getCompanyId()}`,
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