import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/hooks/Auth/useLogin";
import { Link } from "react-router-dom";

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
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-border rounded-2xl">
        <CardHeader className="text-center space-y-2 px-5 sm:px-6 pt-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 mx-auto mb-2"
          />

          <CardTitle className="text-xl sm:text-2xl font-bold text-portal-header">
            {t("login.title")}
          </CardTitle>

          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("login.subtitle")}
          </p>
        </CardHeader>

        <CardContent className="px-5 sm:px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs sm:text-sm font-medium">
                {t("login.email")}
              </label>
              <Input
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs sm:text-sm font-medium">
                {t("login.password")}
              </label>
              <Input
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
            </div>

            {/* Forgot */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs sm:text-sm text-destructive text-center">
                {error}
              </p>
            )}

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? t("login.signingIn") : t("login.signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
