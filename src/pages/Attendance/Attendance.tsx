import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

import Layout from "@/components/layout/Layout";
import PortalCard from "@/components/portal/PortalCard";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import LoadingFull from "@/components/ui/LoadingSkeleton";
import { useAttendance } from "@/hooks/Attendance/useAttendance";
import { FingerprintType } from "@/interfaces";

const Attendance = () => {
  const token = localStorage.getItem("token");

  const {
    records,
    lastCheckIn,
    lastCheckOut,
    canCheckIn,
    canCheckOut,
    workedTimeText,
    handleAction,
    isLoading,
    locationLoading,
    currentLocation,
    isWithinDistance,
  } = useAttendance();

  const [mode, setMode] = useState<"Check-in" | "Check-out">("Check-in");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p>Track your daily attendance</p>
          </div>
        </div>

        {/* Attendance History */}
        <PortalCard title="Attendance History" icon={<Clock />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{new Date(r.date).toDateString()}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.Time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PortalCard>
      </div>
    </Layout>
  );
};

export default Attendance;
