
import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types";
import { toast } from "sonner";

const NotificationItem = ({ notification, onMarkAsRead }: { 
  notification: Notification, 
  onMarkAsRead: (id: string) => void 
}) => {
  const getTypeIcon = () => {
    switch(notification.type) {
      case 'event':
        return '🗓️';
      case 'notice':
        return '📢';
      case 'reminder':
        return '⏰';
      case 'urgent':
        return '🔴';
      default:
        return '📣';
    }
  };

  return (
    <div className={`border-b p-3 ${notification.read ? 'opacity-70' : 'bg-primary-50 dark:bg-primary-950'}`}>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span className="text-xl">{getTypeIcon()}</span>
          <div>
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-muted-foreground">{notification.message}</p>
          </div>
        </div>
        {!notification.read && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => onMarkAsRead(notification.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {new Date(notification.date).toLocaleString()}
      </div>
    </div>
  );
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const loadNotifications = () => {
      const userId = localStorage.getItem("user_email") || "";
      if (!userId) return;
      
      const storedNotifications = localStorage.getItem(`notifications_${userId}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Create example notifications if none exist
        const exampleNotifications: Notification[] = [
          {
            id: "1",
            userId,
            title: "New Event Added",
            message: "Technical Club just added a new event: Hackathon 2025",
            type: "event",
            date: new Date().toISOString(),
            read: false
          },
          {
            id: "2",
            userId,
            title: "Event Reminder",
            message: "Cultural Night starts in 1 hour",
            type: "reminder",
            date: new Date().toISOString(),
            read: false,
            relatedId: "2"
          },
          {
            id: "3",
            userId,
            title: "Urgent Notice",
            message: "Fee deadline extended to next Friday",
            type: "urgent",
            date: new Date().toISOString(),
            read: true
          }
        ];
        setNotifications(exampleNotifications);
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(exampleNotifications));
      }
    };
    
    loadNotifications();
    
    // Check for new notifications every minute
    const interval = setInterval(() => {
      const unreadCount = notifications.filter(n => !n.read).length;
      if (unreadCount > 0 && !open) {
        // Play notification sound or show toast for new notifications
        // This is just a placeholder - in a real app you'd check for new ones from a backend
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [open]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    const userId = localStorage.getItem("user_email") || "";
    if (userId) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    }
  };
  
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    
    // Update in localStorage
    const userId = localStorage.getItem("user_email") || "";
    if (userId) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
    }
    
    toast.success("All notifications marked as read");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="font-medium text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
