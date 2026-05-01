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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              {t("homePage.quickActions") || "Quick actions"}
            </h2>
            <p className="text-sm text-slate-500">
              {t("homePage.startHere") || "Jump into the workflow you need"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.key}
                to={action.to}
                className={`group min-h-[118px] rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.09)] ${
                  index === 0
                    ? "border-blue-200 bg-blue-600 text-white md:col-span-1"
                    : "border-slate-200 bg-slate-50 text-slate-950 hover:bg-white"
                }`}
              >
                <div
                  className={`mb-5 flex h-10 w-10 items-center justify-center rounded-md ${
                    index === 0
                      ? "bg-white/15 text-white ring-1 ring-white/20"
                      : "bg-white text-blue-600 ring-1 ring-slate-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-sm font-bold">{action.label}</p>
                <p
                  className={`mt-1 text-xs ${
                    index === 0 ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {t("home.quickAccess") || "Quick access"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeQuickActions;
