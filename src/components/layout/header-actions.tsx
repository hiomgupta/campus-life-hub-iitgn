
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, UserCircle, Settings, Book, Calendar } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    const email = localStorage.getItem("user_email") || localStorage.getItem("admin_email");
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("user_name");
    
    setIsLoggedIn(!!email);
    setUserRole(role);
    setUserName(name || (email ? email.split("@")[0] : null));
  }, [location]);
  
  // Don't show login button on login page
  if (location.pathname === "/login") {
    return null;
  }
  
  const handleLoginClick = () => {
    navigate("/login");
  };
  
  const handleDashboardClick = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "clubAdmin") {
      navigate("/admin/campus-activities");
    } else {
      navigate("/user/dashboard");
    }
  };

  const handleProfileClick = () => {
    navigate("/user/profile");
  };
  
  const handleLogoutClick = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("club_id");
    localStorage.removeItem("club_name");
    
    setIsLoggedIn(false);
    setUserRole(null);
    
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && <NotificationBell />}
      
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 flex items-center"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName ? getInitials(userName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-medium">
                {userName || "Account"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName || "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDashboardClick}>
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            {userRole === "student" && (
              <>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/events')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  My Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/profile')}>
                  <Book className="mr-2 h-4 w-4" />
                  Bookmarks
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={handleLoginClick}
        >
          <User className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">
            Login
          </span>
        </Button>
      )}
    </div>
  );
}
