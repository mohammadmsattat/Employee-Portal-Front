import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { buildWorkspaceDashboardUrl } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

export const workspaceDashboardApi = createApi({
  reducerPath: "workspaceDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["WorkspaceDashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query<any, string>({
      query: (workspaceId) => buildWorkspaceDashboardUrl(workspaceId),
      providesTags: ["WorkspaceDashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = workspaceDashboardApi;
