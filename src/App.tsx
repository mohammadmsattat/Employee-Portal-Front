import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

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
import SelectCompany from "./pages/Auth/SelectCompany";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes (accessible without login) */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/select-company" element={<SelectCompany />} />

            {/* Protected routes (require login) */}
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
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
