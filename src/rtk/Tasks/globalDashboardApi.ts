import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { globalDashboardEndPoint } from "@/Api/GlobalData";

const getJWT = () => localStorage.getItem("token");

export const globalDashboardApi = createApi({
  reducerPath: "globalDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["GlobalDashboard"],
  endpoints: (builder) => ({
    getGlobalDashboard: builder.query<any, void>({
      query: () => globalDashboardEndPoint,
      providesTags: ["GlobalDashboard"],
    }),
  }),
});

export const { useGetGlobalDashboardQuery } = globalDashboardApi;