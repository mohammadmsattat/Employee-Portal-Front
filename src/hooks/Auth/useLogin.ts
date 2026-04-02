import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHrLoginMutation } from "@/rtk/Auth/AuthApi";
import { LoginRequest } from "@/interfaces";
import { useTranslation } from "react-i18next";

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("sara.mohamed@gmail.com");
  const [password, setPassword] = useState("112233");
  const [error, setError] = useState("");

  const [logIn, { isLoading }] = useHrLoginMutation();

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
      const message =
        err?.data?.message || err?.error || "Login failed, please try again";
      setError(message);
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
