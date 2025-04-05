
import { useState } from "react";
import { Link } from "react-router-dom";
import QuickAccessCards from "@/components/home/QuickAccessCards";
import InformationFeed from "@/components/home/InformationFeed";
import NextBusDepartures from "@/components/home/NextBusDepartures";
import CampusHighlights from "@/components/home/CampusHighlights";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Index = () => {
  // Check if user is logged in as admin
  const isAdmin = localStorage.getItem("admin_email") !== null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Campus Life Hub</h1>
          <p className="text-muted-foreground">
            Stay updated with everything happening on campus
          </p>
        </div>
        
        {isAdmin ? (
          <Link to="/admin/dashboard">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        )}
      </div>
      
      <QuickAccessCards />
      <InformationFeed />
      <NextBusDepartures />
      <CampusHighlights />
    </div>
  );
};

export default Index;
