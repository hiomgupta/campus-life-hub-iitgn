
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Filter, CalendarDays, Bookmark, BookmarkCheck, ExternalLink, Info } from "lucide-react";
import { CampusActivity } from "@/types";
import EventCalendar from "@/components/events/EventCalendar";
import { toast } from "sonner";
import { format } from "date-fns";

const initialEvents: CampusActivity[] = [
  {
    id: "1",
    title: "Tech Club Meeting",
    description: "Weekly meeting of the technology club to discuss ongoing projects",
    date: "2025-04-05",
    time: "17:00",
    location: "Student Activity Center",
    category: "club",
    addedBy: "tech.club@iitgn.ac.in",
    clubId: "tech-club"
  },
  {
    id: "2",
    title: "Cultural Night",
    description: "Annual cultural night featuring performances from various student groups",
    date: "2025-04-10",
    time: "19:00",
    location: "Auditorium",
    category: "event",
    addedBy: "cultural.club@iitgn.ac.in",
    clubId: "cultural-club"
  },
  {
    id: "3",
    title: "Guest Lecture: AI Advancements",
    description: "Special lecture by Dr. Jane Smith on recent advancements in AI",
    date: "2025-04-12",
    time: "10:00",
    location: "Lecture Hall 1",
    category: "lecture",
    addedBy: "admin@iitgn.ac.in"
  }
];

