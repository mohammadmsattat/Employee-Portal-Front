import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseURL, {
  HrLogInEndPoint,
  HrSignOutEndPoint,
  HrResetPasswordEndPoint,
  HrVerifyResetCodeEndPoint,
  HrForgotPasswordEndPoint,
} from "@/Api/GlobalData";

import {
  LoginRequest,
  LoginResponse,
  SignOutRequest,
  SignOutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/rtk/interfaces";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("staffToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // ===== LOGIN =====
    hrLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (loginData) => ({
        url: HrLogInEndPoint,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ===== SIGN OUT =====
    hrSignOut: builder.mutation<SignOutResponse, SignOutRequest>({
      query: (data) => ({
        url: HrSignOutEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ===== FORGOT PASSWORD =====
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: ({  email }) => ({
        url: `${HrForgotPasswordEndPoint}`,
        method: "POST",
        body: { email },
      }),
    }),

    // ===== VERIFY RESET CODE =====
    verifyResetCode: builder.mutation<
      VerifyResetCodeResponse,
      VerifyResetCodeRequest
    >({
      query: ({  email, resetCode }) => ({
        url: `${HrVerifyResetCodeEndPoint}`,
        method: "POST",
        body: { email, resetCode },
      }),
    }),

    // ===== RESET PASSWORD =====
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: ({ email, newPassword }) => ({
        url: `${HrResetPasswordEndPoint}`,
        method: "POST",
        body: { email, newPassword },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useHrLoginMutation,
  useHrSignOutMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
