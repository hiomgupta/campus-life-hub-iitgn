
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { busScheduleData } from "@/data/mock-data";

interface BusRoute {
  id: string;
  route: string;
  type: string;
  status: string;
  schedule: (string | { arrival: string; departure: string })[];
}

const AdminBusSchedule = () => {
  const navigate = useNavigate();
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedData = localStorage.getItem("bus_schedule_data");
    if (storedData) {
      setBusRoutes(JSON.parse(storedData));
    } else {
      setBusRoutes(busScheduleData);
    }
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem("bus_schedule_data", JSON.stringify(busRoutes));
    toast.success("Bus schedule saved successfully");
    setIsEditing(false);
  };

  const handleAddRoute = () => {
    const newRoute: BusRoute = {
      id: Date.now().toString(),
      route: "New Route",
      type: "Shuttle",
      status: "On Time",
      schedule: ["08:00 AM", "10:00 AM", "12:00 PM"]
    };
    
    setBusRoutes([...busRoutes, newRoute]);
    setIsEditing(true);
  };

  const handleRemoveRoute = (id: string) => {
    setBusRoutes(busRoutes.filter(route => route.id !== id));
    setIsEditing(true);
  };

  const handleUpdateRoute = (id: string, field: keyof BusRoute, value: any) => {
    setBusRoutes(busRoutes.map(route => {
      if (route.id === id) {
        return { ...route, [field]: value };
      }
      return route;
    }));
    setIsEditing(true);
  };

  const handleUpdateSchedule = (routeId: string, index: number, value: string) => {
    setBusRoutes(busRoutes.map(route => {
      if (route.id === routeId) {
        const newSchedule = [...route.schedule];
        
        // Handle string or object schedule item
        if (typeof newSchedule[index] === 'string') {
          newSchedule[index] = value;
        } else {
          // Update the departure time for objects
          newSchedule[index] = {
            ...newSchedule[index] as { arrival: string; departure: string },
            departure: value
          };
        }
        
        return { ...route, schedule: newSchedule };
      }
      return route;
    }));
    setIsEditing(true);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Bus Schedule</h1>
          <p className="text-muted-foreground">
            Update campus bus timings and routes
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddRoute}>
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
        {isEditing && (
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bus Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {busRoutes.map((route) => (
              <Card key={route.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Input 
                      value={route.route}
                      onChange={(e) => handleUpdateRoute(route.id, 'route', e.target.value)}
                      className="font-medium text-lg w-1/2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRoute(route.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">Bus Type</label>
                      <Select 
                        value={route.type}
                        onValueChange={(value) => handleUpdateRoute(route.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shuttle">Shuttle</SelectItem>
                          <SelectItem value="Express">Express</SelectItem>
                          <SelectItem value="Special">Special</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={route.status}
                        onValueChange={(value) => handleUpdateRoute(route.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On Time">On Time</SelectItem>
                          <SelectItem value="Delayed">Delayed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Schedule</label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {route.schedule.map((time, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input 
                                value={typeof time === 'string' ? time : time.departure}
                                onChange={(e) => handleUpdateSchedule(route.id, index, e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newSchedule = route.schedule.filter((_, i) => i !== index);
                                  handleUpdateRoute(route.id, 'schedule', newSchedule);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        const newSchedule = [...route.schedule, "00:00 AM"];
                        handleUpdateRoute(route.id, 'schedule', newSchedule);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBusSchedule;
