
import { useState } from "react";
import { Outlet, useNavigate} from "react-router-dom";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderActions } from "./header-actions";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r">
            <SidebarNav>
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <h1 className="text-xl font-bold">Campus Life Hub</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
             <SidebarNav />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <ThemeToggle />
              <HeaderActions />
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden fixed left-4 top-3 z-40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <h1 className="text-xl font-bold">Campus Life Hub</h1>
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
              <SidebarNav onNavItemClick={closeSidebar} />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <ThemeToggle />
              <HeaderActions />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className={`flex flex-col ${!isMobile ? "md:pl-64" : ""} flex-1`}>
        {/* Mobile header */}
        {isMobile && (
          <div className="sticky top-0 z-10 flex items-center justify-between h-12 bg-background/80 backdrop-blur-sm border-b px-4">
            <div className="ml-10">
              <h1 className="text-lg font-bold">Campus Life Hub</h1>
            </div>
            <div className="flex items-center gap-2">
              <HeaderActions />
              <ThemeToggle />
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
