import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import baseURL, { StaffEndPoint } from "../../Api/GlobalData";
import { StaffsResponse, GetAllStaffParams } from "../interfaces";

const getJWT = () => Cookies.get("Token");
const getCompanyId = () => Cookies.get("DB_Name");

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const jwt = getJWT();
      if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
      return headers;
    },
  }),
  tagTypes: ["Staff"],
  endpoints: (builder) => ({
getAllStaff: builder.query<StaffsResponse, GetAllStaffParams & { directManager?: string }>({
  query: ({
    keyword = "",
    limit = 1000,
    page = 1,
    branchId,
    position = "",
    directManager,
  }) => {
    const params = new URLSearchParams({
      companyId: getCompanyId()!,
      keyword,
      limit: limit.toString(),
      page: page.toString(),
      position,
    });

    if (branchId) params.append("branch", branchId);
    if (directManager) params.append("directManager", directManager);

    return `${StaffEndPoint}?${params.toString()}`;
  },
}),
  }),
});

export const { useGetAllStaffQuery } = staffApi;