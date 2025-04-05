
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

export function HeaderActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(
    localStorage.getItem("user_email") || localStorage.getItem("admin_email")
  );
  const userRole = localStorage.getItem("user_role");
  
  // Don't show login button on login page
  if (location.pathname === "/login") {
    return null;
  }
  
  const handleLoginClick = () => {
    navigate("/login");
  };
  
  const handleDashboardClick = () => {
    if (userRole === "admin" || userRole === "clubAdmin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && <NotificationBell />}
      
      <Button
        variant={isLoggedIn ? "ghost" : "default"}
        size="sm"
        onClick={isLoggedIn ? handleDashboardClick : handleLoginClick}
      >
        <User className="h-5 w-5 sm:mr-2" />
        <span className="hidden sm:inline">
          {isLoggedIn ? "Dashboard" : "Login"}
        </span>
      </Button>
    </div>
  );
}
