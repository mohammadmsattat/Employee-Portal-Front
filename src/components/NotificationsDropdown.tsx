import { useMemo } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/rtk/Notifications/NotificationsApi";

const NotificationsDropdown = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMyNotificationsQuery({
    page: 1,
    limit: 20,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data || [];

  const unread = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );

  const isRTL = i18n.language === "ar";

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 md:h-11 md:w-11">
          <Bell className="h-5 w-5 text-slate-700" />

          {unread.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
              {unread.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isRTL ? "start" : "end"}
        className="
          w-[92vw] max-w-[380px]
          p-0 overflow-hidden
          rounded-2xl border border-slate-200
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              {t("notifications.title")}
            </h4>
          </div>

          {unread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAll}
              className="h-8 rounded-lg text-xs"
            >
              <CheckCheck className="mr-1 h-4 w-4" />
              {t("notifications.clearAll")}
            </Button>
          )}
        </div>

        {/* LIST */}
        <div className="max-h-[420px] overflow-y-auto bg-slate-50">
          {isLoading && (
            <div className="p-6 text-center text-sm text-slate-500">
              Loading...
            </div>
          )}

          {!isLoading && unread.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              No new notifications
            </div>
          )}

          {unread.map((n) => (
            <div
              key={n._id}
              onClick={() => handleMarkAsRead(n._id)}
              className="
                group relative mx-3 my-2 cursor-pointer
                rounded-xl border border-slate-200 bg-white
                p-3 shadow-sm transition
                hover:-translate-y-0.5 hover:shadow-md
              "
            >
              {/* unread dot */}
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">
                    {n.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(n._id);
                  }}
                  className="opacity-0 transition group-hover:opacity-100 text-slate-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white p-2">
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => navigate("/notifications")}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;