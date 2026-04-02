import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const ForgotPassword = () => {
  const { email, setEmail, sendResetCode, sendingCode, t } = usePasswordReset();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-6">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-border rounded-2xl">
        <CardHeader className="text-center space-y-2 px-5 sm:px-6 pt-6">
          <img src="/logo.png" alt="Logo" className="h-10 sm:h-12 mx-auto mb-2" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-portal-header">
            {t("forgotPassword.title")}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("forgotPassword.subtitle")}
          </p>
        </CardHeader>

        <CardContent className="px-5 sm:px-6 pb-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendResetCode();
            }}
          >
            {/* Email */}
            <div>
              <label className="text-xs sm:text-sm font-medium">
                {t("forgotPassword.email")}
              </label>
              <Input
                type="email"
                placeholder={t("forgotPassword.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                required
              />
            </div>

            {/* Button */}
            <Button
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={sendingCode}
            >
              {sendingCode
                ? t("forgotPassword.sending")
                : t("forgotPassword.sendCode")}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};