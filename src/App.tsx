
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import Index from "./pages/Index";
import BusSchedule from "./pages/BusSchedule";
import MessMenu from "./pages/MessMenu";
import MessQR from "./pages/MessQR";
import FoodOutlets from "./pages/FoodOutlets";
import CampusMap from "./pages/CampusMap";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import NoticeBoard from "./pages/NoticeBoard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBusSchedule from "./pages/AdminBusSchedule";
import AdminCampusActivities from "./pages/AdminCampusActivities";
import AdminMessMenu from "./pages/AdminMessMenu";
import AdminFoodOutlets from "./pages/AdminFoodOutlets";
import AdminCampusMap from "./pages/AdminCampusMap";
import AdminManagement from "./pages/AdminManagement";
import AdminClubs from "./pages/AdminClubs";
import AdminNotices from "./pages/AdminNotices";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/bus-schedule" element={<BusSchedule />} />
              <Route path="/mess-menu" element={<MessMenu />} />
              <Route path="/mess-qr" element={<MessQR />} />
              <Route path="/food-outlets" element={<FoodOutlets />} />
              <Route path="/campus-map" element={<CampusMap />} />
              <Route path="/events" element={<Events />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/notice-board" element={<NoticeBoard />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute requiredRole="student" />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/profile" element={<UserProfile />} />
              </Route>
              
              {/* Admin and Club Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/campus-activities" element={<AdminCampusActivities />} />
                <Route path="/admin/clubs" element={<AdminClubs />} />
                <Route path="/admin/notices" element={<AdminNotices />} />
              </Route>
              
              {/* Admin-only Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bus-schedule" element={<AdminBusSchedule />} />
                <Route path="/admin/mess-menu" element={<AdminMessMenu />} />
                <Route path="/admin/food-outlets" element={<AdminFoodOutlets />} />
                <Route path="/admin/campus-map" element={<AdminCampusMap />} />
                <Route path="/admin/manage-admins" element={<AdminManagement />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
