import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHrLoginMutation } from "@/rtk/Auth/AuthApi";
import { LoginRequest } from "@/interfaces";
import { useTranslation } from "react-i18next";

const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Incorrect email or password",
  USER_NOT_FOUND: "No account found with this email",
  ACCOUNT_DISABLED: "Your account has been disabled. Please contact support",
  SERVER_ERROR: "Something went wrong. Please try again later",
};

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("sara.mohamed@gmail.com");
  const [password, setPassword] = useState("112233");
  const [error, setError] = useState("");

  const [logIn, { isLoading }] = useHrLoginMutation();

  const mapErrorToCode = (err: any) => {
    const msg = err?.data?.message;

    if (!msg) return "SERVER_ERROR";

    if (msg.includes("Invalid") || msg.includes("credentials")) {
      return "INVALID_CREDENTIALS";
    }

    if (msg.includes("not found")) {
      return "USER_NOT_FOUND";
    }

    if (msg.includes("disabled")) {
      return "ACCOUNT_DISABLED";
    }

    return "SERVER_ERROR";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await logIn({ email, password } as LoginRequest).unwrap();
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("company", res.data.companyId);
        localStorage.setItem(
          "location",
          JSON.stringify(res.data.groupId?.locationId || null),
        );
        localStorage.setItem("group", JSON.stringify(res.data.groupId || null));
      }

      navigate("/");
    } catch (err: any) {
      const code = mapErrorToCode(err);
      setError(AUTH_ERROR_MESSAGES[code]);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
    t,
  };
};
