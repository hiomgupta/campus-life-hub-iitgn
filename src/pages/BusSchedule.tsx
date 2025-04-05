
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Clock, Search, Calendar, MapPin } from "lucide-react";
import { busScheduleData } from "@/data/mock-data";

const BusSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  // Filter the bus routes based on search and filter
  const filteredRoutes = busScheduleData.filter((route) => {
    const matchesSearch = route.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || route.type === filterType;
    return matchesSearch && matchesType;
  });
  
  // Helper function to get badge color based on status
  const getStatusBadge = (status: string) => {
    if (status.includes("On Time")) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{status}</Badge>;
    } else if (status.includes("Delayed")) {
      return <Badge variant="destructive">{status}</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bus Schedule</h1>
        <p className="text-muted-foreground">
          View campus bus timings and schedules
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bus className="mr-2 h-5 w-5" />
            Bus Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Label htmlFor="route-search">Search Routes</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="route-search"
                    placeholder="Enter route or destination..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/3">
                <Label htmlFor="filter-type">Filter Type</Label>
                <Select 
                  defaultValue="All" 
                  onValueChange={setFilterType}
                >
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Special">Special</SelectItem>
                    <SelectItem value="Shuttle">Shuttle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="routes" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="routes">Routes</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="routes" className="space-y-4 pt-4">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <Card key={route.id} className="overflow-hidden">
                      <div className="bg-muted p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Bus className="mr-2 h-5 w-5" />
                          <h3 className="font-medium">{route.route}</h3>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(route.status)}
                          <Badge variant="outline">{route.type}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm flex items-center">
                            <Clock className="mr-2 h-4 w-4" /> Schedule
                          </h4>
                          <div className="grid gap-2">
                            {route.schedule.map((time, idx) => (
                              <div key={idx} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
                                {typeof time === 'object' ? (
                                  <>
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Departure:</span>
                                      <span className="ml-2 text-sm">{time.departure}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Arrival:</span>
                                      <span className="ml-2 text-sm">{time.arrival}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="col-span-2 text-sm">{time}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No routes found matching your criteria
                  </div>
                )}
              </TabsContent>
              <TabsContent value="map" className="pt-4">
                <div className="border rounded-lg overflow-hidden h-96 flex items-center justify-center bg-muted">
                  <div className="text-center p-6">
                    <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Bus Route Map</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visual map of bus routes coming soon
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Push Notifications</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Get notified about bus delays and changes
                </p>
                <Button size="sm">Enable Notifications</Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Offline Access</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Save the schedule for offline viewing
              </p>
              <Button variant="outline" size="sm">
                Save Schedule Offline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusSchedule;
