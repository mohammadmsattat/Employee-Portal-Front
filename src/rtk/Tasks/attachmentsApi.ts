import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { attachmentEndPoint } from "@/Api/GlobalData";

const getCompanyId = () => localStorage.getItem("company");
const getJWT = () => localStorage.getItem("token");

export const attachmentApi = createApi({
  reducerPath: "attachmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Attachments"],

  endpoints: (builder) => ({
    getAttachments: builder.query<any, { taskId?: string; subTaskId?: string }>(
      {
        query: ({ taskId, subTaskId }) => {
          const params = new URLSearchParams();

          if (taskId) params.append("taskId", taskId);
          if (subTaskId) params.append("subTaskId", subTaskId);

          return `${attachmentEndPoint}?companyId=${getCompanyId()}&${params.toString()}`;
        },
        providesTags: ["Attachments"],
      },
    ),
    addAttachment: builder.mutation<any, { taskId: string; url: string }>({
      query: (data) => ({
        url: `${attachmentEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: {
          task: data.taskId,
          url: data.url, 
        },
      }),
      invalidatesTags: ["Attachments"],
    }),
    uploadAttachment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `${attachmentEndPoint}?companyId=${getCompanyId()}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Attachments"],
    }),

    deleteAttachment: builder.mutation<any, string>({
      query: (id) => ({
        url: `${attachmentEndPoint}/${id}?companyId=${getCompanyId()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attachments"],
    }),
  }),
});

export const {
  useGetAttachmentsQuery,
  useAddAttachmentMutation,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentApi;
