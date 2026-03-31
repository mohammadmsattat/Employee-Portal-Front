import Layout from "@/components/layout/Layout";
import LeaveBalanceCard from "@/components/home/LeaveBalanceCard";
import PendingRequestsCard from "@/components/home/PendingRequestsCard";
import AttendanceCard from "@/components/home/AttendanceCard";
import MobileTabs from "@/components/home/MobileTabs";
import { useHome } from "@/hooks/home/useHome";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import InfoRow from "@/components/home/InfoRow";

const Home = () => {
  // Custom hooks for home page logic
  const {
    user,
    leaveBalances,
    pendingRequests,
    activeTab,
    setActiveTab,
    navigate,
    t,
  } = useHome();

  // Custom hook for attendance logic
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

  // Redirect to login if not authenticated
  if (!user) navigate("/login");

  return (
    <Layout>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Header  InfoRow */}
        <InfoRow t={t} userName={user?.fullName?.split(" ")[0]} />

        {/* Web Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <AttendanceCard
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
              t={t}
            />
          </div>

          <div className="space-y-6">
            <LeaveBalanceCard leaveBalances={leaveBalances} t={t} />
            <PendingRequestsCard pendingRequests={pendingRequests} t={t} />
          </div>
        </div>

        {/* Mobile Tabs */}
        <MobileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabsContent={{
            attendance: (
              <AttendanceCard
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
                t={t}
              />
            ),
            Balance: <LeaveBalanceCard leaveBalances={leaveBalances} t={t} />,
            leaves: (
              <PendingRequestsCard pendingRequests={pendingRequests} t={t} />
            ),
          }}
          t={t}
        />
      </div>
    </Layout>
  );
};

export default Home;
