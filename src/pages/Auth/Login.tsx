// pages/Login.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLogin } from "@/hooks/Auth/useLogin";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SelectCompany } from "./SelectCompany";
import { Eye, EyeOff, Shield, Mail, Lock } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
    t,
    showCompanySelection,
    companies,
    handleBackToLogin,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 sm:px-6">
      {/* Enhanced Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Card className="overflow-hidden rounded-[40px] border-0 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <CardContent className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {showCompanySelection ? (
                  // Company Selection View
                  <motion.div
                    key="company-selection"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <SelectCompany 
                      companies={companies} 
                      onBack={handleBackToLogin} 
                    />
                  </motion.div>
                ) : (
                  // Login View
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Header */}
                    <div className="mb-10 text-center">
                      {/* Badge */}
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 backdrop-blur-sm">
                        <Shield className="h-3.5 w-3.5" />
                        Employee Portal
                      </div>

                      {/* Logo */}
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-sm ring-1 ring-blue-100">
                        <img src="/logo.png" alt="Logo" className="h-11 w-auto" />
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {t("login.title")}
                      </h1>

                      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                        {t("login.subtitle")}
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Form Fields Container */}
                      <div className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">
                            {t("login.email")}
                          </label>

                          <div className={`
                            relative rounded-xl bg-white transition-all duration-200
                            ${isFocusedEmail 
                              ? 'ring-2 ring-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' 
                              : 'ring-1 ring-slate-200 hover:ring-slate-300'
                            }
                          `}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <Mail className="h-4 w-4" />
                            </div>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setIsFocusedEmail(true)}
                              onBlur={() => setIsFocusedEmail(false)}
                              className="h-12 rounded-xl border-0 bg-transparent pl-11 pr-4 text-sm placeholder:text-slate-400 focus-visible:ring-0"
                              placeholder="name@company.com"
                              required
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">
                              {t("login.password")}
                            </label>
                            <Link
                              to="/forgot-password"
                              className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                            >
                              {t("login.forgotPassword")}
                            </Link>
                          </div>

                          <div className={`
                            relative rounded-xl bg-white transition-all duration-200
                            ${isFocusedPassword 
                              ? 'ring-2 ring-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' 
                              : 'ring-1 ring-slate-200 hover:ring-slate-300'
                            }
                          `}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onFocus={() => setIsFocusedPassword(true)}
                              onBlur={() => setIsFocusedPassword(false)}
                              className="h-12 rounded-xl border-0 bg-transparent pl-11 pr-12 text-sm placeholder:text-slate-400 focus-visible:ring-0"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="relative h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:from-blue-700 hover:to-blue-800 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {t("login.signingIn")}
                          </span>
                        ) : (
                          t("login.signIn")
                        )}
                      </Button>

                      {/* Footer */}
                      <div className="space-y-3 pt-2">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200/60" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-slate-400">Secure access</span>
                          </div>
                        </div>
                        <p className="text-center text-xs text-slate-400">
                          Protected by enterprise-grade security
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;