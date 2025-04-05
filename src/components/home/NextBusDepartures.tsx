
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { busScheduleData } from "@/data/mock-data";
import { Link } from "react-router-dom";

const NextBusDepartures = () => {
  // Get next bus departures
  const getNextDepartures = () => {
    // Simulate next bus departures based on current time
    return busScheduleData.slice(0, 2);
  };
  
  const nextBusDepartures = getNextDepartures();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Next Bus Departures</h2>
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
          {nextBusDepartures.map((bus) => {
            // Check if first schedule item is an object with arrival property
            const firstSchedule = bus.schedule[0];
            const hasArrival = typeof firstSchedule === 'object' && 'arrival' in firstSchedule;
            
            return (
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
                  <p className="font-medium">
                    Next: {typeof firstSchedule === 'object' ? firstSchedule.departure : firstSchedule}
                  </p>
                  {hasArrival && (
                    <p className="text-sm text-muted-foreground">
                      Arrives: {(firstSchedule as {departure: string, arrival: string}).arrival}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextBusDepartures;
