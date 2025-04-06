
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bookmark, Calendar, CheckCircle, Clock, MapPin, User, Bell, BookmarkX } from "lucide-react";
import { CampusActivity, Notice, EventRegistration } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<CampusActivity[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<CampusActivity[]>([]);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [allEvents, setAllEvents] = useState<CampusActivity[]>([]);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [clubMemberships, setClubMemberships] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    if (!email) {
      navigate("/login");
      return;
    }
    setUserEmail(email);
    setUserName(name || email.split("@")[0]);
    
    // Load events from localStorage
    const storedEvents = localStorage.getItem("campus_activities_data");
    const events: CampusActivity[] = storedEvents 
      ? JSON.parse(storedEvents) 
      : [];
    setAllEvents(events);
    
    // Load notices from localStorage
    const storedNotices = localStorage.getItem("notices_data");
    const notices: Notice[] = storedNotices 
      ? JSON.parse(storedNotices)
      : [];
    setAllNotices(notices);
    
    // Load user profile data
    const storedUserData = localStorage.getItem(`user_profile_${email}`);
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserBookmarks(userData.bookmarks || []);
      setClubMemberships(userData.clubMemberships || []);
    } else {
      // Create user profile if it doesn't exist
      const newUserProfile = {
        id: Math.random().toString(),
        email,
        name: name || email.split("@")[0],
        role: "student",
        clubMemberships: [],
        interests: [],
        bookmarks: []
      };
      localStorage.setItem(`user_profile_${email}`, JSON.stringify(newUserProfile));
      setUserBookmarks([]);
      setClubMemberships([]);
    }
    
    // Load event registrations
    const storedRegistrations = localStorage.getItem("event_registrations");
    const registrations: EventRegistration[] = storedRegistrations
      ? JSON.parse(storedRegistrations)
      : [];
    
    const userRegistrations = registrations.filter(reg => reg.userId === email && reg.status === "registered");
    const userRegisteredEvents = events.filter(event => 
      userRegistrations.some(reg => reg.eventId === event.id)
    );
    setRegisteredEvents(userRegisteredEvents);
    
  }, [navigate]);
  
  useEffect(() => {
    // Filter bookmarked events and notices
    const bookmarkedEvts = allEvents.filter(event => userBookmarks.includes(event.id));
    const bookmarkedNtcs = allNotices.filter(notice => userBookmarks.includes(notice.id));
    
    setBookmarkedEvents(bookmarkedEvts);
    setBookmarkedNotices(bookmarkedNtcs);
  }, [userBookmarks, allEvents, allNotices]);

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const toggleBookmark = (id: string, type: 'event' | 'notice') => {
    const newBookmarks = userBookmarks.includes(id)
      ? userBookmarks.filter(b => b !== id)
      : [...userBookmarks, id];
      
    setUserBookmarks(newBookmarks);
    
    // Update user profile in localStorage
    const email = localStorage.getItem("user_email");
    if (email) {
      const storedUserData = localStorage.getItem(`user_profile_${email}`);
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userData.bookmarks = newBookmarks;
        localStorage.setItem(`user_profile_${email}`, JSON.stringify(userData));
      }
    }
    
    toast.success(userBookmarks.includes(id) 
      ? `${type === 'event' ? 'Event' : 'Notice'} removed from bookmarks` 
      : `${type === 'event' ? 'Event' : 'Notice'} added to bookmarks`);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!userEmail) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {userName || userEmail.split("@")[0]}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {userEmail}
        </p>
      </div>

      <Tabs defaultValue="registered">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarks</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registered" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Your Registered Events</h2>
          
          {registeredEvents.length === 0 ? (
            <Alert>
              <AlertDescription className="flex flex-col items-center justify-center py-6">
                <Calendar className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                <p className="text-lg font-medium">No registered events</p>
                <p className="text-muted-foreground text-center mt-1 mb-4">
                  You haven't registered for any events yet.
                </p>
                <Button onClick={() => navigate('/events')}>Browse Events</Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {registeredEvents.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex flex-col">
                    <div className="bg-primary-50 dark:bg-primary-950 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-sm ml-1">
                          {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                      </div>
                      <Badge className="capitalize">{event.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                          <div className="text-sm text-muted-foreground mb-2">{event.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => toggleBookmark(event.id, 'event')}
                        >
                          {userBookmarks.includes(event.id) ? <BookmarkX size={18} /> : <Bookmark size={18} />}
                        </Button>
                      </div>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(event.time)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Registered
                        </Badge>
                        <Button size="sm" onClick={() => navigate(`/events`)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookmarked" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mt-4">Bookmarked Events</h2>
            
            {bookmarkedEvents.length === 0 ? (
              <Alert className="mt-2">
                <AlertDescription className="py-2">
                  You haven't bookmarked any events yet.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                {bookmarkedEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col">
                      <div className="bg-primary-50 dark:bg-primary-950 p-4 flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-sm ml-1">
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                          </span>
                        </div>
                        <Badge className="capitalize">{event.category}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                            <div className="text-sm text-muted-foreground mb-2">{event.description}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => toggleBookmark(event.id, 'event')}
                          >
                            <BookmarkX size={18} />
                          </Button>
                        </div>
                        <div className="flex flex-col text-sm text-muted-foreground">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(event.time)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" onClick={() => navigate(`/events`)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <h2 className="text-xl font-semibold mt-6">Bookmarked Notices</h2>
            
            {bookmarkedNotices.length === 0 ? (
              <Alert className="mt-2">
                <AlertDescription className="py-2">
                  You haven't bookmarked any notices yet.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 mt-2">
                {bookmarkedNotices.map(notice => (
                  <Card key={notice.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{notice.category}</Badge>
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(notice.date)} • Posted by {notice.postedBy}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(notice.id, 'notice')}
                        >
                          <BookmarkX size={18} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{notice.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Name: {userName}</p>
                  <p className="text-sm text-muted-foreground">Email: {userEmail}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Club Memberships</h3>
                  {clubMemberships.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {clubMemberships.map((club, index) => (
                        <Badge key={index} variant="secondary">{club}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You're not a member of any clubs yet
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Notification Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-sm">Event Reminders</span>
                      </div>
                      <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-sm">Urgent Notices</span>
                      </div>
                      <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-sm">Club Updates</span>
                      </div>
                      <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
