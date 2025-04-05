
import { useState } from "react";
import QuickAccessCards from "@/components/home/QuickAccessCards";
import InformationFeed from "@/components/home/InformationFeed";
import NextBusDepartures from "@/components/home/NextBusDepartures";
import CampusHighlights from "@/components/home/CampusHighlights";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Campus Life Hub</h1>
        <p className="text-muted-foreground">
          Stay updated with everything happening on campus
        </p>
      </div>
      
      <QuickAccessCards />
      <InformationFeed />
      <NextBusDepartures />
      <CampusHighlights />
    </div>
  );
};

export default Index;
