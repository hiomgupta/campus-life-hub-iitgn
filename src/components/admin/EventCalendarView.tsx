
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { CampusActivity } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarRange } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EventCalendarViewProps {
  activities: CampusActivity[];
  userRole?: string | null;
  clubName?: string | null;
}

const EventCalendarView = ({ activities, userRole, clubName }: EventCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  
  // Get activities for the selected day
  const selectedDayActivities = activities.filter(activity => 
    format(new Date(activity.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Get upcoming activities (from today onwards)
  const upcomingActivities = activities
    .filter(activity => new Date(activity.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  // Function to get activity dates for highlighting in calendar
  const getActivityDates = () => {
    return activities.map(activity => new Date(activity.date));
  };
  
  // Custom modifier for days with events
  const activityDates = getActivityDates();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarRange className="mr-2 h-5 w-5" />
          Activity Calendar View
        </CardTitle>
        <CardDescription>
          {userRole === "clubAdmin" 
            ? `Calendar of activities for ${clubName || "your club"}` 
            : "Calendar of all campus activities"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                event: activityDates
              }}
              modifiersStyles={{
                event: { 
                  fontWeight: 'bold',
                  border: '2px solid currentColor',
                  color: 'var(--primary)'
                }
              }}
            />
          </div>
          
          <div className="space-y-4">
            {selectedDayActivities.length > 0 ? (
              <div>
                <h3 className="font-medium mb-2">
                  Events on {format(selectedDate, "PPP")}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedDayActivities.map(activity => (
                    <div key={activity.id} className="p-2 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{activity.title}</div>
                        <Badge variant="outline" className="capitalize">
                          {activity.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {activity.time} • {activity.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-muted/20">
                <p>No events scheduled for {format(selectedDate, "PPP")}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Upcoming Activities</h3>
              {upcomingActivities.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {upcomingActivities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-center p-2 border rounded-md">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(activity.date), "PPP")} • {activity.time}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md bg-muted/20">
                  <p>No upcoming activities scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendarView;
