import { FC } from "react";
import { Clock, MapPin, X, Fingerprint } from "lucide-react";
import { TFunction } from "i18next";

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
  setMode,
  status = null,
  t,
}) => {
  if (!isOpen) return null;

  const disabled = !canAction || locationLoading || !isWithinDistance;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-slate-900/35 backdrop-blur-[2px] md:hidden"
        onClick={onClose}
      />

      <div className="fixed inset-x-4 inset-y-4 bottom-24 z-[80] md:hidden">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="flex justify-center pt-3">
            <div className="h-1.5 w-14 rounded-full bg-slate-300" />
          </div>

          <div className="p-5">
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

            {/* Switch */}
            <div className="mb-5 rounded-2xl bg-slate-100 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setMode("Check-in")}
                  className={`h-11 rounded-2xl text-sm font-semibold transition ${
                    mode === "Check-in"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {t("homePage.checkIn")}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("Check-out")}
                  className={`h-11 rounded-2xl text-sm font-semibold transition ${
                    mode === "Check-out"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {t("homePage.checkOut")}
                </button>
              </div>
            </div>

            {/* Main action block */}
            <div className="rounded-[28px] bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 p-5 ring-1 ring-blue-100">
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
                      ? "bg-slate-100 shadow-[0_0_20px_rgba(148,163,184,0.12)]"
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
                    className="text-blue-700/80"
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
