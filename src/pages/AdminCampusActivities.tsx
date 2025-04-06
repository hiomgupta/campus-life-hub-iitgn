import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, Eye, CalendarRange, Image as ImageIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CampusActivity } from "@/types";
import EventCalendarView from "@/components/admin/EventCalendarView";

const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (HH:MM)"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  imageUrl: z.string().optional(),
});

const AdminCampusActivities = () => {
  const navigate = useNavigate();
  
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [editingActivity, setEditingActivity] = useState<CampusActivity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [clubName, setClubName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "18:00",
      location: "",
      category: "",
      imageUrl: "",
    },
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const role = localStorage.getItem("user_role");
    const email = localStorage.getItem("admin_email") || localStorage.getItem("user_email");
    const storedClubId = localStorage.getItem("club_id");
    const storedClubName = localStorage.getItem("club_name");
    
    if (!email) {
      navigate("/login");
      return;
    }
    
    setUserRole(role);
    setUserEmail(email);
    setClubId(storedClubId);
    setClubName(storedClubName);
    
    // Load existing activities
    const storedData = localStorage.getItem("campus_activities_data");
    
    if (storedData) {
      setActivities(JSON.parse(storedData));
    }
    
    // Reset form when the dialog is closed
    if (!isDialogOpen) {
      form.reset({
        title: "",
        description: "",
        date: new Date(),
        time: "18:00",
        location: "",
        category: "",
        imageUrl: "",
      });
      setEditingActivity(null);
      setImagePreview(null);
    }
  }, [navigate, isDialogOpen, form]);
  
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const activityData: CampusActivity = {
      id: editingActivity?.id || Math.random().toString(),
      title: data.title,
      description: data.description,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      location: data.location,
      category: data.category,
      addedBy: userEmail || "admin@iitgn.ac.in",
      clubId: clubId || undefined,
      clubName: clubName || undefined,
      imageUrl: data.imageUrl
    };
    
    if (editingActivity) {
      // Update existing activity
      const updatedActivities = activities.map((activity) =>
        activity.id === editingActivity.id ? activityData : activity
      );
      setActivities(updatedActivities);
      localStorage.setItem("campus_activities_data", JSON.stringify(updatedActivities));
      toast.success("Activity updated successfully");
    } else {
      // Add new activity
      const newActivities = [...activities, activityData];
      setActivities(newActivities);
      localStorage.setItem("campus_activities_data", JSON.stringify(newActivities));
      toast.success("Activity added successfully");
      
      // Create notifications for all users (in a real app this would go to specific users)
      createNotification({
        title: "New Event Added",
        message: `${clubName || 'Admin'} just added a new event: ${data.title}`,
        type: "event",
        relatedId: activityData.id
      });
    }
    
    setIsDialogOpen(false);
  };

  const createNotification = (notificationData: {
    title: string;
    message: string;
    type: "event" | "notice" | "reminder" | "urgent";
    relatedId?: string;
  }) => {
    // In a real app, we would create notifications for specific users
    // but for this demo, we'll create them for the current user
    const userId = localStorage.getItem("user_email") || "";
    if (!userId) return;
    
    const storedNotifications = localStorage.getItem(`notifications_${userId}`);
    let notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    const newNotification = {
      id: Math.random().toString(),
      userId,
      ...notificationData,
      date: new Date().toISOString(),
      read: false
    };
    
    notifications = [newNotification, ...notifications];
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
  };
  
  const handleEditActivity = (activity: CampusActivity) => {
    // Populate the form with existing data
    form.reset({
      title: activity.title,
      description: activity.description,
      date: new Date(activity.date),
      time: activity.time,
      location: activity.location,
      category: activity.category,
      imageUrl: activity.imageUrl || "",
    });
    
    if (activity.imageUrl) {
      setImagePreview(activity.imageUrl);
    }
    
    setEditingActivity(activity);
    setIsDialogOpen(true);
  };
  
  const handleDeleteActivity = (id: string) => {
    setActivityToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteActivity = () => {
    if (activityToDelete) {
      const updatedActivities = activities.filter((activity) => activity.id !== activityToDelete);
      setActivities(updatedActivities);
      localStorage.setItem("campus_activities_data", JSON.stringify(updatedActivities));
      toast.success("Activity deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // In a real app, you would upload this file to a server
      // Here we're just using a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        form.setValue("imageUrl", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Filter activities for club admins to only show their club activities
  const filteredActivities = userRole === "clubAdmin" && clubId 
    ? activities.filter(activity => activity.clubId === clubId)
    : activities;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Campus Activities</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Activity
          </Button>
        </div>
        <p className="text-muted-foreground">
          Manage events and activities on campus
        </p>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>
                {userRole === "clubAdmin" 
                  ? `Showing activities for ${clubName || "your club"}` 
                  : "Showing all campus activities"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivities.length === 0 ? (
                <Alert>
                  <AlertTitle>No activities found</AlertTitle>
                  <AlertDescription>
                    Add your first campus activity by clicking the "Add New Activity" button.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Category</TableHead>
                        {userRole === "admin" && <TableHead>Added By</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => {
                        const eventDate = new Date(activity.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = eventDate < today;
                        
                        return (
                          <TableRow key={activity.id} className={isPast ? "opacity-60" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                {activity.title}
                                {activity.imageUrl && (
                                  <span className="text-xs text-muted-foreground flex items-center mt-1">
                                    <ImageIcon className="h-3 w-3 mr-1" />
                                    Has image
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{format(new Date(activity.date), "PPP")}</span>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                            </TableCell>
                            <TableCell>{activity.location}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {activity.category}
                              </Badge>
                            </TableCell>
                            {userRole === "admin" && (
                              <TableCell>
                                {activity.clubName || activity.addedBy?.split('@')[0] || "Admin"}
                              </TableCell>
                            )}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditActivity(activity)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteActivity(activity.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate("/events")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <EventCalendarView 
            activities={filteredActivities} 
            userRole={userRole} 
            clubName={clubName} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Activity Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
            <DialogDescription>
              {editingActivity 
                ? "Update details of this campus activity"
                : "Fill in the details to create a new campus activity"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tech Fest 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              // Can't select dates in the past
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (24-hour format)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 18:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lecture Hall 1" {...field} />
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="club">Club Meeting</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the activity..."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel htmlFor="image">Event Poster Image (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="w-full"
                    onChange={handleImageUpload}
                  />
                </div>
                
                {imagePreview && (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 object-contain mx-auto"
                    />
                    <div className="p-2 bg-muted/20 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue("imageUrl", "");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingActivity ? "Update Activity" : "Add Activity"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteActivity}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampusActivities;
