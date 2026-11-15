// src/rtk/baseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import baseURL from "@/Api/GlobalData";

// ---------- الأنبوب الأساسي ----------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers) => {
    const token =
      localStorage.getItem("staffToken") || localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ---------- مسح الجلسة ----------
const clearSession = () => {
  [
    "token",
    "staffToken",
    "user",
    "company",
    "location",
    "group",
    "refreshToken",
  ].forEach((k) => localStorage.removeItem(k));
};

// ---------- الغلاف اللي يلتقط الـ 401 ----------
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // نلتقط فقط 401 (توكن باطل أو منتهي)
  if (result.error?.status === 401) {
    clearSession();

    // إطلاق الحدث فقط (الواجهة هي التي ستتولى إظهار الـ Modal)
    window.dispatchEvent(new CustomEvent("session-expired"));
  }

  return result;
};
