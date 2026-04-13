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
import MyOvertimeRequests from "./pages/Overtime/MyOvertimeRequests";
import MyAdvanceRequestsPage from "./pages/Advance/MyAdvanceRequestsPage";
import ManagerOvertimeRequests from "./pages/Overtime/ManagerOvertimeRequests";
import ManagerAdvanceRequests from "./pages/Advance/ManagerAdvanceRequests";
import PrivateRoute from "./providers/PrivateRoute";
import LeavesPage from "./pages/Leaves/LeavesPage";

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
                element={<MyOvertimeRequests />}
              />
              <Route
                path="/overtime/manager-overtime-requests"
                element={<ManagerOvertimeRequests />}
              />
              <Route
                path="/advance/my-advance-requests"
                element={<MyAdvanceRequestsPage />}
              />
              <Route
                path="/advance/manager-advance-requests"
                element={<ManagerAdvanceRequests />}
              />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
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
