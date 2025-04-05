
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bookmark, Calendar, CheckCircle, Clock, MapPin, User, Mail, Phone, Home, Cake, BookmarkX, GraduationCap, Award } from "lucide-react";
import { CampusActivity, Notice } from "@/types";
import { toast } from "sonner";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<CampusActivity[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<CampusActivity[]>([]);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [allEvents, setAllEvents] = useState<CampusActivity[]>([]);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("user_email");
    if (!email) {
      navigate("/login");
      return;
    }
    setUserEmail(email);
    
    // Load user profile
    const storedUserProfile = localStorage.getItem(`user_profile_${email}`);
    if (storedUserProfile) {
      const userData = JSON.parse(storedUserProfile);
      setUserProfile(userData);
      setUserName(userData.name || email.split("@")[0]);
      setUserBookmarks(userData.bookmarks || []);
    } else {
      setUserName(localStorage.getItem("user_name") || email.split("@")[0]);
    }
    
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
    
    // Load event registrations
    const storedRegistrations = localStorage.getItem("event_registrations");
    const registrations = storedRegistrations
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

  if (!userEmail || !userProfile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <Card className="md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Student Profile</CardTitle>
            <CardDescription>Personal information and academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-lg font-medium">{userProfile.rollNumber}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{userProfile.program}</p>
                  <p className="text-sm text-muted-foreground">{userProfile.year}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p>{userProfile.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p>{userProfile.phone}</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p>{userProfile.hostel}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Cake className="h-5 w-5 text-muted-foreground" />
                <p>Joined: {userProfile.joinedDate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-2">Club Memberships</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.clubMemberships && userProfile.clubMemberships.length > 0 ? (
                  userProfile.clubMemberships.map((club: string, index: number) => (
                    <Badge key={index} variant="secondary">{club}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No club memberships</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Areas of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests && userProfile.interests.length > 0 ? (
                  userProfile.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests specified</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="registered">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="registered">Registered Events</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
