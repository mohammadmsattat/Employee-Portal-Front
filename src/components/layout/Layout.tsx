import { useState, ReactNode, isValidElement, cloneElement } from "react";
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
    todayRecords,
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
    <div className="min-h-screen bg-[#f4ffb] text-slate-950">
      <AppHeader />

      <main className="   relative min-h-screen  w-full px-4  pb-28  pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-8  xl:px-10 ">
        {" "}
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-[linear-gradient(180deg,rgba(37,99,235,0.12),rgba(244,247,251,0))]" />
        <div className="mx-auto max-w-7xl">
          {isValidElement(children)
            ? cloneElement(children, {
                openAttendanceModal: () => setAttendanceOpen(true),
              })
            : children}
        </div>
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
        todayRecords={todayRecords}
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

      <button
        hidden
        data-attendance-trigger
        onClick={() => setAttendanceOpen(true)}
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
