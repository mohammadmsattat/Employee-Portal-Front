import { useState, ReactNode } from "react";
import AppHeader from "./header/AppHeader";
import Bottombar from "./Bottombar";
import AddAdvanceRequestModal from "@/pages/Advance/AddAdvanceRequestModal";
import AddOvertimeRequestModal from "@/pages/Overtime/RequestOvertimeModal";
import AddLeaveRequestModal from "@/pages/Leaves/AddLeavesRequestModal";
import AttendanceActionModal from "@/components/attendance/AttendanceActionModal";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const openModal = (type: "leave" | "advance" | "overtime") => {
    setLeaveOpen(false);
    setAdvanceOpen(false);
    setOvertimeOpen(false);

    if (type === "leave") setLeaveOpen(true);
    if (type === "advance") setAdvanceOpen(true);
    if (type === "overtime") setOvertimeOpen(true);
  };

  const {
    lastCheckIn,
    lastCheckOut,
    workedTimeText,
    locationLoading,
    currentLocation,
    isWithinDistance,
    canAction,
    handleFingerprint,
    mode,
    setMode,
    status,
  } = useAttendance();

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      <main className="container mx-auto bg-white px-4 py-8 pb-28">
        {children}
      </main>

      <Bottombar
        openModal={openModal}
        onAttendanceAction={() => setAttendanceOpen(true)}
        attendanceLabel={
          mode === "Check-in" ? t("homePage.checkIn") : t("homePage.checkOut")
        }
      />

      <AttendanceActionModal
        isOpen={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        lastCheckIn={lastCheckIn}
        lastCheckOut={lastCheckOut}
        workedTimeText={workedTimeText}
        locationLoading={locationLoading}
        currentLocation={currentLocation}
        isWithinDistance={isWithinDistance}
        canAction={canAction}
        handleFingerprint={handleFingerprint}
        mode={mode}
        setMode={setMode}
        status={status}
        t={t}
      />

      {leaveOpen && (
        <AddLeaveRequestModal
          isOpen={leaveOpen}
          onClose={() => setLeaveOpen(false)}
        />
      )}

      {advanceOpen && (
        <AddAdvanceRequestModal
          isOpen={advanceOpen}
          onClose={() => setAdvanceOpen(false)}
        />
      )}

      {overtimeOpen && (
        <AddOvertimeRequestModal
          isOpen={overtimeOpen}
          onClose={() => setOvertimeOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
