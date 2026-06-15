import { ReactNode, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Fingerprint,
  LogIn,
  LogOut,
  Timer,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingFull from "@/components/ui/LoadingSkeleton";
import { useGetMyDailyFingerprintsQuery } from "@/rtk/Fingerprint/fingerprintApi";
import { AttendanceFingerprint } from "@/interfaces/attendance";

type DailyFingerprintItem = AttendanceFingerprint & {
  logs?: AttendanceFingerprint[];
  records?: AttendanceFingerprint[];
  fingerprints?: AttendanceFingerprint[];
  attendance?: AttendanceFingerprint[];
  day?: string;
  total?: number;
};

type AttendanceDayGroup = {
  date: string;
  logs: AttendanceFingerprint[];
};

const Attendance = () => {
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const [page] = useState(1);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const { data, isLoading ,error} = useGetMyDailyFingerprintsQuery(page);
console.log(error);

  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dayGroups = useMemo(
    () => normalizeDailyFingerprints(data?.data || []),
    [data?.data],
  );

  const todayDate = new Date().toLocaleDateString("en-CA");
  const todayGroup = dayGroups.find((group) => group.date === todayDate);
  const checkIns = dayGroups.reduce(
    (sum, group) =>
      sum + group.logs.filter((record) => record.type === "Check-in").length,
    0,
  );
  const checkOuts = dayGroups.reduce(
    (sum, group) =>
      sum + group.logs.filter((record) => record.type === "Check-out").length,
    0,
  );

  if (!token)
    return (
      <Layout>
        <LoadingFull titleLines={1} cardLines={2} className="min-h-[60vh]" />
      </Layout>
    );

  if (isLoading)
    return (
      <Layout>
        <LoadingFull titleLines={2} cardLines={4} className="min-h-[60vh]" />
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-start">
            <h1 className="text-2xl font-bold">{t("attendancePage.title")}</h1>
            <p className="text-muted-foreground">
              {t("attendancePage.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <AttendanceStat
            label="Days"
            value={dayGroups.length}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <AttendanceStat
            label="Today"
            value={todayGroup?.logs.length || 0}
            icon={<Fingerprint className="h-4 w-4" />}
          />
          <AttendanceStat
            label="Check-ins"
            value={checkIns}
            icon={<LogIn className="h-4 w-4" />}
          />
          <AttendanceStat
            label="Check-outs"
            value={checkOuts}
            icon={<LogOut className="h-4 w-4" />}
          />
        </div>

        <PortalCard>
          <div className="mb-4 flex items-center gap-3 px-5 pt-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("attendancePage.history")}
              </h3>
              <p className="text-sm text-slate-500">
                Select a day to view its check-in and check-out logs
              </p>
            </div>
          </div>

          {dayGroups.length ? (
            <>
              <div className="hidden overflow-x-auto px-2 pb-2 md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 bg-slate-50/80">
                      <TableHead className="text-start text-xs font-semibold uppercase text-slate-500">
                        {t("attendancePage.date")}
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                        Logs
                      </TableHead>
                      <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                        First / Last
                      </TableHead>
                      <TableHead className="text-end text-xs font-semibold uppercase text-slate-500">
                        Details
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {dayGroups.map((group) => {
                      const isExpanded = expandedDay === group.date;
                      const firstLog = group.logs[0];
                      const lastLog = group.logs[group.logs.length - 1];

                      return (
                        <>
                          <TableRow
                            key={group.date}
                            onClick={() =>
                              setExpandedDay(isExpanded ? null : group.date)
                            }
                            className="cursor-pointer border-slate-100 transition hover:bg-slate-50/70"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                  <CalendarDays className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {dateFormatter.format(new Date(group.date))}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {group.date}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                {group.logs.length} logs
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                                <Timer className="h-4 w-4 text-slate-400" />
                                {firstLog?.Time || "-"} / {lastLog?.Time || "-"}
                              </div>
                            </TableCell>
                            <TableCell className="text-end">
                              <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100">
                                <ChevronDown
                                  className={`h-5 w-5 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-slate-50/50">
                              <TableCell colSpan={4}>
                                <div className="grid gap-2 p-3">
                                  {group.logs.map((record) => (
                                    <AttendanceLogRow
                                      key={record._id}
                                      record={record}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 px-4 pb-4 md:hidden">
                {dayGroups.map((group) => {
                  const isExpanded = expandedDay === group.date;
                  const firstLog = group.logs[0];
                  const lastLog = group.logs[group.logs.length - 1];

                  return (
                    <article
                      key={group.date}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDay(isExpanded ? null : group.date)
                        }
                        className="flex w-full items-center justify-between gap-3 bg-slate-50/80 px-4 py-3 text-start"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                            <CalendarDays className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {dateFormatter.format(new Date(group.date))}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {group.logs.length} logs • {firstLog?.Time || "-"}{" "}
                              / {lastLog?.Time || "-"}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="space-y-2 px-4 py-4">
                          {group.logs.map((record) => (
                            <AttendanceLogRow
                              key={record._id}
                              record={record}
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No attendance records
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your check-in and check-out records will appear here.
              </p>
            </div>
          )}
        </PortalCard>
      </div>
    </Layout>
  );
};

export default Attendance;

const normalizeDailyFingerprints = (
  items: DailyFingerprintItem[],
): AttendanceDayGroup[] => {
  const grouped = new Map<string, AttendanceFingerprint[]>();

  items.forEach((item) => {
    const nestedLogs =
      item.logs || item.records || item.fingerprints || item.attendance;
    const date = item.date || item.day || "";

    if (Array.isArray(nestedLogs)) {
      const normalizedDate = date || nestedLogs[0]?.date || "";
      if (!normalizedDate) return;
      grouped.set(normalizedDate, [
        ...(grouped.get(normalizedDate) || []),
        ...nestedLogs,
      ]);
      return;
    }

    if (item.Time && item.type && item.date) {
      grouped.set(item.date, [...(grouped.get(item.date) || []), item]);
    }
  });

  return Array.from(grouped.entries())
    .map(([date, logs]) => ({
      date,
      logs: [...logs].sort((a, b) => a.Time.localeCompare(b.Time)),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const AttendanceStat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
      {icon}
    </div>
    <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const AttendanceLogRow = ({
  record,
  compact,
}: {
  record: AttendanceFingerprint;
  compact?: boolean;
}) => (
  <div
    className={`flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white ${
      compact ? "p-3" : "px-4 py-3"
    }`}
  >
    <AttendanceTypeBadge type={record.type} />
    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-900">
      <Timer className="h-4 w-4 text-slate-400" />
      {record.Time}
    </div>
  </div>
);

const AttendanceTypeBadge = ({
  type,
}: {
  type: AttendanceFingerprint["type"];
}) => {
  const isCheckIn = type === "Check-in";
  const Icon = isCheckIn ? LogIn : LogOut;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        isCheckIn
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-orange-200 bg-orange-50 text-orange-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {type}
    </span>
  );
};
