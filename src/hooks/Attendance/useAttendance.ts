// hooks/useAttendance.ts
import { useState, useEffect, useMemo } from "react";
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

type LatLng = {
  latitude: number;
  longitude: number;
};

/**
 * Custom hook to manage attendance logic
 * - Current location
 * - Work location validation
 * - Today's attendance records
 * - Check-in / Check-out actions
 */
export const useAttendance = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  // ===== Pagination & Action Lock =====
  const [page, setPage] = useState(1);
  const [actionLocked, setActionLocked] = useState(false);

  // ===== Attendance Status =====
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  // ===== Work Location from group =====
  const workLocation: LatLng | null = useMemo(() => {
    try {
      const storedGroup = localStorage.getItem("group");
      if (!storedGroup) return null;

      const group = JSON.parse(storedGroup);
      const loc = group?.locationId;
      if (!loc?.latitude || !loc?.longitude) return null;

      return {
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      };
    } catch {
      return null;
    }
  }, []);

  // ===== Current Geolocation =====
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true },
    );
  }, []);

  // ===== Fetch Attendance Records Grouped By Day =====
  const { data, isLoading, isFetching } = useGetMyDailyFingerprintsQuery(page);
  const [createFingerprint, { isLoading: isSubmitting }] =
    useCreateLogedFingerprintMutation();
  const dailyRecords: DailyFingerprintGroup[] = data?.data || [];
  const records: AttendanceFingerprint[] = dailyRecords.flatMap(
    (day) => day.records || [],
  );

  // ===== Today's Attendance Records =====
  const todayDate = new Date().toLocaleDateString("en-CA");

  const todayRecords = [
    ...(dailyRecords.find((day) => day?.date === todayDate)?.records || []),
  ].sort((a, b) => (a?.Time || "").localeCompare(b?.Time || ""));

  const lastServerRecord = todayRecords[todayRecords.length - 1];
  const [localLastAction, setLocalLastAction] = useState<{
    date: string;
    type: FingerprintType;
  } | null>(null);
  const localLastType =
    localLastAction?.date === todayDate ? localLastAction.type : null;
  const effectiveLastType = localLastType ?? lastServerRecord?.type ?? null;
  const nextAction: FingerprintType =
    effectiveLastType === "Check-in" ? "Check-out" : "Check-in";

  const lastCheckIn = [...todayRecords]
    .reverse()
    .find((r) => r.type === "Check-in");
  const lastCheckOut = [...todayRecords]
    .reverse()
    .find((r) => r.type === "Check-out");

  // ===== Calculate Worked Time =====
  const workedTimeText = (() => {
    if (!todayRecords.length) return "--";

    let totalMs = 0;
    let openCheckIn: Date | null = null;

    for (const record of todayRecords) {
      const recordTime = new Date(`${todayDate}T${record.Time}`);
      if (record.type === "Check-in") openCheckIn = recordTime;
      if (record.type === "Check-out" && openCheckIn) {
        const diff = recordTime.getTime() - openCheckIn.getTime();
        if (diff > 0) totalMs += diff;
        openCheckIn = null;
      }
    }

    // Account for open check-in until now
    if (openCheckIn) totalMs += new Date().getTime() - openCheckIn.getTime();
    if (totalMs <= 0) return "--";

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  })();

  // ===== Distance Utilities =====
  const getDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371000; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const isWithinDistance = () => {
    if (!workLocation || !currentLocation) return false;
    const distance = getDistanceMeters(
      workLocation.latitude,
      workLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );
    return distance <= 150; // 150 meters radius
  };

  // ===== Readiness Check =====
  const isReady =
    !isLoading && !locationLoading && !!currentLocation && !!workLocation;

  // ===== Permissions =====
  const canAction =
    isReady && !actionLocked && !isSubmitting && isWithinDistance();
  const canCheckIn = canAction && nextAction === "Check-in";
  const canCheckOut = canAction && nextAction === "Check-out";

  // ===== Action Handler =====
  const handleAction = async (type: FingerprintType) => {
    if (actionLocked || !isReady) return;

    if (!workLocation || !currentLocation) {
      toast({
        title: "Work location unavailable",
        description: "Please contact HR to configure your work location.",
        variant: "destructive",
      });
      return;
    }

    const distance = getDistanceMeters(
      workLocation.latitude,
      workLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );

    if (distance > 150) {
      toast({
        title: "Too far from work location",
        description: `Distance: ${distance} meters`,
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLocked(true);
      setLocalLastAction({ date: todayDate, type });

      await createFingerprint({ type }).unwrap();

      toast({ title: `Successfully ${type}` });
    } catch (error: any) {
      setLocalLastAction(null);
      toast({
        title: error?.data?.message || "Action failed",
        variant: "destructive",
      });
    } finally {
      setActionLocked(false);
    }
  };

  const handleFingerprint = async () => {
    if (!canAction) return;

    try {
      await handleAction(nextAction);
      setStatus("success");
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return {
    records,
    dailyRecords,
    todayRecords,
    lastCheckIn,
    lastCheckOut,
    workedTimeText,
    canCheckIn,
    canCheckOut,
    handleAction,
    isLoading,
    isFetching,
    locationLoading,
    currentLocation,
    isWithinDistance: isWithinDistance(),
    page,
    setPage,
    totalPages: data?.Pages || 1,
    canAction,
    handleFingerprint,
    mode: nextAction,
    nextAction,
    setMode: () => {},
    status,
    t,
    i18n,
  };
};
