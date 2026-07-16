import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useHome } from "@/hooks/home/useHome";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

import {
  CalendarDays,
  Clock3,
  FileText,
  Fingerprint,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  Gift,
  Inbox,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

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

  // دوال التنقل
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
  };

  // معالجة اللمس للتمرير
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      goToNextSlide();
    }
    if (touchStartX - touchEndX < -swipeThreshold) {
      goToPrevSlide();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-8">
            {/* Mobile Header (No Card) */}
            <div className="sm:hidden mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200/50 ring-2 ring-white/80">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-bold">
                      {user?.fullName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-blue-600">
                    {t("homePage.welcome") || "Welcome back"}
                  </p>
                  <h1 className="mt-0.5 text-base font-bold text-blue-900 truncate">
                    {user?.fullName || t("navigation.name")}
                  </h1>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-600 truncate max-w-[80px]">
                        {getPosition(user?.position)}
                      </span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-slate-600 truncate max-w-[80px]">
                      {getDepartmentName(user?.department)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row - Mobile Slider with Swipe */}
              <div 
                className="mt-4"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {/* Stat 1: Worked Today */}
                    <div className="min-w-full px-0.5">
                      <StatCardMobile
                        icon={<Clock3 className="h-5 w-5" />}
                        label="Worked Today"
                        value={workedTimeText || "0h"}
                        color="blue"
                        large
                      />
                    </div>

                    {/* Stat 2: Location */}
                    <div className="min-w-full px-0.5">
                      <StatCardMobile
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
                        large
                      />
                    </div>

                    {/* Stat 3: Leave Balance */}
                    <div className="min-w-full px-0.5">
                      <StatCardMobile
                        icon={<Gift className="h-5 w-5" />}
                        label="Leave Balance"
                        value={`${leaveBalances?.reduce((acc, l) => acc + l.remainingDays, 0) || 0} Days`}
                        color="purple"
                        large
                      />
                    </div>

                    {/* Stat 4: Pending Requests */}
                    <div className="min-w-full px-0.5">
                      <StatCardMobile
                        icon={<FileText className="h-5 w-5" />}
                        label="Pending Requests"
                        value={pendingCount.toString()}
                        color={pendingCount > 0 ? "orange" : "gray"}
                        large
                      />
                    </div>
                  </div>
                </div>

                {/* مؤشرات التقدم فقط */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        currentSlide === index
                          ? "w-6 bg-blue-500"
                          : "w-1.5 bg-slate-300 hover:bg-slate-400",
                      )}
                    />
                  ))}
                </div>
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
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {user?.fullName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>

                  {/* معلومات المستخدم */}
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
                    label="All Leaves Balance"
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
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-100/80 sm:text-sm">
                        Attendance Status
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-lg font-semibold text-white sm:text-xl">
                          {mode === "Check-in" ? "Checked In" : "Checked Out"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-full p-2 ${
                        mode === "Check-in"
                          ? "bg-emerald-500/20"
                          : "bg-amber-500/20"
                      }`}
                    >
                      <Fingerprint
                        className={`h-5 w-5 ${
                          mode === "Check-in"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6">
                  {/* Desktop Action Button */}
                  <button
                    type="button"
                    onClick={openAttendanceModal}
                    disabled={!canAction}
                    className="group hidden w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:shadow-none md:block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100">
                          <Fingerprint className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {canAction ? "Check In / Out" : "Attendance Locked"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {canAction
                              ? "Tap to record your attendance"
                              : "Outside working hours"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-500" />
                    </div>
                  </button>

                  {/* Mobile Info */}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Attendance available from Bottom Bar
                      </p>
                      <p className="mt-0.5 text-xs leading-4 text-slate-500">
                        Use the fingerprint button below to check in or check
                        out.
                      </p>
                    </div>
                  </div>

                  {/* Location Status */}
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 sm:mt-4">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        canAction ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <span className="text-xs text-slate-600">
                      {canAction
                        ? "Location verified. Attendance is ready"
                        : "You are outside the allowed area. Attendance is unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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

// Sub-components
const LeaveBalanceItem = ({
  type,
  used,
  total,
  remaining,
}: {
  type: string;
  used: number;
  total: number;
  remaining: number;
}) => {
  const percentage = (used / total) * 100;
  const isLow = remaining <= 2;

  return (
    <div className="group rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm active:scale-[0.99] sm:p-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            <p className="text-sm font-medium text-slate-700 sm:text-sm truncate">
              {type}
            </p>
            {isLow && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 sm:px-2 sm:py-0.5 sm:text-[10px]">
                <AlertCircle className="h-3 w-3 sm:h-3 sm:w-3" />
                Low
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 sm:mt-1.5 sm:gap-2 sm:text-xs">
            <span>{used}d used</span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300 sm:h-1 sm:w-1" />
            <span>{total}d total</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLow ? "bg-red-400" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex min-w-[58px] shrink-0 flex-col items-center rounded-lg bg-slate-50 px-2.5 py-2 sm:min-w-[58px] sm:px-2.5 sm:py-2">
          <p
            className={`text-lg font-semibold ${isLow ? "text-red-500" : "text-slate-800"} sm:text-lg`}
          >
            {remaining}
          </p>
          <p className="text-xs text-slate-500 sm:text-[10px]">days left</p>
        </div>
      </div>
    </div>
  );
};

const PendingRequestItem = ({ request }: { request: any }) => {
  const navigate = useNavigate();

  const requestTypeLabels: Record<string, string> = {
    Leave: "Leave",
    Advance: "Advance",
    Overtime: "Overtime",
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 text-emerald-600";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-600";
    }
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

  const getIcon = (type: string) => {
    switch (type) {
      case "Leave":
        return <CalendarDays className="h-4 w-4 text-blue-500 sm:h-4 sm:w-4" />;
      case "Advance":
        return <FileText className="h-4 w-4 text-emerald-500 sm:h-4 sm:w-4" />;
      default:
        return <Clock3 className="h-4 w-4 text-purple-500 sm:h-4 sm:w-4" />;
    }
  };

  const handleRequestClick = () => {
    switch (request.requestType) {
      case "Leave":
        navigate("/leaves/Leaves");
        break;
      case "Advance":
        navigate("/advance/my-advance-requests");
        break;
      case "Overtime":
        navigate("/overtime/my-overtime-requests");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="group rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm active:scale-[0.99] cursor-pointer sm:p-4"
      onClick={handleRequestClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            <span className="rounded-lg bg-slate-100 p-1.5 text-slate-500 sm:p-1.5">
              {getIcon(request.requestType)}
            </span>
            <p className="text-sm font-medium text-slate-700 sm:text-sm truncate">
              {requestTypeLabels[request.requestType] || request.requestType}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:px-2 sm:py-0.5 sm:text-[10px] ${getStatusStyles(
                request.status,
              )}`}
            >
              {request.status}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:mt-1.5 sm:gap-2 sm:text-xs">
            <span className="font-medium text-slate-600">
              {getRequestDetails(request)}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300 sm:h-1 sm:w-1" />
            <span>{getRequestDate(request)}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-400 sm:h-4 sm:w-4" />
      </div>
    </div>
  );
};

// Mobile Stat Card
const StatCardMobile = ({
  icon,
  label,
  value,
  color,
  large = false,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  color: "blue" | "emerald" | "purple" | "orange" | "red" | "gray";
  large?: boolean;
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-300/50 bg-transparent transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30",
        large ? "p-4" : "p-3",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium text-slate-500",
              large ? "text-sm" : "text-[10px]",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-semibold text-blue-900",
              large ? "mt-1 text-xl" : "mt-0.5 text-base",
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-xl",
            large ? "ml-2 p-2.5" : "ml-1.5 p-1.5",
            colorMap[color],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// Web Stat Card
const StatCardWeb = ({
  icon,
  label,
  value,
  color,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  color: "blue" | "emerald" | "purple" | "orange" | "red" | "gray";
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="group rounded-2xl bg-whte p-4 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:shadow-md hover:ring-blue-300/50">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-blue-900">{value}</p>
        </div>
        <div className={`ml-3 shrink-0 rounded-xl p-2.5 ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};