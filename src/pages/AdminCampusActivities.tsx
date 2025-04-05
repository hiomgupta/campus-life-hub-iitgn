
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { CampusActivity } from "@/types";

// Sample initial data
const initialCampusActivities: CampusActivity[] = [
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

const AdminCampusActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<CampusActivity>({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "event"
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem("campus_activities_data");
    if (storedData) {
      setActivities(JSON.parse(storedData));
    } else {
      setActivities(initialCampusActivities);
    }
  }, []);

  const handleSaveActivity = () => {
    if (isEditing) {
      // Update existing activity
      setActivities(activities.map(activity => 
        activity.id === currentActivity.id ? currentActivity : activity
      ));
    } else {
      // Add new activity
      const newActivity: CampusActivity = {
        ...currentActivity,
        id: `activity-${Date.now()}`
      };
      setActivities([...activities, newActivity]);
    }
    
    // Save to localStorage
    localStorage.setItem("campus_activities_data", JSON.stringify(
      isEditing 
        ? activities.map(activity => activity.id === currentActivity.id ? currentActivity : activity)
        : [...activities, {...currentActivity, id: `activity-${Date.now()}`}]
    ));
    
    toast.success(isEditing ? "Activity updated successfully" : "Activity added successfully");
    resetForm();
    setIsDialogOpen(false);
  };

  const editActivity = (activity: CampusActivity) => {
    setCurrentActivity(activity);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const deleteActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem("campus_activities_data", JSON.stringify(updatedActivities));
    toast.success("Activity deleted successfully");
  };

  const resetForm = () => {
    setCurrentActivity({
      id: "",
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "event"
    });
    setIsEditing(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
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
          <h1 className="text-3xl font-bold tracking-tight">What's On Campus</h1>
          <p className="text-muted-foreground">
            Manage campus activities and events
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Activity" : "Add New Activity"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input 
                  placeholder="Activity title"
                  value={currentActivity.title}
                  onChange={(e) => setCurrentActivity({...currentActivity, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea 
                  placeholder="Activity description"
                  value={currentActivity.description}
                  onChange={(e) => setCurrentActivity({...currentActivity, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input 
                    type="date"
                    value={currentActivity.date}
                    onChange={(e) => setCurrentActivity({...currentActivity, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time</label>
                  <Input 
                    type="time"
                    value={currentActivity.time}
                    onChange={(e) => setCurrentActivity({...currentActivity, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input 
                  placeholder="Activity location"
                  value={currentActivity.location}
                  onChange={(e) => setCurrentActivity({...currentActivity, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select 
                  value={currentActivity.category}
                  onValueChange={(value) => setCurrentActivity({...currentActivity, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="club">Club Meeting</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={handleSaveActivity}>
                {isEditing ? "Update Activity" : "Add Activity"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()} at {activity.time}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell className="capitalize">{activity.category}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editActivity(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteActivity(activity.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampusActivities;
