
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Save, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CampusActivity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

const AdminCampusActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
      location: "",
      description: "",
      category: "Talk",
    },
  });

  useEffect(() => {
    // Load data from localStorage or initialize with empty array
    const storedData = localStorage.getItem("campus_activities");
    if (storedData) {
      setActivities(JSON.parse(storedData));
    } else {
      // Initialize with some example data
      const initialData: CampusActivity[] = [
        {
          id: "1",
          title: "Guest Lecture: AI Ethics",
          date: "2025-04-15",
          time: "15:00",
          location: "Lecture Hall 1",
          description: "A discussion on ethical considerations in AI development",
          category: "Talk"
        },
        {
          id: "2",
          title: "Art Exhibition",
          date: "2025-04-20",
          time: "10:00",
          location: "Student Center",
          description: "Showcasing student artwork from all departments",
          category: "Exhibition"
        }
      ];
      
      setActivities(initialData);
      localStorage.setItem("campus_activities", JSON.stringify(initialData));
    }
  }, []);

  const handleSaveActivities = () => {
    localStorage.setItem("campus_activities", JSON.stringify(activities));
    toast.success("Campus activities saved successfully");
  };

  const handleAddActivity = (data: z.infer<typeof formSchema>) => {
    const newActivity: CampusActivity = {
      id: Date.now().toString(),
      ...data
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem("campus_activities", JSON.stringify(updatedActivities));
    
    setIsAddingActivity(false);
    form.reset();
    toast.success("Activity added successfully");
  };

  const handleEditActivity = (activity: CampusActivity) => {
    setEditingActivity(activity.id);
    form.reset({
      title: activity.title,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      description: activity.description,
      category: activity.category,
    });
    setIsAddingActivity(true);
  };

  const handleUpdateActivity = (data: z.infer<typeof formSchema>) => {
    if (!editingActivity) return;
    
    const updatedActivities = activities.map(activity => {
      if (activity.id === editingActivity) {
        return {
          ...activity,
          ...data
        };
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    localStorage.setItem("campus_activities", JSON.stringify(updatedActivities));
    
    setIsAddingActivity(false);
    setEditingActivity(null);
    form.reset();
    toast.success("Activity updated successfully");
  };

  const handleDeleteActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem("campus_activities", JSON.stringify(updatedActivities));
    toast.success("Activity deleted successfully");
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingActivity) {
      handleUpdateActivity(data);
    } else {
      handleAddActivity(data);
    }
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

      <div className="flex justify-between">
        <Button onClick={() => {
          form.reset();
          setEditingActivity(null);
          setIsAddingActivity(!isAddingActivity);
        }}>
          {isAddingActivity ? "Cancel" : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </>
          )}
        </Button>
        <Button onClick={handleSaveActivities}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {isAddingActivity && (
        <Card>
          <CardHeader>
            <CardTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Activity title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Talk">Talk</SelectItem>
                            <SelectItem value="Exhibition">Exhibition</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Activity location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the activity" 
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {editingActivity ? "Update Activity" : "Add Activity"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No activities added yet
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>{activity.time}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditActivity(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampusActivities;
