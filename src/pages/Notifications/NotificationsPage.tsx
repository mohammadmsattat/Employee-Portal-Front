import { Bell, CheckCheck, Clock3, FileText, CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

import {
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/rtk/Notifications/NotificationsApi";

import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetMyNotificationsQuery({
    page: 1,
    limit: 50,
  });

  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();

  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.data || [];
console.log(notifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification._id).unwrap();
      }

      const { entity } = notification;

      if (!entity?.model) return;

      const params = new URLSearchParams();

      // =========================
      // WORKSPACE
      // =========================

      if (entity.model === "Workspace") {
        params.set("type", "workspace");

        params.set("workspaceId", entity.id);
      }

      // =========================
      // FOLDER
      // =========================

      if (entity.model === "Folder") {
        params.set("type", "folder");

        params.set("workspaceId", entity.workspaceId);

        params.set("folderId", entity.folderId);
      }

      // =========================
      // LIST
      // =========================

      if (entity.model === "List") {
        params.set("type", "list");

        params.set("workspaceId", entity.workspaceId);

        params.set("folderId", entity.folderId);

        params.set("listId", entity.listId);
      }

      // =========================
      // TASK
      // =========================

      if (entity.model === "Task") {
        params.set("type", "task");

        params.set("taskId", entity.taskId);
        params.set("listId", entity.listId);

        params.set("mode", "details");
      }

      // =========================
      // SUBTASK
      // =========================

      if (entity.model === "SubTask") {
        params.set("type", "subtask");

        params.set("taskId", entity.taskId);

        params.set("subTaskId", entity.subTaskId);

        params.set("mode", "details");
      }

      navigate(`/tasks?${params.toString()}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (message: string) => {
    const lower = message.toLowerCase();

    if (lower.includes("leave")) {
      return <CalendarDays className="h-5 w-5 text-blue-600" />;
    }

    if (lower.includes("overtime")) {
      return <Clock3 className="h-5 w-5 text-violet-600" />;
    }

    return <FileText className="h-5 w-5 text-emerald-600" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_35%)]" />

          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Bell className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Notifications
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isMarking}
                className="h-11 rounded-2xl px-5"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </section>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">
          <StatsCard title="Total" value={notifications.length} />

          <StatsCard
            title="Unread"
            value={unreadCount}
            valueClass="text-blue-600"
          />

          <StatsCard
            title="Read"
            value={notifications.length - unreadCount}
            valueClass="text-green-600"
          />
        </section>

        {/* LIST */}

        <section className="space-y-4">
          {isLoading && (
            <Card className="rounded-3xl p-10 text-center">
              Loading notifications...
            </Card>
          )}

          {!isLoading && notifications.length === 0 && (
            <Card className="rounded-3xl border-dashed p-14 text-center">
              <Bell className="mx-auto h-10 w-10 text-slate-400" />

              <p className="mt-4 text-slate-500">No notifications yet</p>
            </Card>
          )}

          {notifications.map((notification) => (
            <Card
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`
                relative cursor-pointer rounded-3xl border p-5
                transition hover:-translate-y-0.5
                ${
                  !notification.isRead
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-slate-200 bg-white"
                }
              `}
            >
              {!notification.isRead && (
                <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-white">
                  {getNotificationIcon(notification.message)}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default NotificationsPage;

const StatsCard = ({
  title,
  value,
  valueClass,
}: {
  title: string;
  value: number;
  valueClass?: string;
}) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
    <p className="text-sm text-slate-500">{title}</p>

    <p className={`mt-3 text-3xl font-bold ${valueClass || ""}`}>{value}</p>
  </div>
);
