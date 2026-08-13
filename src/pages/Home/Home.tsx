import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useHome } from "@/hooks/home/useHome";
import Layout from "@/components/layout/Layout";
import {
  Clock3,
  FileText,
  MapPin,
  CheckCircle2,
  Briefcase,
  Gift,
  Inbox,
} from "lucide-react";
import { StatCardMobile } from "@/components/home/StatCardMobile";
import { StatCardWeb } from "@/components/home/StatCardWeb";
import { LeaveBalanceItem } from "@/components/home/LeaveBalanceItem";
import { PendingRequestItem } from "@/components/home/PendingRequestItem";
import { AttendanceCard } from "@/components/home/AttendanceCard";

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
};

const openAttendanceModal = () => {
  const attendanceButton = document.querySelector(
    "[data-attendance-trigger]",
  ) as HTMLButtonElement | null;
  attendanceButton?.click();
};

const Home = () => {
  const { user, leaveBalances, pendingRequests, t } = useHome();
  const { workedTimeText, locationLoading, isWithinDistance, canAction, mode } =
    useAttendance();

  const pendingCount = pendingRequests?.length || 0;

  // Helper function to safely get department name
  const getDepartmentName = (dept: any): string => {
    if (!dept) return "Engineering";
    if (typeof dept === "string") return dept;
    if (dept.name) return dept.name;
    if (dept.AlternativeName) return dept.AlternativeName;
    return "Engineering";
  };

  // Helper function to safely get position/job title
  const getPosition = (pos: any): string => {
    if (!pos) return "Employee";
    if (typeof pos === "string") return pos;
    if (pos.name) return pos.name;
    if (pos.title) return pos.title;
    if (pos.jobTitle) return pos.jobTitle;
    return "Employee";
  };

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-8">
            {/* Mobile Header (No Card) */}
            <div className="sm:hidden mb-6">
              {/* Stats Row - Mobile Grid 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                <StatCardMobile
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Worked Today"
                  value={workedTimeText || "0h"}
                  color="blue"
                />
                <StatCardMobile
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={
                    locationLoading
                      ? "..."
                      : isWithinDistance
                        ? "In Range"
                        : "Outside"
                  }
                  color={isWithinDistance ? "emerald" : "red"}
                />
                <StatCardMobile
                  icon={<Gift className="h-4 w-4" />}
                  label="Leave Balance"
                  value={`${leaveBalances?.reduce((acc, l) => acc + l.remainingDays, 0) || 0} Days`}
                  color="purple"
                />
                <StatCardMobile
                  icon={<FileText className="h-4 w-4" />}
                  label="Pending Requests"
                  value={pendingCount.toString()}
                  color={pendingCount > 0 ? "orange" : "gray"}
                />
              </div>
            </div>

            {/* Web Header (With Card) */}
            <div className="hidden sm:block">
              <div className="flex flex-col gap-4 rounded-2xl bg-whte p-6 shadow-sm ring-1 ring-black/5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 ring-2 ring-white/80">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName || "User"}
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = document.createElement("span");
                            fallback.className = "text-xl font-bold";
                            fallback.textContent =
                              user?.fullName?.charAt(0) || "U";
                            parent.appendChild(fallback);
                            e.currentTarget.remove();
                          }
                        }}
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {user?.fullName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-blue-600">
                        {t("homePage.welcome") || "Welcome back"}
                      </p>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-xs text-slate-400">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h1 className="mt-0.5 text-2xl font-bold text-blue-900 lg:text-3xl truncate">
                      {user?.fullName || t("navigation.name")}
                    </h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-600">
                          {getPosition(user?.position)}
                        </span>
                      </div>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">
                          {getDepartmentName(user?.department)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stats Row - Web */}
                <div className="grid grid-cols-4 gap-4">
                  <StatCardWeb
                    icon={<Clock3 className="h-5 w-5" />}
                    label="Worked Today"
                    value={workedTimeText || "0h"}
                    color="blue"
                  />
                  <StatCardWeb
                    icon={<MapPin className="h-5 w-5" />}
                    label="Location"
                    value={
                      locationLoading
                        ? "..."
                        : isWithinDistance
                          ? "In Range"
                          : "Outside"
                    }
                    color={isWithinDistance ? "emerald" : "red"}
                  />
                  <StatCardWeb
                    icon={<Gift className="h-5 w-5" />}
                    label="Remaining Leave Balance"
                    value={`${leaveBalances?.reduce((acc, l) => acc + l.remainingDays, 0) || 0} Days`}
                    color="purple"
                  />
                  <StatCardWeb
                    icon={<FileText className="h-5 w-5" />}
                    label="Pending Requests"
                    value={pendingCount.toString()}
                    color={pendingCount > 0 ? "orange" : "gray"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Attendance Card */}
            <AttendanceCard
              mode={mode}
              canAction={canAction}
              openAttendanceModal={openAttendanceModal}
            />

            {/* Leave Balances */}
            <div className="lg:col-span-1">
              <div className="flex h-[420px] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md sm:h-[420px] lg:h-[440px]">
                <div className="border-b border-slate-100 px-5 py-3.5 sm:px-6 sm:py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-500 sm:text-sm">
                      {t("homePage.balance") || "Leave Balance"}
                    </h2>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 sm:px-2.5 sm:py-1 sm:text-xs">
                      {leaveBalances?.length || 0} types
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 touch-pan-y sm:p-4 sm:pr-2">
                  {leaveBalances?.length ? (
                    <div className="space-y-2 sm:space-y-2">
                      {leaveBalances.map((leave) => (
                        <LeaveBalanceItem
                          key={leave.typeKey}
                          type={leaveTypeLabels[leave.typeKey] || leave.typeKey}
                          used={leave.usedDays}
                          total={leave.totalAllowed}
                          remaining={leave.remainingDays}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-slate-100 p-3 sm:p-3">
                        <Inbox className="h-8 w-8 text-slate-400 sm:h-8 sm:w-8" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-700 sm:mt-4 sm:text-sm">
                        No leave balances available
                      </p>
                      <p className="text-xs text-slate-400 sm:text-sm">
                        Your leave information will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="lg:col-span-1">
              <div className="flex h-[420px] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md sm:h-[420px] lg:h-[440px]">
                <div className="border-b border-slate-100 px-5 py-3.5 sm:px-6 sm:py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-500 sm:text-sm">
                      {t("navigation.requests") || "Pending Requests"}
                    </h2>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 touch-pan-y sm:p-4 sm:pr-2">
                  {pendingRequests?.length ? (
                    <div className="space-y-2 sm:space-y-2">
                      {pendingRequests.slice(0, 5).map((request) => (
                        <PendingRequestItem
                          key={request._id}
                          request={request}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-emerald-50 p-3 sm:p-3">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 sm:h-8 sm:w-8" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-700 sm:mt-4 sm:text-sm">
                        No pending requests
                      </p>
                      <p className="text-xs text-slate-400 sm:text-sm">
                        Everything is up to date
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
