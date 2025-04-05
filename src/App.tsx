
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
import NotFound from "./pages/NotFound";

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
              {/* Add more routes as needed */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
