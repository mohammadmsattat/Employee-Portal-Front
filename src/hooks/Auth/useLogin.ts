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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [logIn, { isLoading }] = useHrLoginMutation();

  const mapErrorToCode = (err: any) => {
    const msg = err?.data?.message;

    if (!msg) return "SERVER_ERROR";

    if (
      msg.includes("Invalid") ||
      msg.includes("credentials") ||
      msg.includes("password")
    ) {
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

  const saveLoginData = (data: any) => {
    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.data));

    localStorage.setItem("company", data.data.companyId);

    localStorage.setItem(
      "location",
      JSON.stringify(data.data.groupId?.locationId || null),
    );

    localStorage.setItem("group", JSON.stringify(data.data.groupId || null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const res = await logIn({
        email: email.trim().toLowerCase(),
        password,
      } as LoginRequest).unwrap();

      /*
        Multiple companies
        Go to company selection page
      */
      if (res.needCompanySelection && res.companies) {
        navigate("/select-company", {
          state: {
            companies: res.companies,
          },
        });

        return;
      }

      /*
        Single company login
      */
      if (res.token && res.data) {
        saveLoginData(res);

        navigate("/");
        return;
      }

      setError("Something went wrong. Please try again later");
    } catch (err: any) {
      const code = mapErrorToCode(err);

      setError(AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]);
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
