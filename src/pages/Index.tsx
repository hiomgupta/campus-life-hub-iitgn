
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, Bell, Bus, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { eventsData, announcementsData, busScheduleData } from "@/data/mock-data";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Get today's date
  const today = new Date();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get upcoming events (future events)
  const upcomingEvents = eventsData.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get recent announcements
  const recentAnnouncements = [...announcementsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  // Get next bus departures
  const getNextDepartures = () => {
    // Simulate next bus departures based on current time
    return busScheduleData.slice(0, 2);
  };
  
  const nextBusDepartures = getNextDepartures();
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Cultural':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Academic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Sports':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Networking':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Administrative':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Facility':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Campus Life Hub</h1>
        <p className="text-muted-foreground">
          Stay updated with everything happening on campus
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Access Cards */}
        <Link to="/bus-schedule" className="campus-card hover:bg-muted/50 group">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Bus Schedule</h3>
              <p className="text-sm text-muted-foreground">View campus bus timings</p>
            </div>
          </div>
        </Link>
        
        <Link to="/mess-menu" className="campus-card hover:bg-muted/50 group">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Mess Menu</h3>
              <p className="text-sm text-muted-foreground">Today's mess meals</p>
            </div>
          </div>
        </Link>
        
        <Link to="/events" className="campus-card hover:bg-muted/50 group">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Events</h3>
              <p className="text-sm text-muted-foreground">Upcoming campus events</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Information Feed */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Information Feed</CardTitle>
          <CardDescription>
            Latest updates and information from around campus
          </CardDescription>
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex flex-col space-y-2 p-3 rounded-md border">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{event.location}</span>
                    <span className="mx-2">•</span>
                    <Users className="mr-1 h-4 w-4" />
                    <span>{event.organizer}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming events
              </div>
            )}
            <div className="text-center pt-2">
              <Link 
                to="/events" 
                className="text-sm text-primary hover:underline"
              >
                View all events
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="flex flex-col space-y-1 p-3 rounded-md border">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <Badge className={getCategoryColor(announcement.category)}>
                    {announcement.category}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  <span>{formatDate(announcement.date)}</span>
                  {announcement.priority === 'High' && (
                    <>
                      <span className="mx-2">•</span>
                      <Badge variant="destructive" className="text-xs py-0">
                        High Priority
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm mt-1">{announcement.description}</p>
              </div>
            ))}
            <div className="text-center pt-2">
              <Link 
                to="/notifications" 
                className="text-sm text-primary hover:underline"
              >
                View all announcements
              </Link>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
      
      {/* Next Bus Departures */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Next Bus Departures</CardTitle>
            <Link 
              to="/bus-schedule" 
              className="text-sm text-primary hover:underline"
            >
              Full Schedule
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nextBusDepartures.map((bus) => (
              <div key={bus.id} className="flex justify-between items-center p-3 rounded-md border">
                <div>
                  <h3 className="font-medium">{bus.route}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Badge 
                      variant={bus.status.includes('Delayed') ? "destructive" : "outline"} 
                      className="text-xs mr-2"
                    >
                      {bus.status}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {bus.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Next: {bus.schedule[0].departure}</p>
                  <p className="text-sm text-muted-foreground">
                    Arrives: {bus.schedule[0].arrival}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* What's On Campus Section */}
      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">What's On Campus</h2>
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium">Class Cancellations</h3>
                <p className="text-sm">No classes cancelled today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <CalendarDays className="h-8 w-8 text-green-600 dark:text-green-400" />
                <h3 className="font-medium">Today's Highlights</h3>
                <p className="text-sm">Tech Club Meeting @ 5 PM</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <h3 className="font-medium">Ongoing Now</h3>
                <p className="text-sm">Library Extended Hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