const Events = () => {
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [filters, setFilters] = useState({
    category: "all",
    upcoming: true
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("user_email");
    setUserEmail(email);
    
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem("campus_activities_data");
    if (storedData) {
      setActivities(JSON.parse(storedData));
    } else {
      setActivities(initialEvents);
      localStorage.setItem("campus_activities_data", JSON.stringify(initialEvents));
    }
    
    // Load bookmarked events
    if (email) {
      const storedUserData = localStorage.getItem(`user_profile_${email}`);
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setBookmarkedEvents(userData.bookmarks || []);
      }
      
      // Load registered events
      const storedRegistrations = localStorage.getItem("event_registrations");
      if (storedRegistrations) {
        const registrations = JSON.parse(storedRegistrations);
        const userRegs = registrations
          .filter((reg: any) => reg.userId === email && reg.status === "registered")
          .map((reg: any) => reg.eventId);
        setRegisteredEvents(userRegs);
      }
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "event":
        return "blue";
      case "lecture":
        return "green";
      case "club":
        return "purple";
      case "exhibition":
        return "amber";
      case "sports":
        return "red";
      case "workshop":
        return "cyan";
      case "conference":
        return "orange";
      default:
        return "slate";
    }
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category
    }));
  };

  const toggleUpcomingFilter = () => {
    setFilters(prev => ({
      ...prev,
      upcoming: !prev.upcoming
    }));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isUpcoming = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };
  
  const toggleBookmark = (eventId: string) => {
    if (!userEmail) {
      toast.error("Please login to bookmark events");
      return;
    }
    
    const isBookmarked = bookmarkedEvents.includes(eventId);
    let updatedBookmarks: string[];
    
    if (isBookmarked) {
      updatedBookmarks = bookmarkedEvents.filter(id => id !== eventId);
      toast.success("Event removed from bookmarks");
    } else {
      updatedBookmarks = [...bookmarkedEvents, eventId];
      toast.success("Event added to bookmarks");
    }
    
    setBookmarkedEvents(updatedBookmarks);
    
    // Update in localStorage
    const storedUserData = localStorage.getItem(`user_profile_${userEmail}`);
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      userData.bookmarks = updatedBookmarks;
      localStorage.setItem(`user_profile_${userEmail}`, JSON.stringify(userData));
    } else {
      // Create user profile if it doesn't exist
      const newUserProfile = {
        id: Math.random().toString(),
        email: userEmail,
        name: userEmail.split("@")[0],
        role: "student",
        clubMemberships: [],
        interests: [],
        bookmarks: updatedBookmarks
      };
      localStorage.setItem(`user_profile_${userEmail}`, JSON.stringify(newUserProfile));
    }
  };
  
  const registerForEvent = (eventId: string) => {
    if (!userEmail) {
      toast.error("Please login to register for events");
      return;
    }
    
    const isRegistered = registeredEvents.includes(eventId);
    
    if (isRegistered) {
      // Unregister
      const updatedRegistrations = registeredEvents.filter(id => id !== eventId);
      setRegisteredEvents(updatedRegistrations);
      
      // Update in localStorage
      const storedRegistrations = localStorage.getItem("event_registrations");
      let registrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
      registrations = registrations.filter(
        (reg: any) => !(reg.eventId === eventId && reg.userId === userEmail)
      );
      localStorage.setItem("event_registrations", JSON.stringify(registrations));
      
      toast.success("Successfully unregistered from event");
    } else {
      // Register
      const updatedRegistrations = [...registeredEvents, eventId];
      setRegisteredEvents(updatedRegistrations);
      
      // Update in localStorage
      const storedRegistrations = localStorage.getItem("event_registrations");
      let registrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
      registrations.push({
        eventId,
        userId: userEmail,
        registrationDate: new Date().toISOString(),
        status: "registered"
      });
      localStorage.setItem("event_registrations", JSON.stringify(registrations));
      
      toast.success("Successfully registered for event");
      
      // Create a reminder notification
      const event = activities.find(event => event.id === eventId);
      if (event) {
        createReminderNotification(event);
      }
    }
  };
  
  const createReminderNotification = (event: CampusActivity) => {
    if (!userEmail) return;
    
    const storedNotifications = localStorage.getItem(`notifications_${userEmail}`);
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    const newNotification = {
      id: Math.random().toString(),
      userId: userEmail,
      title: "Event Registration Confirmation",
      message: `You've registered for ${event.title} on ${format(new Date(event.date), "PPP")} at ${formatTime(event.time)}`,
      type: "reminder" as "reminder",
      date: new Date().toISOString(),
      read: false,
      relatedId: event.id
    };
    
    notifications = [newNotification, ...notifications];
    localStorage.setItem(`notifications_${userEmail}`, JSON.stringify(notifications));
  };
  
  const addToGoogleCalendar = (event: CampusActivity) => {
    // Format date and time for Google Calendar URL
    const startDate = `${event.date}T${event.time}:00`;
    const endDate = `${event.date}T${parseInt(event.time.split(':')[0]) + 1}:${event.time.split(':')[1]}:00`;
    
    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.replace(/[-:]/g, '')}/${endDate.replace(/[-:]/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    // Open Google Calendar in new tab
    window.open(googleCalendarUrl, '_blank');
    
    toast.success("Event added to Google Calendar");
  };

  // Filter activities based on the selected filters
  const filteredActivities = activities.filter(activity => {
    // Filter by category
    if (filters.category !== 'all' && activity.category !== filters.category) {
      return false;
    }
    
    // Filter by upcoming
    if (filters.upcoming && !isUpcoming(activity.date)) {
      return false;
    }
    
    return true;
  });

  // Sort activities by date (upcoming first)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campus Events</h1>
        <p className="text-muted-foreground">
          Discover what's happening on campus
        </p>
      </div>
      
      <Tabs defaultValue="list" onValueChange={(value: string) => setViewMode(value as "list" | "calendar")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle>Events & Activities</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={filters.upcoming ? "default" : "outline"}
                    size="sm"
                    onClick={toggleUpcomingFilter}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {filters.upcoming ? "Upcoming Only" : "All Events"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  <Button
                    variant={filters.category === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filters.category === "event" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("event")}
                  >
                    Events
                  </Button>
                  <Button
                    variant={filters.category === "lecture" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("lecture")}
                  >
                    Lectures
                  </Button>
                  <Button
                    variant={filters.category === "club" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("club")}
                  >
                    Club Meetings
                  </Button>
                  <Button
                    variant={filters.category === "exhibition" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("exhibition")}
                  >
                    Exhibitions
                  </Button>
                  <Button
                    variant={filters.category === "sports" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("sports")}
                  >
                    Sports
                  </Button>
                  <Button
                    variant={filters.category === "workshop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter("workshop")}
                  >
                    Workshops
                  </Button>
                </div>
              </div>
              
              {sortedActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No events found</h3>
                  <p className="text-muted-foreground mt-2">
                    {filters.upcoming 
                      ? "There are no upcoming events matching your filters." 
                      : "No events match your filters."}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setFilters({ category: 'all', upcoming: true })}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedActivities.map((activity) => (
                    <Card key={activity.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className={`bg-${getCategoryColor(activity.category)}-100 dark:bg-${getCategoryColor(activity.category)}-950 p-6 md:w-48 flex flex-col justify-center items-center text-center`}>
                          <div className="text-xl font-bold">
                            {new Date(activity.date).getDate()}
                          </div>
                          <div className="text-sm">
                            {new Date(activity.date).toLocaleDateString(undefined, { month: 'short' })}
                          </div>
                          <div className="mt-2 text-sm">
                            {formatTime(activity.time)}
                          </div>
                        </div>
                        <CardContent className="p-6 flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <Badge className="capitalize">{activity.category}</Badge>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleBookmark(activity.id)}
                                title={bookmarkedEvents.includes(activity.id) ? "Remove from bookmarks" : "Add to bookmarks"}
                              >
                                {bookmarkedEvents.includes(activity.id) ? (
                                  <BookmarkCheck className="h-4 w-4" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => addToGoogleCalendar(activity)}
                                title="Add to Google Calendar"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                          <p className="text-muted-foreground mb-4">{activity.description}</p>
                          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center mb-1 sm:mb-0">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(activity.date)}
                            </div>
                            <div className="flex items-center mb-1 sm:mb-0">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatTime(activity.time)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {activity.location}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Info className="h-4 w-4 mr-1" />
                              {activity.clubName ? (
                                <span>Organized by: {activity.clubName}</span>
                              ) : (
                                <span>Added by: {activity.addedBy?.split('@')[0] || 'Admin'}</span>
                              )}
                            </div>
                            
                            <Button
                              variant={registeredEvents.includes(activity.id) ? "outline" : "default"}
                              size="sm"
                              onClick={() => registerForEvent(activity.id)}
                            >
                              {registeredEvents.includes(activity.id) ? "Registered" : "Register"}
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <EventCalendar events={activities} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
