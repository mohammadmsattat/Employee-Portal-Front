import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const NewPassword = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    resetting,
    resetPassword,
    t,
  } = usePasswordReset();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-6">
      <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-border rounded-2xl">
        <CardHeader className="text-center space-y-2 px-5 sm:px-6 pt-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 mx-auto mb-2"
          />
          <CardTitle className="text-xl sm:text-2xl font-bold text-portal-header">
            {t("newPassword.title")}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("newPassword.subtitle")}
          </p>
        </CardHeader>

        <CardContent className="px-5 sm:px-6 pb-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
          >
            {/* New Password */}
            <div>
              <label className="text-sm sm:text-base font-medium">
                {t("newPassword.newPassword")}
              </label>
              <Input
                type="password"
                placeholder={t("newPassword.passwordPlaceholder")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm sm:text-base font-medium">
                {t("newPassword.confirmPassword")}
              </label>
              <Input
                type="password"
                placeholder={t("newPassword.passwordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            {/* Button */}
            <Button
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={resetting}
            >
              {resetting
                ? t("newPassword.resetting")
                : t("newPassword.resetPassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
