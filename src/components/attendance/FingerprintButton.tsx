import { TFunction } from "i18next";
import { Fingerprint } from "lucide-react";

interface Props {
  canAction: boolean;
  locationLoading: boolean;
  isWithinDistance: boolean;
  status: "success" | "error" | null;
  mode: "Check-in" | "Check-out";
  setMode: (mode: "Check-in" | "Check-out") => void;
  onClick: () => void;
  t: TFunction;
}

const FingerprintButton = ({
  canAction,
  locationLoading,
  isWithinDistance,
  status,
  mode,
  setMode,
  onClick,
  t,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Switch */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition ${
            mode === "Check-in"
              ? "bg-white shadow text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setMode("Check-in")}
        >
          {t("homePage.checkIn")}
        </button>

        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition ${
            mode === "Check-out"
              ? "bg-white shadow text-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setMode("Check-out")}
        >
          {t("homePage.checkOut")}
        </button>
      </div>

      {/* Fingerprint Button */}
      <button
        onClick={onClick}
        disabled={!canAction || locationLoading || !isWithinDistance}
        className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-full flex items-center justify-center
          transition-all duration-300
          ${
            status === "success"
              ? "bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.35)]"
              : status === "error"
                ? "bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.35)] animate-[shake_.35s]"
                : canAction && isWithinDistance
                  ? "bg-green-100 shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                  : "bg-red-100 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          }
          ${
            !canAction || locationLoading || !isWithinDistance
              ? "opacity-60 cursor-not-allowed"
              : "hover:scale-105 active:scale-95"
          }
        `}
      >
        <Fingerprint
          size={125}
          strokeWidth={1.6}
          className="text-gray-500 drop-shadow-sm"
        />
      </button>
    </div>
  );
};

export default FingerprintButton;
