import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const VerifyCode = () => {
  const { code, setCode, verifying, verifyCode, t } = usePasswordReset();

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
            {t("verifyCode.title")}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("verifyCode.subtitle")}
          </p>
        </CardHeader>

        <CardContent className="px-5 sm:px-6 pb-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verifyCode();
            }}
          >
            {/* Input */}
            <Input
              type="text"
              placeholder={t("verifyCode.placeholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
            />

            {/* Button */}
            <Button
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={verifying}
            >
              {verifying ? t("verifyCode.verifying") : t("verifyCode.verify")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
