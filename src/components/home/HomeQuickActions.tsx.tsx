import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  HandCoins,
  ListTodo,
  TimerReset,
  Wallet,
} from "lucide-react";

interface HomeQuickActionsProps {
  t: (key: string) => string;
}

const HomeQuickActions = ({ t }: HomeQuickActionsProps) => {
  const actions = [
    {
      key: "salary",
      label: t("homePage.salary") || "Salary",
      icon: Wallet,
      to: "/salary",
    },
    {
      key: "leaves",
      label: t("homePage.leaves") || "Leaves",
      icon: CalendarDays,
      to: "/leaves/Leaves",
    },
    {
      key: "advances",
      label: t("homePage.advance") || "Advance",
      icon: HandCoins,
      to: "/advance/my-advance-requests",
    },
    {
      key: "overtime",
      label: t("homePage.overtime") || "Overtime",
      icon: TimerReset,
      to: "/overtime/my-overtime-requests",
    },
    {
      key: "attendance",
      label: t("homePage.attendance") || "Attendance",
      icon: Clock3,
      to: "/attendance",
    },
    {
      key: "tasks",
      label: t("homePage.tasks") || "Tasks",
      icon: ListTodo,
      to: "/tasks",
    },
  ];

  return (
    <section className="relative">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="rounded-[28px] bg-white px-2 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="grid grid-cols-3 gap-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.key}
                  to={action.to}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-sm ring-1 ring-slate-100 transition active:scale-95">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[12px] font-semibold leading-4 tracking-[-0.01em] text-slate-500 capitalize">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.key}
              to={action.to}
              className="group rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("home.quickAccess") || "Quick access"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default HomeQuickActions;
