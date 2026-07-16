import { useEffect, useMemo, useState } from "react";
import { Bell, BellRing, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/rtk/Notifications/NotificationsApi";

const NotificationsDropdown = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
    };

    if (profileOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);
  const { data, isLoading } = useGetMyNotificationsQuery({
    page: 1,
    limit: 20,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data || [];

  const unread = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications],
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
    <div className="relative">
      {/* BUTTON */}

      <button
        onClick={() => onOpenChange(!open)}
        className="relative flex h-10 w-10 mr-2 items-center justify-center rounded-sm transition hover:bg-slate-100"
      >
        <BellRing className="h-5 w-5 text-slate-500 transform rotate-12" />{" "}
        {unread.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-sm bg-red-500 px-1 text-[11px] font-bold text-white">
            {unread.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`
            absolute top-12  z-50
            w-[92vw] max-w-[380px]
            rounded-sm border border-slate-200
            bg-white shadow-xl
            ${isRTL ? "left-0" : "right-0"}
          `}
        >
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
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
                className="h-8 rounded-sm text-xs"
              >
                <CheckCheck className="mr-1 h-4 w-4" />

                {t("notifications.clearAll")}
              </Button>
            )}
          </div>

          {/* LIST */}

          <div className="max-h-[420px] overflow-y-auto bg-slate-50 p-2">
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
                  group relative mb-2 cursor-pointer
                  rounded-sm border border-slate-200
                  bg-white p-3
                  transition hover:bg-slate-50
                "
              >
                <span className="absolute right-3 top-3 h-2 w-2 rounded-sm bg-blue-500" />

                <p className="pr-4 text-sm font-medium text-slate-800">
                  {n.message}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(n._id);
                  }}
                  className="
                    absolute right-2 top-2
                    opacity-0 transition
                    group-hover:opacity-100
                    text-slate-400 hover:text-red-500
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* FOOTER */}

          <div className="border-t border-slate-100 p-2">
            <Button
              variant="ghost"
              className="w-full rounded-sm"
              onClick={() => navigate("/notifications")}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
