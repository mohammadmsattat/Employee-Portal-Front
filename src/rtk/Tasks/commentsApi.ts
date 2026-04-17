import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { commentEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Comments"],

  endpoints: (builder) => ({
    getComments: builder.query<any, { taskId?: string; subTaskId?: string }>({
      query: ({ taskId, subTaskId }) => {
        const params = new URLSearchParams();

        if (taskId) params.append("taskId", taskId);
        if (subTaskId) params.append("subTaskId", subTaskId);

        return `${commentEndPoint}?${params.toString()}`;
      },
      providesTags: ["Comments"],
    }),

    createComment: builder.mutation<any, any>({
      query: (data) => ({
        url: `${commentEndPoint}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    updateComment: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${commentEndPoint}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation<any, string>({
      query: (id) => ({
        url: `${commentEndPoint}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;