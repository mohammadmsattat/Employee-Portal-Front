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
  } = usePasswordReset();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-portal-header">
            Create New Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a strong password for your account
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
          >
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button className="w-full" disabled={resetting}>
              {resetting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
