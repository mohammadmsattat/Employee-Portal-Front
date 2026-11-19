import { useState, useEffect, useMemo, useCallback } from "react";

import {
  DailyFingerprintGroup,
  useGetMyDailyFingerprintsQuery,
  useCreateLogedFingerprintMutation,
} from "@/rtk/Fingerprint/fingerprintApi";

import {
  AttendanceFingerprint,
  FingerprintType,
} from "@/interfaces/attendance";

import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

import {
  attendanceCalculator,
  type AttendanceSummary,
  type GroupSettings,
  type Period,
  type FingerprintRecord,
  type DailyAttendance,
} from "@/lib/attendanceCalculator";

type LatLng = {
  latitude: number;
  longitude: number;
};

interface UseAttendanceOptions {
  startDate?: string;
  endDate?: string;
}

/* =========================================================
   Normalize Records
========================================================= */

const normalizeFingerprintRecords = (
  records: AttendanceFingerprint[],
): FingerprintRecord[] => {
  return records.map((record) => ({
    _id: record._id || "",
    userID: record.userID,
    companyId: record.companyId,
    date: record.date,
    Time: record.Time,
    type: record.type as "Check-in" | "Check-out",
    latitude: record.latitude,
    longitude: record.longitude,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    fullName: record.fullName,
    email: record.email,
  }));
};

/* =========================================================
   Get Local Group
========================================================= */

const getStoredGroup = (): any | null => {
  try {
    const storedGroup = localStorage.getItem("group");
    
    if (!storedGroup) {
      return null;
    }
    
    return JSON.parse(storedGroup);
  } catch {
    return null;
  }
};
console.log(getStoredGroup());

/* =========================================================
   Hook
========================================================= */

