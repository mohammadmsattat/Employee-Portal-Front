import { useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Fingerprint,
  MapPin,
} from "lucide-react";

import Layout from "@/components/layout/Layout";

import { useHome } from "@/hooks/home/useHome";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import HomeQuickActions from "@/components/home/HomeQuickActions.tsx";

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
};

interface HomeProps {
  openAttendanceModal?: () => void;
}

const openAttendanceModal = () => {
  const attendanceButton = document.querySelector(
    "[data-attendance-trigger]",
  ) as HTMLButtonElement | null;

  attendanceButton?.click();
};

const Home = () => {
  const { user, leaveBalances, pendingRequests, navigate, t } = useHome();

  const { workedTimeText, locationLoading, isWithinDistance, canAction, mode } =
    useAttendance();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="space-y-5">
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {" "}
          <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="flex min-h-[260px] flex-col justify-between p-5 sm:p-7">
              <div>
                <p className="text-sm font-semibold uppercase text-blue-600">
                  {t("homePage.welcome") || "Welcome back"}
                </p>

                <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                  {user?.fullName || t("navigation.name")}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Your workday, requests, attendance, and tasks in one clean
                  workspace.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={openAttendanceModal}
                  disabled={!canAction}
                  className="hidden w-full items-center justify-between rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-6 py-5 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Fingerprint className="h-7 w-7" />
                    </div>

                    <div className="text-left">
                      <p className="text-base font-bold">{mode}</p>

                      <p className="mt-1 text-xs text-slate-500">
                        Tap to open attendance
                      </p>
                    </div>
                  </div>
                </button>{" "}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    icon={<MapPin className="h-4 w-4" />}
                    label={t("homePage.location") || "Location"}
                    value={
                      locationLoading
                        ? "..."
                        : isWithinDistance
                          ? t("homePage.inside")
                          : t("homePage.outside")
                    }
                    valueClassName={
                      locationLoading
                        ? "text-slate-950"
                        : isWithinDistance
                          ? "text-emerald-600"
                          : "text-red-500"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <LeaveBalancesTile
              balances={leaveBalances}
              title={t("homePage.balance") || "Leave balance"}
            />

            <PendingRequestsTile
              requests={pendingRequests}
              title={t("navigation.requests") || "Requests"}
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
  valueClassName,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
    <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-50 blur-2xl transition-all duration-300 group-hover:bg-blue-100" />

    <div className="relative z-10 flex h-full flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-inner">
          {icon}
        </div>

        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>

      <div className="mt-4">
        <p
          className={`truncate text-xl font-bold tracking-tight ${
            valueClassName || "text-slate-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);

const LeaveBalancesTile = ({
  balances,
  title,
}: {
  balances?: {
    typeKey: string;
    remainingDays: number;
    totalAllowed: number;
    usedDays: number;
  }[];
  title: string;
}) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div className="mb-5 flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">{title}</p>

      <div className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
        {balances?.length || 0}
      </div>
    </div>

    <div className="max-h-[320px] space-y-3 overflow-auto pr-1">
      {balances?.map((leave) => {
        const isLowBalance = leave.remainingDays <= 2;

        return (
          <div
            key={leave.typeKey}
            className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-[0_10px_25px_rgba(37,99,235,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold capitalize text-slate-800">
                  {leaveTypeLabels[leave.typeKey] || leave.typeKey}
                </p>

                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{leave.usedDays} used</span>

                    <span>{leave.totalAllowed} total</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowBalance ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          (leave.usedDays / leave.totalAllowed) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-w-[68px] flex-col items-center rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <p
                  className={`text-xl font-bold tracking-tight ${
                    isLowBalance ? "text-red-500" : "text-slate-900"
                  }`}
                >
                  {leave.remainingDays}
                </p>

                <p className="text-[11px] text-slate-500">days left</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PendingRequestsTile = ({
  requests,
  title,
}: {
  requests?: any[];
  title: string;
}) => {
  const requestTypeLabels: Record<string, string> = {
    Leave: "Leave Request",
    Advance: "Advance Request",
    Overtime: "Overtime Request",
  };

  const getRequestDetails = (request: any) => {
    switch (request.requestType) {
      case "Leave":
        return `${request.days} days`;

      case "Advance":
        return `$${request.amount}`;

      case "Overtime":
        return `${request.hours} hrs`;

      default:
        return "";
    }
  };

  const getRequestDate = (request: any) => {
    const date = new Date(request.createdAt);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>

          <p className="mt-1 text-xs text-slate-400">
            Latest submitted requests
          </p>
        </div>

        <div className="flex h-9 min-w-[36px] items-center justify-center rounded-xl bg-blue-50 px-3 text-sm font-semibold text-blue-600">
          {requests?.length || 0}
        </div>
      </div>

      <div className="max-h-[340px] space-y-3 overflow-auto pr-1">
        {requests?.length ? (
          requests.slice(0, 4).map((request) => (
            <div
              key={request._id}
              className="group rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_10px_25px_rgba(37,99,235,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {requestTypeLabels[request.requestType] ||
                        request.requestType}
                    </p>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize tracking-wide ${getStatusStyles(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">
                      {getRequestDetails(request)}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                    <span>{getRequestDate(request)}</span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:border-blue-200">
                  {request.requestType === "Leave" ? (
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  ) : request.requestType === "Advance" ? (
                    <FileText className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock3 className="h-4 w-4 text-violet-600" />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              No pending requests
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Everything is up to date
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
