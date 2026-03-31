import { useState } from "react";
import { Bell, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Notification = {
  id: number;
  text: string;
};

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Leave Request Approved" },
    { id: 2, text: "Attendance Reminder" },
    { id: 3, text: "Policy Update" },
  ]);

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {notifications.length}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={clearAll}
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="py-2">
          {notifications.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No notifications
            </p>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-muted"
            >
              <span className="text-sm">{notification.text}</span>
              <button
                onClick={() => deleteNotification(notification.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
