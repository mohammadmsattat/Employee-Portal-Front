import { AttendanceFingerprint } from "@/interfaces/attendance";
import { DailyFingerprintGroup } from "@/rtk/Fingerprint/fingerprintApi";

export interface AttendanceDayGroup {
  date: string;
  logs: AttendanceFingerprint[];
}

/* =========================================================
   Normalize Daily Fingerprints
========================================================= */

export const normalizeDailyFingerprints = (
  items: DailyFingerprintGroup[],
): AttendanceDayGroup[] => {
  const grouped = new Map<string, AttendanceFingerprint[]>();

  items.forEach((item: any) => {
    const nestedLogs =
      item.logs || item.records || item.fingerprints || item.attendance;

    const itemDate = item.date || item.day || "";

    /**
     * Group containing nested records.
     */
    if (Array.isArray(nestedLogs) && nestedLogs.length > 0) {
      const normalizedDate = itemDate || nestedLogs[0]?.date || "";

      if (!normalizedDate) {
        return;
      }

      const existing = grouped.get(normalizedDate) || [];

      grouped.set(normalizedDate, [...existing, ...nestedLogs]);

      return;
    }

    /**
     * Single fingerprint record.
     */
    if (item.Time && item.type && item.date) {
      const dateKey = item.date;

      const existing = grouped.get(dateKey) || [];

      grouped.set(dateKey, [...existing, item as AttendanceFingerprint]);
    }
  });

  return Array.from(grouped.entries())
    .map(([date, logs]) => ({
      date,

      logs: [...logs].sort((a, b) =>
        (a.Time || "").localeCompare(b.Time || ""),
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

/* =========================================================
   Duration
========================================================= */

export const getDuration = (
  checkInLog: AttendanceFingerprint | undefined,

  checkOutLog: AttendanceFingerprint | undefined,
): string => {
  if (!checkInLog || !checkOutLog) {
    return "—";
  }

  const start = timeToMinutes(checkInLog.Time);

  const end = timeToMinutes(checkOutLog.Time);

  const diff = end - start;

  if (diff <= 0) {
    return "—";
  }

  const hours = Math.floor(diff / 60);

  const minutes = diff % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

/* =========================================================
   Time
========================================================= */

const timeToMinutes = (time?: string): number => {
  if (!time) {
    return 0;
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
};

/* =========================================================
   Format Date
========================================================= */

export const formatDate = (date: string, locale: string): string => {
  if (!date) {
    return "";
  }

  /**
   * YYYY-MM-DD must be parsed as a
   * local calendar date, not UTC.
   */
  const [year, month, day] = date.split("-").map(Number);

  const localDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(localDate);
};

/* =========================================================
   Today
========================================================= */

export const getTodayDate = (timezone = "Asia/Damascus"): string => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(now.getDate()).padStart(2, "0")}`;
  }
};

/* =========================================================
   Day Complete
========================================================= */

export const isDayComplete = (logs: AttendanceFingerprint[]): boolean => {
  const hasIn = logs.some((log) => log.type === "Check-in");

  const hasOut = logs.some((log) => log.type === "Check-out");

  return hasIn && hasOut;
};

/* =========================================================
   Has Check-in
========================================================= */

export const hasCheckIn = (logs: AttendanceFingerprint[]): boolean => {
  return logs.some((log) => log.type === "Check-in");
};

/* =========================================================
   Day Status
========================================================= */

export const getDayStatus = (
  logs: AttendanceFingerprint[],
): "complete" | "partial" | "absent" => {
  const hasIn = logs.some((log) => log.type === "Check-in");

  const hasOut = logs.some((log) => log.type === "Check-out");

  if (hasIn && hasOut) {
    return "complete";
  }

  if (hasIn) {
    return "partial";
  }

  return "absent";
};
