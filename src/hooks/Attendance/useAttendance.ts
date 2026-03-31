import { useState, useEffect, useMemo } from "react";
import {
  useGetMyFingerprintsQuery,
  useCreateLogedFingerprintMutation,
} from "@/rtk/Fingerprint/fingerprintApi";
import {  AttendanceFingerprint, FingerprintType } from "@/interfaces/attendance";
import { useToast } from "@/hooks/use-toast";

type LatLng = {
  latitude: number;
  longitude: number;
};

export const useAttendance = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);

  // 🔒 Prevent double click race condition
  const [actionLocked, setActionLocked] = useState(false);
 const [mode, setMode] = useState<"Check-in" | "Check-out">("Check-in");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  /* ================== Work Location ================== */
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

  /* ================== Current Location ================== */
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
      { enableHighAccuracy: true }
    );
  }, []);

  /* ================== Attendance Data ================== */
  const { data, isLoading, isFetching } =
    useGetMyFingerprintsQuery(page);

  const [createFingerprint, { isLoading: isSubmitting }] =
    useCreateLogedFingerprintMutation();

  const records: AttendanceFingerprint[] = data?.data || [];

  /* ================== Today Logic ================== */
  const todayDate = new Date().toLocaleDateString("en-CA");

  const todayRecords = records
    .filter((r) => r.date === todayDate)
    .sort((a, b) => a.Time.localeCompare(b.Time));

  const lastServerRecord = todayRecords[todayRecords.length - 1];

  const [localLastType, setLocalLastType] =
    useState<FingerprintType | null>(null);

  const effectiveLastType =
    localLastType ?? lastServerRecord?.type ?? null;

  const lastCheckIn = [...todayRecords]
    .reverse()
    .find((r) => r.type === "Check-in");

  const lastCheckOut = [...todayRecords]
    .reverse()
    .find((r) => r.type === "Check-out");

  /* ================== Worked Time ================== */
  const workedTimeText = (() => {
    if (!todayRecords.length) return "--";

    let totalMs = 0;
    let openCheckIn: Date | null = null;

    for (const record of todayRecords) {
      const recordTime = new Date(`${todayDate}T${record.Time}`);

      if (record.type === "Check-in") {
        openCheckIn = recordTime;
      }

      if (record.type === "Check-out" && openCheckIn) {
        const diff = recordTime.getTime() - openCheckIn.getTime();
        if (diff > 0) totalMs += diff;
        openCheckIn = null;
      }
    }

    if (openCheckIn) {
      totalMs += new Date().getTime() - openCheckIn.getTime();
    }

    if (totalMs <= 0) return "--";

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  })();

  /* ================== Distance ================== */
  const getDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const isWithinDistance = () => {
    if (!workLocation || !currentLocation) return false;

    const distance = getDistanceMeters(
      workLocation.latitude,
      workLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );

    return distance <= 150;
  };

  /* ================== Readiness Fix ================== */
  const isReady =
    !isLoading &&
    !locationLoading &&
    !!currentLocation;

  /* ================== Permissions ================== */
  const canCheckIn =
    isReady &&
    !actionLocked &&
    !isSubmitting &&
    (effectiveLastType === null ||
      effectiveLastType === "Check-out") &&
    isWithinDistance();

  const canCheckOut =
    isReady &&
    !actionLocked &&
    !isSubmitting &&
    effectiveLastType === "Check-in" &&
    isWithinDistance();

  /* ================== Action ================== */
  const handleAction = async (type: FingerprintType) => {
    if (actionLocked || !isReady) return;

    const distance = getDistanceMeters(
      workLocation!.latitude,
      workLocation!.longitude,
      currentLocation!.latitude,
      currentLocation!.longitude
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
      setLocalLastType(type);

      await createFingerprint({ type }).unwrap();

      toast({
        title: `Successfully ${type}`,
      });
    } catch (error: any) {
      setLocalLastType(null);

      toast({
        title: error?.data?.message || "Action failed",
        variant: "destructive",
      });
    } finally {
      setActionLocked(false);
    }
  };
  const canAction = mode === "Check-in" ? canCheckIn : canCheckOut;

  const handleFingerprint = async () => {
    if (!canAction) return;
    try {
      const fingerprintType: FingerprintType =
        mode === "Check-in" ? "Check-in" : "Check-out";
      await handleAction(fingerprintType);
      setStatus("success");
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 2000);
    }
  };
  return {
   records,
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
    mode,
    setMode,
    status,
  };
};