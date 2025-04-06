
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CalendarDays, MapPin } from "lucide-react";

const CampusHighlights = () => {
  return (
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
  );
};

export default CampusHighlights;
