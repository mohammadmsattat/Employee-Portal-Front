import Layout from "@/components/layout/Layout";
import { useHome } from "@/hooks/home/useHome";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import HomeQuickActions from "@/components/home/HomeQuickActions.tsx";
import { CalendarDays, Clock3, FileText, MapPin } from "lucide-react";

const Home = () => {
  const { user, leaveBalances, pendingRequests, navigate, t } = useHome();

  const {
    lastCheckIn,
    lastCheckOut,
    workedTimeText,
    locationLoading,
    isWithinDistance,
    canAction,
    handleFingerprint,
    mode,
  } = useAttendance();

  if (!user) navigate("/login");

  return (
    <Layout>
      <div className="space-y-5">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="grid min-h-[260px] gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_260px]">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-blue-600">
                    {t("navigation.welcome") || "Welcome back"}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                    {user?.fullName || t("navigation.name")}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Your workday, requests, attendance, and tasks in one clean
                    workspace.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <HomeMetric
                    icon={<Clock3 className="h-4 w-4" />}
                    label={t("homePage.attendance") || "Attendance"}
                    value={workedTimeText || "0h"}
                  />
                  <HomeMetric
                    icon={<CalendarDays className="h-4 w-4" />}
                    label={t("homePage.leaves") || "Leaves"}
                    value={String(leaveBalances?.length || 0)}
                  />
                  <HomeMetric
                    icon={<FileText className="h-4 w-4" />}
                    label={t("navigation.requests") || "Requests"}
                    value={String(pendingRequests?.length || 0)}
                  />
                  <HomeMetric
                    icon={<MapPin className="h-4 w-4" />}
                    label={t("attendancePage.location") || "Location"}
                    value={
                      locationLoading ? "..." : isWithinDistance ? "OK" : "--"
                    }
                  />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold text-blue-200">{mode}</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      {t("attendancePage.lastCheckIn") || "Last check-in"}
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {lastCheckIn?.Time || "--:--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      {t("attendancePage.lastCheckOut") || "Last check-out"}
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {lastCheckOut?.Time || "--:--"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFingerprint}
                  disabled={!canAction}
                  className="mt-6 h-11 w-full rounded-lg bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {mode}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SummaryTile
              label={t("homePage.balance") || "Leave balance"}
              value={`${leaveBalances?.[0]?.remainingDays ?? 12}`}
              caption={t("homePage.daysAvailable") || "Days available"}
            />
            <SummaryTile
              label={t("navigation.requests") || "Requests"}
              value={`${pendingRequests?.length || 0}`}
              caption={t("homePage.pending") || "Pending review"}
            />
          </div>
        </section>

        <HomeQuickActions t={t} />
      </div>
    </Layout>
  );
};

export default Home;

const HomeMetric = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-white text-blue-600 ring-1 ring-slate-200">
      {icon}
    </div>
    <p className="truncate text-xs font-semibold uppercase text-slate-500">
      {label}
    </p>
    <p className="mt-1 truncate text-lg font-bold text-slate-950">{value}</p>
  </div>
);

const SummaryTile = ({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) => (
  <div className="flex min-h-[124px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <div>
      <p className="text-4xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{caption}</p>
    </div>
  </div>
);
