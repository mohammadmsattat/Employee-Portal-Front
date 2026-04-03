// hooks/usePasswordReset.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from "@/rtk/Auth/AuthApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to handle the password reset flow
 * Steps:
 * 1. Send reset code to email
 * 2. Verify the code
 * 3. Reset the password
 */
export const usePasswordReset = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ===== Form State =====
  const [email, setEmail] = useState<string>(
    localStorage.getItem("resetEmail") || "",
  );
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // ===== Mutations =====
  const [forgotPasswordMutation, { isLoading: sendingCode }] =
    useForgotPasswordMutation();
  const [verifyCodeMutation, { isLoading: verifying }] =
    useVerifyResetCodeMutation();
  const [resetPasswordMutation, { isLoading: resetting }] =
    useResetPasswordMutation();

  // ===== Step 1: Send Reset Code =====
  const sendResetCode = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      await forgotPasswordMutation({ email }).unwrap();
      localStorage.setItem("resetEmail", email);
      toast.success("Reset code sent to your email");
      navigate("/verify-code", { state: { email } });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to send reset code");
    }
  };

  // ===== Step 2: Verify Reset Code =====
  const verifyCode = async () => {
    if (!email || !code) {
      toast.error("Email and code are required");
      return;
    }

    try {
      await verifyCodeMutation({ email, resetCode: code }).unwrap();
      toast.success("Code verified successfully");
      navigate("/new-password", { state: { email } });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Verification failed");
    }
  };

  // ===== Step 3: Reset Password =====
  const resetPassword = async () => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPasswordMutation({ email, newPassword }).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  // ===== Return Hook State & Actions =====
  return {
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    sendingCode,
    verifying,
    resetting,
    sendResetCode,
    verifyCode,
    resetPassword,
    t,
  };
};
