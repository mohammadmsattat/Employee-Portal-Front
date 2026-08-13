import { Fingerprint, ChevronRight } from "lucide-react";

interface AttendanceCardProps {
  mode: string;
  canAction: boolean;
  openAttendanceModal: () => void;
}

export const AttendanceCard = ({
  mode,
  canAction,
  openAttendanceModal,
}: AttendanceCardProps) => {
  return (
    <div className="hidden md:block">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-100/80 sm:text-sm">
                Attendance Status
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-lg font-semibold text-white sm:text-xl">
                  {mode === "Check-out" ? "Checked In" : "Checked Out"}
                </p>
              </div>
            </div>
            <div
              className={`rounded-full p-2 ${
                mode === "Check-in"
                  ? "bg-emerald-500/20"
                  : "bg-amber-500/20"
              }`}
            >
              <Fingerprint
                className={`h-5 w-5 ${
                  mode === "Check-in"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6">
          {/* Desktop Action Button */}
          <button
            type="button"
            onClick={openAttendanceModal}
            disabled={!canAction}
            className="group hidden w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:shadow-none md:block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {canAction ? "Check In / Out" : "Attendance Locked"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {canAction
                      ? "Tap to record your attendance"
                      : "Outside working hours"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-500" />
            </div>
          </button>

          {/* Mobile Info */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Attendance available from Bottom Bar
              </p>
              <p className="mt-0.5 text-xs leading-4 text-slate-500">
                Use the fingerprint button below to check in or check out.
              </p>
            </div>
          </div>

          {/* Location Status */}
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 sm:mt-4">
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                canAction ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span className="text-xs text-slate-600">
              {canAction
                ? "Location verified. Attendance is ready"
                : "You are outside the allowed area. Attendance is unavailable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};