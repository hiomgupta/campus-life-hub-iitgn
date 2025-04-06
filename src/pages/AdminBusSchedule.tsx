
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { busScheduleData } from "@/data/mock-data";
import { BusRoute } from "@/types";

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
      // Type cast to match our BusRoute type
      setBusRoutes(busScheduleData as BusRoute[]);
    }
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem("bus_schedule_data", JSON.stringify(busRoutes));
    toast.success("Bus schedule saved successfully");
    setIsEditing(false);
  };

  const handleAddRoute = () => {
    const newRoute: BusRoute = {
      id: `route-${Date.now()}`,
      route: "New Route",
      schedule: ["08:00 AM"],
      status: "On Time",
      type: "Regular"
    };
    
    setBusRoutes([...busRoutes, newRoute]);
    setIsEditing(true);
  };

  const handleAddScheduleTime = (routeIndex: number) => {
    const updatedRoutes = [...busRoutes];
    
    // Check if the schedule contains objects or strings
    const currentSchedule = updatedRoutes[routeIndex].schedule;
    const hasObjects = currentSchedule.some(item => typeof item === 'object');
    
    if (hasObjects) {
      updatedRoutes[routeIndex].schedule.push({
        departure: "00:00 AM",
        arrival: "00:00 AM"
      });
    } else {
      updatedRoutes[routeIndex].schedule.push("00:00 AM");
    }
    
    setBusRoutes(updatedRoutes);
    setIsEditing(true);
  };

  const handleRemoveScheduleTime = (routeIndex: number, scheduleIndex: number) => {
    const updatedRoutes = [...busRoutes];
    updatedRoutes[routeIndex].schedule = 
      updatedRoutes[routeIndex].schedule.filter((_, i) => i !== scheduleIndex);
    
    setBusRoutes(updatedRoutes);
    setIsEditing(true);
  };

  const handleRemoveRoute = (index: number) => {
    setBusRoutes(busRoutes.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  const handleUpdateSchedule = (routeIndex: number, scheduleIndex: number, field: 'departure' | 'arrival', value: string) => {
    const updatedRoutes = [...busRoutes];
    const schedule = updatedRoutes[routeIndex].schedule;
    
    if (typeof schedule[scheduleIndex] === 'string') {
      if (field === 'departure') {
        updatedRoutes[routeIndex].schedule[scheduleIndex] = value;
      }
    } else if (typeof schedule[scheduleIndex] === 'object') {
      const scheduleItem = schedule[scheduleIndex] as { departure: string; arrival: string };
      scheduleItem[field] = value;
    }
    
    setBusRoutes(updatedRoutes);
    setIsEditing(true);
  };

  const handleUpdateRouteField = (index: number, field: keyof BusRoute, value: string) => {
    const updatedRoutes = [...busRoutes];
    
    if (field !== 'schedule') {
      updatedRoutes[index][field] = value;
    }
    
    setBusRoutes(updatedRoutes);
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
          <h1 className="text-3xl font-bold tracking-tight">Bus Schedule Editor</h1>
          <p className="text-muted-foreground">
            Update campus bus timings
          </p>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {busRoutes.map((route, routeIndex) => (
          <Card key={route.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>
                  <Input 
                    value={route.route}
                    onChange={(e) => handleUpdateRouteField(routeIndex, 'route', e.target.value)}
                    className="font-bold text-lg"
                  />
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRoute(routeIndex)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Select
                    value={route.status}
                    onValueChange={(value) => handleUpdateRouteField(routeIndex, 'status', value)}
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
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <Select
                    value={route.type}
                    onValueChange={(value) => handleUpdateRouteField(routeIndex, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Express">Express</SelectItem>
                      <SelectItem value="Weekend">Weekend</SelectItem>
                      <SelectItem value="Special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departure Time</TableHead>
                    {typeof route.schedule[0] === 'object' && <TableHead>Arrival Time</TableHead>}
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {route.schedule.map((scheduleItem, scheduleIndex) => (
                    <TableRow key={scheduleIndex}>
                      <TableCell>
                        <Input 
                          value={typeof scheduleItem === 'string' ? scheduleItem : scheduleItem.departure}
                          onChange={(e) => handleUpdateSchedule(routeIndex, scheduleIndex, 'departure', e.target.value)}
                        />
                      </TableCell>
                      {typeof scheduleItem === 'object' && (
                        <TableCell>
                          <Input 
                            value={scheduleItem.arrival}
                            onChange={(e) => handleUpdateSchedule(routeIndex, scheduleIndex, 'arrival', e.target.value)}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveScheduleTime(routeIndex, scheduleIndex)}
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
                onClick={() => handleAddScheduleTime(routeIndex)}
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={handleAddRoute} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </Button>
      </div>
    </div>
  );
};

export default AdminBusSchedule;
