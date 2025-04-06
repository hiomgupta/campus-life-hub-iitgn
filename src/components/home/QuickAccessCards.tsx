
import { Bus, CalendarDays, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const QuickAccessCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/bus-schedule" className="border rounded-lg p-4 hover:bg-muted/50 group">
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
      
      <Link to="/mess-menu" className="border rounded-lg p-4 hover:bg-muted/50 group">
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
      
      <Link to="/events" className="border rounded-lg p-4 hover:bg-muted/50 group">
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
  );
};

export default QuickAccessCards;