export const useAttendance = (options: UseAttendanceOptions = {}) => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  /* =======================================================
     DATE RANGE
  ======================================================= */

  const startDate = options.startDate;
  const endDate = options.endDate;

  /* =======================================================
     PERIOD
  ======================================================= */

  const period: Period = useMemo(
    () => ({
      startDate,
      endDate,
    }),
    [startDate, endDate],
  );

  /* =======================================================
     ACTION STATE
  ======================================================= */

  const [actionLocked, setActionLocked] = useState(false);

  const [status, setStatus] = useState<"success" | "error" | null>(null);

  /* =======================================================
     GROUP SETTINGS
  ======================================================= */

  const groupSettings: GroupSettings | null = useMemo(() => {
    const group = getStoredGroup();

    if (!group) {
      return null;
    }

    return {
      _id: group?._id,

      groupName: group?.groupName,

      latinName: group?.latinName,

      companyId: group?.companyId,

      attendanceType: group?.attendanceType || "fixed",

      offDays: Array.isArray(group?.offDays) ? group.offDays : [],

      calendarRules: Array.isArray(group?.calendarRules)
        ? group.calendarRules
        : [],

      standardMonthlyHours: group?.standardMonthlyHours,

      severeLateAfter: group?.severeLateAfter,

      fixedAttendance: group?.fixedAttendance,

      flexibleAttendance: group?.flexibleAttendance,

      remoteAttendance: group?.remoteAttendance,

      locationId: group?.locationId
        ? {
            _id: group.locationId._id,

            name: group.locationId.name,

            timezone: group.locationId.timezone,

            latitude: Number(group.locationId.latitude),

            longitude: Number(group.locationId.longitude),

            radius: group.locationId.radius,
          }
        : null,
    };
  }, []);

  /* =======================================================
     ATTENDANCE TYPE
  ======================================================= */

  const isRemoteAttendance = groupSettings?.attendanceType === "remote";

  /* =======================================================
     WORK LOCATION
  ======================================================= */

  const workLocation: LatLng | null = useMemo(() => {
    const group = getStoredGroup();
console.log(group);

    if (!group) {
      return null;
    }

    const location = group?.locationId;

    if (location?.latitude == null || location?.longitude == null) {
      return null;
    }

    return {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    };
  }, []);

  /* =======================================================
     CURRENT GEOLOCATION
  ======================================================= */

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    // Remote employees do not need GPS.
    if (isRemoteAttendance) {
      setCurrentLocation(null);
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    let active = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) return;

        setCurrentLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });

        setLocationLoading(false);
      },
      (error) => {
        if (!active) return;

        console.error("Error getting location:", error);

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    return () => {
      active = false;
    };
  }, [isRemoteAttendance]);

  /* =======================================================
     FETCH ATTENDANCE
  ======================================================= */

  const queryArgs = useMemo(
    () => ({
      startDate,
      endDate,
    }),
    [startDate, endDate],
  );

  const { data, isLoading, isFetching } =
    useGetMyDailyFingerprintsQuery(queryArgs);

  const [createFingerprint, { isLoading: isSubmitting }] =
    useCreateLogedFingerprintMutation();

  /* =======================================================
     DAILY RECORDS
  ======================================================= */

  const dailyRecords: DailyFingerprintGroup[] = useMemo(
    () => data?.data || [],
    [data?.data],
  );

  /* =======================================================
     FLAT RECORDS
  ======================================================= */

  const records: AttendanceFingerprint[] = useMemo(() => {
    return dailyRecords.flatMap((day) => day.records || []);
  }, [dailyRecords]);

  /* =======================================================
     NORMALIZED RECORDS
  ======================================================= */

  const fingerprintRecords: FingerprintRecord[] = useMemo(() => {
    return normalizeFingerprintRecords(records);
  }, [records]);

  /* =======================================================
     ATTENDANCE SUMMARY
  ======================================================= */

  const summary: AttendanceSummary | null = useMemo(() => {
    if (!groupSettings) {
      return null;
    }

    return attendanceCalculator.calculate(
      period,
      groupSettings,
      fingerprintRecords,
    );
  }, [period, groupSettings, fingerprintRecords]);

  /* =======================================================
     TODAY
  ======================================================= */

  const todayDate = useMemo(() => {
    const timezone = groupSettings?.locationId?.timezone || "Asia/Damascus";

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
  }, [groupSettings]);

  /* =======================================================
     TODAY RECORDS
  ======================================================= */

  const todayRecords: AttendanceFingerprint[] = useMemo(() => {
    const today =
      dailyRecords.find((day) => day?.date === todayDate)?.records || [];

    return [...today].sort((a, b) =>
      (a?.Time || "").localeCompare(b?.Time || ""),
    );
  }, [dailyRecords, todayDate]);

  /* =======================================================
     LOCAL LAST ACTION
  ======================================================= */

  const [localLastAction, setLocalLastAction] = useState<{
    date: string;
    type: FingerprintType;
  } | null>(null);

  /* =======================================================
     SERVER LAST RECORD
  ======================================================= */

  const lastServerRecord = useMemo(() => {
    return todayRecords[todayRecords.length - 1];
  }, [todayRecords]);

  /* =======================================================
     EFFECTIVE LAST TYPE
  ======================================================= */

  const localLastType = useMemo(() => {
    if (localLastAction?.date !== todayDate) {
      return null;
    }

    return localLastAction.type;
  }, [localLastAction, todayDate]);

  const effectiveLastType = useMemo(() => {
    return localLastType ?? lastServerRecord?.type ?? null;
  }, [localLastType, lastServerRecord]);

  /* =======================================================
     NEXT ACTION
  ======================================================= */

  const nextAction: FingerprintType = useMemo(() => {
    return effectiveLastType === "Check-in" ? "Check-out" : "Check-in";
  }, [effectiveLastType]);

  /* =======================================================
     LAST CHECK IN
  ======================================================= */

  const lastCheckIn = useMemo(() => {
    return [...todayRecords]
      .reverse()
      .find((record) => record.type === "Check-in");
  }, [todayRecords]);

  /* =======================================================
     LAST CHECK OUT
  ======================================================= */

  const lastCheckOut = useMemo(() => {
    return [...todayRecords]
      .reverse()
      .find((record) => record.type === "Check-out");
  }, [todayRecords]);

  /* =======================================================
     WORKED TIME
  ======================================================= */

  const workedTimeText = useMemo(() => {
    if (!groupSettings) {
      return "--";
    }

    const todayDetails = summary?.dailyDetails.find(
      (day) => day.date === todayDate,
    );

    if (!todayDetails) {
      return "--";
    }

    const totalMinutes = Math.round(todayDetails.workedHours * 60);

    if (totalMinutes <= 0) {
      return "--";
    }

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }, [summary, todayDate, groupSettings]);

  /* =======================================================
     DISTANCE
  ======================================================= */

  const distanceMeters = useMemo(() => {
    if (!workLocation || !currentLocation) {
      return null;
    }

    const R = 6371000;

    const lat1 = (workLocation.latitude * Math.PI) / 180;

    const lat2 = (currentLocation.latitude * Math.PI) / 180;

    const deltaLat =
      ((currentLocation.latitude - workLocation.latitude) * Math.PI) / 180;

    const deltaLon =
      ((currentLocation.longitude - workLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }, [workLocation, currentLocation]);

  /* =======================================================
     WITHIN WORK DISTANCE
  ======================================================= */

  const allowedRadius = groupSettings?.locationId?.radius ?? 150;

  const isWithinDistance = useMemo(() => {
    if (distanceMeters == null) {
      return false;
    }

    return distanceMeters <= allowedRadius;
  }, [distanceMeters, allowedRadius]);

  /* =======================================================
     READINESS
  ======================================================= */

  const isReady = isRemoteAttendance
    ? !isLoading
    : !isLoading && !locationLoading && !!currentLocation && !!workLocation;

  /* =======================================================
     ACTION PERMISSIONS
  ======================================================= */

  const canAction =
    isReady &&
    !actionLocked &&
    !isSubmitting &&
    (isRemoteAttendance || isWithinDistance);

  const canCheckIn = canAction && nextAction === "Check-in";

  const canCheckOut = canAction && nextAction === "Check-out";

  /* =======================================================
     ACTION HANDLER
  ======================================================= */

  const handleAction = useCallback(
    async (type: FingerprintType) => {
      if (actionLocked || !isReady) {
        return;
      }

      // Location validation only for Fixed and Flexible employees.
      if (!isRemoteAttendance) {
        if (!workLocation || !currentLocation) {
          toast({
            title: "Work location unavailable",
            description: "Please contact HR to configure your work location.",
            variant: "destructive",
          });

          return;
        }

        const distance = distanceMeters ?? Infinity;

        if (distance > allowedRadius) {
          toast({
            title: "Too far from work location",
            description: `Distance: ${distance} meters`,
            variant: "destructive",
          });

          return;
        }
      }

      try {
        setActionLocked(true);

        setLocalLastAction({
          date: todayDate,
          type,
        });

        // Remote: send the fingerprint without GPS coordinates.
        // Fixed / Flexible: send GPS coordinates as before.
        const fingerprintPayload = isRemoteAttendance
          ? { type }
          : {
              type,
              latitude: currentLocation!.latitude,
              longitude: currentLocation!.longitude,
            };

        await createFingerprint(
          fingerprintPayload as Parameters<typeof createFingerprint>[0],
        ).unwrap();

        toast({
          title: `Successfully ${type}`,
        });
      } catch (error: any) {
        setLocalLastAction(null);

        toast({
          title: error?.data?.message || "Action failed",
          variant: "destructive",
        });

        throw error;
      } finally {
        setActionLocked(false);
      }
    },
    [
      actionLocked,
      isReady,
      isRemoteAttendance,
      workLocation,
      currentLocation,
      distanceMeters,
      allowedRadius,
      todayDate,
      createFingerprint,
      toast,
    ],
  );

  /* =======================================================
     FINGERPRINT ACTION
  ======================================================= */

  const handleFingerprint = useCallback(async () => {
    if (!canAction) {
      return;
    }

    try {
      await handleAction(nextAction);

      setStatus("success");

      setTimeout(() => {
        setStatus(null);
      }, 2000);
    } catch {
      setStatus("error");

      setTimeout(() => {
        setStatus(null);
      }, 2000);
    }
  }, [canAction, handleAction, nextAction]);

  /* =======================================================
     GET DAY DETAILS
  ======================================================= */

  const getDayDetails = useCallback(
    (date: string): DailyAttendance | null => {
      if (!groupSettings) {
        return null;
      }

      const dayRecords = fingerprintRecords.filter(
        (record) => record.date === date,
      );

      return attendanceCalculator.getDayDetails(
        date,
        groupSettings,
        dayRecords,
      );
    },
    [groupSettings, fingerprintRecords],
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    records,
    dailyRecords,
    todayRecords,
    lastCheckIn,
    lastCheckOut,
    workedTimeText,
    canCheckIn,
    canCheckOut,
    canAction,
    handleAction,
    handleFingerprint,
    isLoading,
    isFetching,
    locationLoading,
    isSubmitting,
    currentLocation,
    workLocation,
    distanceMeters,
    isWithinDistance,
    mode: nextAction,
    nextAction,
    setMode: () => {},
    status,
    t,
    i18n,
    summary,
    period,
    groupSettings,
    isRemoteAttendance,
    getDayDetails,
  };
};
