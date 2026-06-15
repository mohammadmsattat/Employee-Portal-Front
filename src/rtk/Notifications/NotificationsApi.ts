import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { notificationsEndPoint } from "@/Api/GlobalData";
import { Notification, NotificationsResponse } from "../interfaces";

const getJWT = () => localStorage.getItem("token");
const getCompanyId = () => localStorage.getItem("company"); 
console.log(getJWT());

export const NotificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      NotificationsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => {
        const companyId = getCompanyId();
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          companyId: companyId || "",
        });
        return `${notificationsEndPoint}?${params.toString()}`;
      },
      providesTags: ["Notifications"],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => {
        const companyId = getCompanyId();
        return `${notificationsEndPoint}/unread-count?companyId=${companyId || ""}`;
      },
      providesTags: ["Notifications"],
    }),
    markAsRead: builder.mutation<Notification, string>({
      query: (id) => {
        const companyId = getCompanyId();
        return {
          url: `${notificationsEndPoint}/${id}/read?companyId=${companyId || ""}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation<{ modifiedCount: number }, void>({
      query: () => {
        const companyId = getCompanyId();
        return {
          url: `${notificationsEndPoint}/read-all?companyId=${companyId || ""}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = NotificationsApi;