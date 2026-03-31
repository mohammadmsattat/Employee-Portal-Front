import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const VerifyCode = () => {
  const { code, setCode, verifying, verifyCode } = usePasswordReset();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-portal-header">
            Verification Code
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the 5-digit code sent to your email
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verifyCode();
            }}
          >
            <Input
              type="text"
              placeholder="*****"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {/* || code.length !== 6 */}
            <Button className="w-full" disabled={verifying}>
              {verifying ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
