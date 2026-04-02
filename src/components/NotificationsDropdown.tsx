import { useEffect } from "react";
import { Bell, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/rtk/Notifications/NotificationsApi";

const NotificationsDropdown = () => {
  const { t, i18n } = useTranslation();

  const {
    data: notificationsData,
    isLoading,
    refetch,
    error,
  } = useGetMyNotificationsQuery({ page: 1, limit: 20 });
  console.log(error);

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.data || [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const isRTL = i18n.language === "ar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notifications.some((n) => !n.isRead) && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notifications.filter((n) => !n.isRead).length}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isRTL ? "start" : "end"} // Align content for RTL
        className="w-80 animate-fade-in"
      >
        <div
          className={`flex items-center justify-between px-4 py-3 border-b border-border ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h4 className="font-semibold text-sm">{t("notifications.title")}</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleMarkAllAsRead}
            >
              {t("notifications.clearAll")}
            </Button>
          )}
        </div>

        <div className="py-2">
          {isLoading && (
            <p className="text-center text-sm py-4">
              {t("notifications.loading")}
            </p>
          )}

          {!isLoading && notifications.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t("notifications.empty")}
            </p>
          )}

          {!isLoading &&
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted ${
                  !notification.isRead ? "bg-gray-100" : ""
                } ${isRTL ? "flex-row-reverse " : ""}`} // Flip for RTL
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <span className={`text-sm pl-4 ${isRTL ? "pl-4 " : " pr-4"} `}>
                  {notification.message}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification._id);
                    ``;
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </div>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
