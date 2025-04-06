
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CampusActivity } from "@/types";
import { format } from "date-fns";

interface EventCalendarProps {
  events: CampusActivity[];
}

const EventCalendar = ({ events }: EventCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group events by date
  const eventsByDate = events.reduce((acc: Record<string, CampusActivity[]>, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  // Get events for selected date
  const getEventsForDate = (date: Date | undefined): CampusActivity[] => {
    if (!date) return [];
    
    const formattedDate = format(date, "yyyy-MM-dd");
    return eventsByDate[formattedDate] || [];
  };

  const selectedEvents = getEventsForDate(selectedDate);

  // Function to add event to Google Calendar
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

  // Get modifiers for dates with events to style them in the calendar
  const getModifiers = () => {
    const datesWithEvents = Object.keys(eventsByDate).map(dateStr => new Date(dateStr));
    
    return {
      hasEvent: datesWithEvents
    };
  };

  // Style for dates with events
  const modifiersStyles = {
    hasEvent: {
      fontWeight: 'bold',
      color: 'var(--primary)',
      backgroundColor: 'var(--primary/10)'
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Event Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="p-4 flex justify-center border-b md:border-b-0 md:border-r">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={getModifiers()}
              modifiersStyles={modifiersStyles}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2 flex items-center justify-between">
              <span>
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </span>
              <span className="text-sm text-muted-foreground">
                {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}
              </span>
            </h3>
            
            {selectedEvents.length > 0 ? (
              <div className="space-y-3 mt-3">
                {selectedEvents.map((event) => (
                  <Card key={event.id} className="p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {`${event.time} • ${event.location}`}
                          {event.addedBy && (
                            <span> • Added by: {event.addedBy}</span>
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => addToGoogleCalendar(event)}
                        title="Add to Google Calendar"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                <Plus className="h-10 w-10 mb-2 opacity-20" />
                <p>No events scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
