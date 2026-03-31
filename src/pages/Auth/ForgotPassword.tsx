import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const ForgotPassword = () => {
  const { email, setEmail, sendResetCode, sendingCode } = usePasswordReset();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-portal-header">
            Reset Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset code
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendResetCode();
            }}
          >
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" disabled={sendingCode}>
              {sendingCode ? "Sending..." : "Send Reset Code"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
