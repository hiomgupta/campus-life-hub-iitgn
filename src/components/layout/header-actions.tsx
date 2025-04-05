
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && <NotificationBell />}
      
      {isLoggedIn ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDashboardClick}
          >
            <User className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">
              {userName || "Dashboard"}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">
              Logout
            </span>
          </Button>
        </>
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
