import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, { myProjectsEndPoint } from "@/Api/GlobalData";

const getJWT = () =>
  localStorage.getItem("staffToken") || localStorage.getItem("token");

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["MyProjects"],
  endpoints: (builder) => ({
    getMyProjects: builder.query<any, void>({
      query: () => myProjectsEndPoint,
      providesTags: ["MyProjects"],
    }),
  }),
});

export const { useGetMyProjectsQuery } = projectsApi;
