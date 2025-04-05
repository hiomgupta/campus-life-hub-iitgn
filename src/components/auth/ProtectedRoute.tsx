
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'clubAdmin' | 'student' | undefined;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("admin_email") || localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");
    
    setIsAuthenticated(!!email);
    setUserRole(role);
  }, []);

  // Still checking authentication status
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role is required but user doesn't have the right role
  if (requiredRole && userRole !== requiredRole) {
    // If regular user trying to access admin pages
    if (requiredRole === 'admin' && userRole === 'student') {
      return <Navigate to="/" replace />;
    }
    
    // If club admin trying to access admin-only pages
    if (requiredRole === 'admin' && userRole === 'clubAdmin') {
      return <Navigate to="/admin/campus-activities" replace />;
    }
    
    // If admin or club admin trying to access student-only pages
    if (requiredRole === 'student' && (userRole === 'admin' || userRole === 'clubAdmin')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // If authenticated with correct role, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;
