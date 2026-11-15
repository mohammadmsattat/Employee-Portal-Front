import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

import {
  HrLogInEndPoint,
  HrSignOutEndPoint,
  HrResetPasswordEndPoint,
  HrVerifyResetCodeEndPoint,
  HrForgotPasswordEndPoint,
  HrSwitchCompanyEndPoint,
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
  SwitchCompanyRequest,
  SwitchCompanyResponse,
} from "@/rtk/interfaces";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],

  endpoints: (builder) => ({
    hrLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (loginData) => ({
        url: HrLogInEndPoint,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["Auth"],
    }),

    hrSwitchCompany: builder.mutation<
      SwitchCompanyResponse,
      SwitchCompanyRequest
    >({
      query: (data) => ({
        url: HrSwitchCompanyEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    hrSignOut: builder.mutation<SignOutResponse, SignOutRequest>({
      query: (data) => ({
        url: HrSignOutEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: ({ email }) => ({
        url: HrForgotPasswordEndPoint,
        method: "POST",
        body: { email },
      }),
    }),

    verifyResetCode: builder.mutation<
      VerifyResetCodeResponse,
      VerifyResetCodeRequest
    >({
      query: ({ email, resetCode }) => ({
        url: HrVerifyResetCodeEndPoint,
        method: "POST",
        body: { email, resetCode },
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: ({ email, newPassword }) => ({
        url: HrResetPasswordEndPoint,
        method: "POST",
        body: { email, newPassword },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useHrLoginMutation,
  useHrSwitchCompanyMutation,
  useHrSignOutMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
