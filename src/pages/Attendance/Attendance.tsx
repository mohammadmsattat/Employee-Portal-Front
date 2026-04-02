import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

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

const Attendance = () => {
  const token = localStorage.getItem("token");

  const { records, isLoading, t, i18n } = useAttendance();

  const isRTL = i18n.language === "ar";

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
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              {isRTL ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )}
            </Link>
          </Button>

          {/* Title */}
          <div className="flex-1 text-start">
            <h1 className="text-2xl font-bold">{t("attendancePage.title")}</h1>
            <p className="text-muted-foreground">
              {t("attendancePage.subtitle")}
            </p>
          </div>
        </div>

        {/* Attendance History */}
        <PortalCard title={t("attendancePage.history")} icon={<Clock />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">
                  {t("attendancePage.date")}
                </TableHead>

                <TableHead className="text-center">
                  {t("attendancePage.type")}
                </TableHead>

                <TableHead className="text-end">
                  {t("attendancePage.time")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>
                    {new Intl.DateTimeFormat(i18n.language).format(
                      new Date(r.date),
                    )}
                  </TableCell>

                  <TableCell className="text-center">{r.type}</TableCell>

                  <TableCell className="text-end">{r.Time}</TableCell>
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
