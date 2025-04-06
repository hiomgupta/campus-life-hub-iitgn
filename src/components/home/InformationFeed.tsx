
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { eventsData, announcementsData } from "@/data/mock-data";

// Helper to get category color
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const InformationFeed = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Get today's date
  const today = new Date();
  
  // Get upcoming events (future events)
  const upcomingEvents = eventsData.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get recent announcements
  const recentAnnouncements = [...announcementsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
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
        </Tabs>
      </CardHeader>
      <CardContent>
        {/* Content can be moved here if needed */}
      </CardContent>
    </Card>
  );
};

export default InformationFeed;
