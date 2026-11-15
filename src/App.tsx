import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { useState, useEffect, useRef } from "react";

import Home from "./pages/Home/Home";
import MyLeavesRequests from "./pages/Leaves/MyRequests";
import Attendance from "./pages/Attendance/Attendance";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import { store } from "./rtk/store";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { VerifyCode } from "./pages/Auth/VerifyCode";
import { NewPassword } from "./pages/Auth/NewPassword";
import ManagerLeaveRequests from "./pages/Leaves/ManagerLeaveRequests";
import PrivateRoute from "./providers/PrivateRoute";
import LeavesPage from "./pages/Leaves/LeavesPage";
import TasksPage from "./pages/Tasks/TasksPage";
import OvertimePage from "./pages/Overtime/OvertimePage";
import AdvancePage from "./pages/Advance/AdvancePage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import WorkspaceDashboard from "./components/Tasks/WorkspaceDashboard";
import GlobalDashboard from "./components/Tasks/GlobalDashboard";
import { SessionExpiredModal } from "./components/SessionExpiredModal";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 1. إذا كنا في صفحة اللوجن أو التسجيل، لا تظهر المودال أبداً
    if (
      location.pathname === "/login" ||
      location.pathname === "/forgot-password" ||
      location.pathname === "/verify-code" ||
      location.pathname === "/new-password"
    ) {
      setIsSessionExpired(false);
      return;
    }

    // 2. إعداد المؤقت التلقائي بناءً على وقت انتهاء التوكن
    const token =
      localStorage.getItem("staffToken") || localStorage.getItem("token");

    // إذا لم يوجد توكن، اخرج (لأن PrivateRoute سيتولى توجيهه للوجن)
    if (!token) return;

    let timer: NodeJS.Timeout;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      const timeLeft = expiryTime - Date.now();

      if (timeLeft <= 0) {
        setIsSessionExpired(true);
        queryClient.clear();
      } else {
        timer = setTimeout(() => {
          setIsSessionExpired(true);
          queryClient.clear();
        }, timeLeft);
      }
    } catch (error) {
      setIsSessionExpired(true);
      queryClient.clear();
    }

    // 3. الاستماع لحدث 401 من الـ APIs
    const handleSessionExpired = () => setIsSessionExpired(true);
    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
      if (timer) clearTimeout(timer);
    };
  }, [location.pathname]); // يعيد التشغيل فقط عند تغيير المسار

  return (
    <>
      {/* لا تظهر المودال في صفحات الـ Auth */}
      {![
        "/login",
        "/forgot-password",
        "/verify-code",
        "/new-password",
      ].includes(location.pathname) && (
        <SessionExpiredModal isOpen={isSessionExpired} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/leaves/Leaves" element={<LeavesPage />} />
          <Route
            path="/leaves/manager-leave-requests"
            element={<ManagerLeaveRequests />}
          />
          <Route
            path="/overtime/my-overtime-requests"
            element={<OvertimePage />}
          />
          <Route
            path="/advance/my-advance-requests"
            element={<AdvancePage />}
          />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route
            path="/workspace/:workspaceId/dashboard"
            element={<WorkspaceDashboard />}
          />
        </Route>

        <Route path="/dashboard" element={<GlobalDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
