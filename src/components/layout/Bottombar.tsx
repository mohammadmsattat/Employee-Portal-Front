import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Clock, FileText, CheckCircle2, Plus, X } from "lucide-react";
import { CalendarDays, Clock as ClockIcon, HandCoins } from "lucide-react";
import { useTranslation } from "react-i18next";

const Bottombar = ({ openModal }) => {
  const { t, i18n } = useTranslation();
  const [fabOpen, setFabOpen] = useState(false);

  const buttons = [
    {
      icon: CalendarDays,
      label: t("buttons.requestLeave"),
      color: "bg-primary/10 text-primary",
      modal: "leave",
    },
    {
      icon: HandCoins,
      label: t("buttons.requestAdvance"),
      color: "bg-green-100 text-green-600",
      modal: "advance",
    },
    {
      icon: ClockIcon,
      label: t("buttons.requestOvertime"),
      color: "bg-orange-100 text-orange-600",
      modal: "overtime",
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div className="md:hidden inset-0 z-50">
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            fabOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setFabOpen(false)}
        />
      </div>

      {/* FAB Buttons */}
      <div className="md:hidden fixed inset-x-0 bottom-[6em] z-50 flex flex-col items-center gap-2">
        {fabOpen &&
          buttons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                onClick={() => {
                  setFabOpen(false);
                  setTimeout(() => {
                    openModal(btn.modal);
                  }, 100);
                }}
                className="w-56 flex items-center gap-2 bg-white shadow-lg rounded-full py-2 px-4"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${btn.color}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <span className="text-sm font-medium whitespace-nowrap">
                  {btn.label}
                </span>
              </button>
            );
          })}
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t">
        <div className="flex items-center justify-around h-16 relative">
          <Link to="/" className="flex flex-col items-center text-xs">
            <Home size={20} />
            <span>{t("navigation.home")}</span>
          </Link>

          <Link to="/attendance" className="flex flex-col items-center text-xs">
            <Clock size={20} />
            <span>{t("navigation.attendance")}</span>
          </Link>

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="absolute -top-6 bg-primary text-white p-4 rounded-full shadow-lg"
          >
            {fabOpen ? <X /> : <Plus />}
          </button>

          <Link
            to="/my-requests"
            className="flex flex-col items-center text-xs"
          >
            <FileText size={20} />
            <span>{t("navigation.myRequests")}</span>
          </Link>

          <Link to="/approvals" className="flex flex-col items-center text-xs">
            <CheckCircle2 size={20} />
            <span>{t("navigation.approvals")}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Bottombar;
