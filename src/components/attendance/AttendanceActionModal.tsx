import { FC } from "react";
import { Clock, MapPin, X, Fingerprint, LogIn, LogOut } from "lucide-react";
import { TFunction } from "i18next";
import { AttendanceFingerprint } from "@/interfaces/attendance";

type AttendanceActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
  const hasLocationIssue =
    !locationLoading && (!currentLocation || !isWithinDistance);

  const requestLocationPermission = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => window.location.reload(),
      () => undefined,
      { enableHighAccuracy: true },
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-slate-900/35 backdrop-blur-[2px] md:hidden"
        onClick={onClose}
      />

      <div className="fixed inset-x-4 bottom-4 top-4 z-[80] md:hidden">
        <div className="flex max-h-full flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="shrink-0 flex justify-center pt-3">
            <div className="h-1.5 w-14 rounded-full bg-slate-300" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-8">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
                  {t("homePage.todayAttendance")}
                </div>

                <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  {mode === "Check-in"
                    ? t("homePage.checkIn")
                    : t("homePage.checkOut")}
                  <br />
                  <i
                    className="mt-1 text-sm text-slate-400"
                    style={{ fontWeight: "lighter" }}
                  >
                    Based on the last check recorded today
                  </i>
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {new Date().toDateString()}
                </p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Next action
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {mode === "Check-in"
                  ? t("homePage.checkIn")
                  : t("homePage.checkOut")}
              </p>
            </div> */}

            {/* Main action block */}
            <div
              className={`relative rounded-[28px] p-5 ring-1 ${
                hasLocationIssue
                  ? "bg-red-50 ring-red-100"
                  : "bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 ring-blue-100"
              }`}
            >
              {hasLocationIssue && (
                <button
                  type="button"
                  onClick={requestLocationPermission}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
                  aria-label="Request location permission"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              )}

              <div className="flex flex-col items-center">
                <button
                  onClick={handleFingerprint}
                  disabled={disabled}
                  className={`relative flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 sm:h-44 sm:w-44 ${
                    status === "success"
                      ? "bg-blue-100 shadow-[0_0_30px_rgba(37,99,235,0.25)]"
                      : status === "error"
                        ? "bg-red-50 shadow-[0_0_30px_rgba(239,68,68,0.20)]"
                        : disabled
                          ? hasLocationIssue
                            ? "bg-red-100 shadow-[0_0_20px_rgba(239,68,68,0.14)]"
                            : "bg-slate-100 shadow-[0_0_20px_rgba(148,163,184,0.12)]"
                          : "bg-blue-100 shadow-[0_0_30px_rgba(37,99,235,0.18)]"
                  } ${
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : "hover:scale-[1.03] active:scale-[0.98]"
                  }`}
                >
                  <div className="absolute inset-3 rounded-full border border-blue-200/60" />
                  <div className="absolute inset-6 rounded-full border border-blue-200/50" />
                  <Fingerprint
                    size={96}
                    strokeWidth={1.5}
                    className={hasLocationIssue ? "text-red-600/75" : "text-blue-700/80"}
                  />
                </button>

                <p className="mt-4 text-base font-semibold text-slate-900">
                  {mode === "Check-in"
                    ? t("homePage.checkIn")
                    : t("homePage.checkOut")}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {disabled
                    ? t("homePage.locationRequired")
                    : t("buttons.tapToContinue") || "Tap to continue"}
                </p>
              </div>
            </div>

            {/* Status info */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t("homePage.checkIn")}
                </p>
                <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-900">
                  {lastCheckIn?.Time || "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t("homePage.checkOut")}
                </p>
                <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-900">
                  {lastCheckOut?.Time || "--"}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {t("homePage.workedHours") || "Worked Time"}
                </span>
              </div>
              <p className="mt-2 text-lg font-bold tracking-[-0.02em] text-slate-900">
                {workedTimeText}
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Fingerprint className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Today's checks</span>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {todayRecords.length}
                </span>
              </div>

              {todayRecords.length ? (
                <div className="space-y-2">
                  {todayRecords.map((record) => {
                    const isCheckIn = record.type === "Check-in";
                    const Icon = isCheckIn ? LogIn : LogOut;

                    return (
                      <div
                        key={record._id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isCheckIn
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            {isCheckIn
                              ? t("homePage.checkIn")
                              : t("homePage.checkOut")}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {record.Time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  No checks recorded today.
                </p>
              )}
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {t("homePage.locationStatus") || "Location Status"}
                </span>
              </div>

              <div className="mt-2 text-sm">
                {locationLoading && (
                  <p className="text-slate-500">{t("overtimeModal.loading")}</p>
                )}

                {!locationLoading && !currentLocation && (
                  <p className="text-red-500">
                    {t("homePage.locationRequired")}
                  </p>
                )}

                {!locationLoading && currentLocation && !isWithinDistance && (
                  <p className="text-red-500">
                    {t("homePage.outsideLocation")}
                  </p>
                )}

                {!locationLoading && currentLocation && isWithinDistance && (
                  <p className="text-emerald-600">
                    {t("homePage.locationVerified") ||
                      "Inside allowed location"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <ButtonLikeClose onClose={onClose} label={t("buttons.cancel")} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ButtonLikeClose = ({
  onClose,
  label,
}: {
  onClose: () => void;
  label: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClose}
      className="h-12 w-full rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      {label}
    </button>
  );
};

export default AttendanceActionModal;
