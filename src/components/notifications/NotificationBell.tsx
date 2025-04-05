
import { useState, useEffect } from "react";
import { Bell, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
            {notification.clubName && (
              <p className="text-xs font-medium mt-1">From: {notification.clubName}</p>
            )}
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
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadNotifications = () => {
      const userId = localStorage.getItem("user_email") || "";
      if (!userId) return;
      
      // Get all notifications
      const allNotifications = localStorage.getItem("all_notifications");
      let notificationList: Notification[] = [];
      
      if (allNotifications) {
        const parsedNotifications: Notification[] = JSON.parse(allNotifications);
        
        // Filter for current user (including notifications meant for all users)
        notificationList = parsedNotifications.filter(
          n => n.userId === userId || n.userId === "all"
        );
      } else {
        // Create example notifications if none exist
        const exampleNotifications: Notification[] = [
          {
            id: "1",
            userId: "all",
            title: "New Event Added",
            message: "Technical Club just added a new event: Hackathon 2025",
            type: "event",
            date: new Date().toISOString(),
            read: false,
            clubName: "Technical Club"
          },
          {
            id: "2",
            userId: userId,
            title: "Event Reminder",
            message: "Cultural Night starts in 1 hour",
            type: "reminder",
            date: new Date().toISOString(),
            read: false,
            relatedId: "2",
            clubName: "Cultural Club"
          },
          {
            id: "3",
            userId: "all",
            title: "Urgent Notice",
            message: "Fee deadline extended to next Friday",
            type: "urgent",
            date: new Date().toISOString(),
            read: true
          }
        ];
        
        notificationList = exampleNotifications;
        localStorage.setItem("all_notifications", JSON.stringify(exampleNotifications));
      }
      
      // Get read status for this user
      const readStatus = localStorage.getItem(`notification_read_${userId}`);
      const readIds = readStatus ? JSON.parse(readStatus) : [];
      
      // Mark notifications as read based on user's read status
      notificationList = notificationList.map(notification => ({
        ...notification,
        read: readIds.includes(notification.id) ? true : notification.read
      }));
      
      setNotifications(notificationList);
    };
    
    loadNotifications();
    
    // Check for new notifications every minute
    const interval = setInterval(() => {
      loadNotifications();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [open]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: string) => {
    const userId = localStorage.getItem("user_email") || "";
    if (!userId) return;
    
    // Get current read status
    const readStatus = localStorage.getItem(`notification_read_${userId}`);
    const readIds = readStatus ? JSON.parse(readStatus) : [];
    
    // Add this notification to read list
    if (!readIds.includes(id)) {
      const updatedReadIds = [...readIds, id];
      localStorage.setItem(`notification_read_${userId}`, JSON.stringify(updatedReadIds));
    }
    
    // Update UI
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
  };
  
  const handleMarkAllAsRead = () => {
    const userId = localStorage.getItem("user_email") || "";
    if (!userId) return;
    
    // Get IDs of all notifications for this user
    const notificationIds = notifications.map(n => n.id);
    
    // Update read status in localStorage
    localStorage.setItem(`notification_read_${userId}`, JSON.stringify(notificationIds));
    
    // Update UI
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    toast.success("All notifications marked as read");
  };
  
  const handleCreateNotification = () => {
    const userRole = localStorage.getItem("user_role");
    
    if (userRole === "admin" || userRole === "clubAdmin") {
      navigate("/admin/notices");
    }
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
          <div className="flex gap-2">
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
            {(localStorage.getItem("user_role") === "admin" || 
             localStorage.getItem("user_role") === "clubAdmin") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleCreateNotification}
              >
                <Info className="h-3 w-3 mr-1" />
                Manage Notifications
              </Button>
            )}
          </div>
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
