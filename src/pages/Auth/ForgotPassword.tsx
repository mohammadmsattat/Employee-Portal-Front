import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/hooks/Auth/usePasswordReset";

export const ForgotPassword = () => {
  const { email, setEmail, sendResetCode, sendingCode, t } = usePasswordReset();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,#f8fbff_0%,#f1f5f9_45%,#ffffff_100%)] px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[-80px] h-56 w-56 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-60px] h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden rounded-[34px] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 text-center sm:mb-10">
                <div className="mb-5 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium tracking-wide text-blue-700">
                  Account Recovery
                </div>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-blue-50 to-white shadow-sm ring-1 ring-blue-100">
                  <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
                </div>

                <h1 className="text-[28px] font-bold tracking-[-0.03em] text-slate-900 sm:text-[32px]">
                  {t("forgotPassword.title")}
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-[15px]">
                  {t("forgotPassword.subtitle")}
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendResetCode();
                }}
              >
                <div className="space-y-4 rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-4 sm:p-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {t("forgotPassword.email")}
                    </label>

                    <div className="rounded-3xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.04)] ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-blue-500">
                      <Input
                        type="email"
                        placeholder={t("forgotPassword.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-3xl border-0 bg-transparent px-4 text-[15px] shadow-none focus-visible:ring-0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-3xl bg-blue-600 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition-all hover:-translate-y-[1px] hover:bg-blue-700"
                  disabled={sendingCode}
                >
                  {sendingCode
                    ? t("forgotPassword.sending")
                    : t("forgotPassword.sendCode")}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    {t("forgotPassword.backToLogin")}
                  </Link>
                </div>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Use your work email to receive a reset code
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
