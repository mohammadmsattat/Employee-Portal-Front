import { FC } from "react";
import FingerprintButton from "@/components/attendance/FingerprintButton";
import { Clock } from "lucide-react";
import { TFunction } from "i18next";

type AttendanceCardProps = {
  lastCheckIn: { Time: string } | null;
  lastCheckOut: { Time: string } | null;
  workedTimeText: string;
  locationLoading: boolean;
  currentLocation: any;
  isWithinDistance: boolean;
  canAction: boolean;
  handleFingerprint: () => Promise<void>;
  mode: "Check-in" | "Check-out";
  setMode: (mode: "Check-in" | "Check-out") => void;
  t: TFunction;
};

const AttendanceCard: FC<AttendanceCardProps> = ({
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
  t,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center gap-6">
      <h2 className="text-lg font-semibold">{t("homePage.todayAttendance")}</h2>
      <p className="text-sm text-muted-foreground">
        {new Date().toDateString()}
      </p>

      <FingerprintButton
        canAction={canAction}
        locationLoading={locationLoading}
        isWithinDistance={isWithinDistance}
        status={null}
        onClick={handleFingerprint}
        setMode={setMode}
        mode={mode}
        t={t}
      />

      <div className="text-center text-sm">
        {!locationLoading && !currentLocation && (
          <p className="text-red-500">{t("homePage.locationRequired")}</p>
        )}
        {!locationLoading && currentLocation && !isWithinDistance && (
          <p className="text-red-500">{t("homePage.outsideLocation")}</p>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">{mode}</p>
        <p className="text-xl font-bold">
          {mode === "Check-in"
            ? lastCheckIn?.Time || "--"
            : lastCheckOut?.Time || "--"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="h-5 w-5 text-primary" />
        {workedTimeText}
      </div>
    </div>
  );
};

export default AttendanceCard;
