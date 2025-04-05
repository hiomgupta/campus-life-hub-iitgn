
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Filter, CalendarDays } from "lucide-react";
import { CampusActivity } from "@/types";

const initialEvents: CampusActivity[] = [
  {
    id: "1",
    title: "Tech Club Meeting",
    description: "Weekly meeting of the technology club to discuss ongoing projects",
    date: "2025-04-05",
    time: "17:00",
    location: "Student Activity Center",
    category: "club"
  },
  {
    id: "2",
    title: "Cultural Night",
    description: "Annual cultural night featuring performances from various student groups",
    date: "2025-04-10",
    time: "19:00",
    location: "Auditorium",
    category: "event"
  },
  {
    id: "3",
    title: "Guest Lecture: AI Advancements",
    description: "Special lecture by Dr. Jane Smith on recent advancements in AI",
    date: "2025-04-12",
    time: "10:00",
    location: "Lecture Hall 1",
    category: "lecture"
  }
];

const Events = () => {
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [filters, setFilters] = useState({
    category: "all",
    upcoming: true
  });
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem("campus_activities_data");
    if (storedData) {
      setActivities(JSON.parse(storedData));
    } else {
      setActivities(initialEvents);
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
                      <div className="mb-1">
                        <Badge className="capitalize">{activity.category}</Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                      <p className="text-muted-foreground mb-4">{activity.description}</p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
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
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
