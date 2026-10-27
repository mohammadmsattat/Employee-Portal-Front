import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { buildAttachmentUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

type AttachmentQueryArgs = {
  listId: string;
  taskId: string;
};

type UploadAttachmentArgs = {
  listId: string;
  taskId: string;
  file: File;
};

type DeleteAttachmentArgs = {
  listId: string;
  taskId: string;
  attachmentId: string;
};

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
    // =====================================
    // GET TASK ATTACHMENTS
    // GET /api/lists/:listId/tasks/:taskId/attachments
    // =====================================
    getTaskAttachments: builder.query<any, AttachmentQueryArgs>({
      query: ({ listId, taskId }) => buildAttachmentUrl(listId, taskId),

      providesTags: (result, error, { taskId }) => [
        { type: "Attachments", id: taskId },
      ],
    }),

    // =====================================
    // UPLOAD ATTACHMENT
    // POST /api/lists/:listId/tasks/:taskId/attachments
    // =====================================
    uploadAttachment: builder.mutation<any, UploadAttachmentArgs>({
      query: ({ listId, taskId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: buildAttachmentUrl(listId, taskId),
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachments", id: taskId },
      ],
    }),

    // =====================================
    // DELETE ATTACHMENT
    // DELETE /api/lists/:listId/tasks/:taskId/attachments/:attachmentId
    // =====================================
    deleteAttachment: builder.mutation<any, DeleteAttachmentArgs>({
      query: ({ listId, taskId, attachmentId }) => ({
        url: `${buildAttachmentUrl(listId, taskId)}/${attachmentId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachments", id: taskId },
        "Attachments",
      ],
    }),
  }),
});

export const {
  useGetTaskAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentApi;
