import { FC } from "react";
import {
  Clock,
  Fingerprint,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import { TFunction } from "i18next";
import { AttendanceFingerprint } from "@/interfaces/attendance";

type AttendanceActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lastCheckIn: { Time: string } | null;
  lastCheckOut: { Time: string } | null;
  workedTimeText: string;
  locationLoading: boolean;
  currentLocation: unknown;
  isWithinDistance: boolean;
  canAction: boolean;
  handleFingerprint: () => Promise<void>;
  mode: "Check-in" | "Check-out";
  setMode: (mode: "Check-in" | "Check-out") => void;
  todayRecords?: AttendanceFingerprint[];
  status?: "success" | "error" | null;
  t: TFunction;
};

const AttendanceActionModal: FC<AttendanceActionModalProps> = ({
  isOpen,
  onClose,
  lastCheckIn,
  lastCheckOut,
  workedTimeText,
  locationLoading,
  currentLocation,
  isWithinDistance,
  canAction,
  handleFingerprint,
  mode,
  todayRecords = [],
  status = null,
  t,
}) => {
  if (!isOpen) return null;

  const disabled = !canAction || locationLoading || !isWithinDistance;

  const locationMissing = !locationLoading && !currentLocation;
  const locationOutside =
    !locationLoading && !!currentLocation && !isWithinDistance;

  const hasLocationIssue = locationMissing || locationOutside;

  const locationMessage = locationLoading
    ? t("overtimeModal.loading")
    : locationMissing
      ? t("homePage.locationRequired")
      : locationOutside
        ? t("homePage.outsideLocation")
        : t("homePage.locationVerified") || "Verified";
  const actionLabel =
    mode === "Check-in" ? t("homePage.checkIn") : t("homePage.checkOut");

  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => window.location.reload(),
      () => undefined,
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/50 backdrop-blur-sm md:items-center md:p-6">
      <button
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
        aria-label={t("buttons.cancel")}
      />

      <div className="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-slate-100 shadow-[0_-24px_80px_rgba(15,23,42,0.28)] md:max-w-xl md:rounded-[32px]">
        {/* Header */}
        <div className="bg-white px-5 pb-4 pt-3 md:px-6 md:pt-5">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 md:hidden" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                {t("homePage.todayAttendance")}
              </p>

              <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
                {actionLabel}
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {new Date().toDateString()}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              type="button"
              aria-label={t("buttons.cancel")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {/* Action Card */}
          <div className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                  hasLocationIssue
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {hasLocationIssue ? (
                  <MapPin className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}

                {locationMessage}
              </div>

              {locationMissing && (
                <button
                  type="button"
                  onClick={requestLocationPermission}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 transition hover:bg-red-100"
                >
                  Allow
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleFingerprint}
                disabled={disabled}
                className={`group relative flex h-36 w-36 items-center justify-center rounded-[38px] transition duration-300 sm:h-40 sm:w-40 ${
                  status === "success"
                    ? "bg-emerald-500 text-white shadow-[0_18px_45px_rgba(16,185,129,0.35)]"
                    : status === "error" || hasLocationIssue
                      ? "bg-red-500 text-white shadow-[0_18px_45px_rgba(239,68,68,0.25)]"
                      : disabled
                        ? "bg-slate-200 text-slate-400"
                        : mode === "Check-in"
                          ? "bg-emerald-600 text-white shadow-[0_18px_45px_rgba(5,150,105,0.32)] hover:bg-emerald-700"
                          : "bg-orange-500 text-white shadow-[0_18px_45px_rgba(249,115,22,0.3)] hover:bg-orange-600"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-70"
                    : "hover:-translate-y-1 active:translate-y-0"
                }`}
              >
                <Fingerprint className="h-20 w-20" strokeWidth={1.4} />

                <span className="absolute inset-4 rounded-[30px] border border-white/20" />
                <span className="absolute inset-8 rounded-[22px] border border-white/15" />
              </button>

              <p className="mt-5 text-lg font-black text-slate-950">
                {actionLabel}
              </p>

              <p className="mt-1 max-w-xs text-center text-sm font-medium text-slate-500">
                {disabled
                  ? t("homePage.locationRequired")
                  : t("buttons.tapToContinue") || "Tap to continue"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <InfoTile
              label={t("homePage.checkIn")}
              value={lastCheckIn?.Time || "--"}
            />
            <InfoTile
              label={t("homePage.checkOut")}
              value={lastCheckOut?.Time || "--"}
            />
            <InfoTile
              label={t("homePage.workedHours") || "Worked"}
              value={workedTimeText}
            />
          </div>

          {/* Today's checks */}
          <div className="mt-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-base font-black text-slate-950">
                  Today's checks
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  {todayRecords.length} records
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {todayRecords.length ? (
              <div className="grid gap-2">
                {todayRecords.map((record) => {
                  const isCheckIn = record.type === "Check-in";
                  const Icon = isCheckIn ? LogIn : LogOut;

                  return (
                    <div
                      key={record._id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            isCheckIn
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <span className="text-sm font-black text-slate-800">
                          {isCheckIn
                            ? t("homePage.checkIn")
                            : t("homePage.checkOut")}
                        </span>
                      </div>

                      <span className="text-sm font-black text-slate-950">
                        {record.Time}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-5 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  No checks recorded today.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            {t("buttons.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
    <p className="truncate text-[10px] font-black uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
  </div>
);

export default AttendanceActionModal;
