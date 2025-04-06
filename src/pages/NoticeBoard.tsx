
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Bell, Calendar, Pin, Clock } from "lucide-react";
import { Notice } from "@/types";
import { format } from "date-fns";

// Sample notices
const initialNotices: Notice[] = [
  {
    id: "1",
    title: "Mid-semester Examination Schedule",
    content: "Mid-semester examinations will be held from October 10-15, 2025. Please check your email for detailed schedule.",
    category: "academic",
    date: "2025-04-01",
    postedBy: "Academic Office",
    important: true
  },
  {
    id: "2",
    title: "Tuition Fee Payment Deadline",
    content: "The deadline for payment of tuition fees for the semester is April 30, 2025. Late payment will incur a penalty.",
    category: "fee",
    date: "2025-04-02",
    postedBy: "Accounts Department",
    important: true
  },
  {
    id: "3",
    title: "Cultural Night - Save the Date",
    content: "The annual cultural night will be held on April 20, 2025 at the Auditorium. All students are welcome to participate.",
    category: "club",
    date: "2025-04-03",
    postedBy: "Cultural Committee",
    important: false
  },
  {
    id: "4",
    title: "Campus Maintenance Update",
    content: "The main library will be closed for renovation from April 5-10, 2025. Temporary reading room will be set up in the Old Academic Block.",
    category: "campus",
    date: "2025-04-04",
    postedBy: "Campus Maintenance",
    important: false
  },
  {
    id: "5",
    title: "Weather Alert - Heavy Rain Expected",
    content: "Heavy rain is expected in the region over the weekend. Students are advised to take necessary precautions.",
    category: "emergency",
    date: "2025-04-05",
    postedBy: "Security Office",
    important: true
  }
];

const getCategoryColor = (category: string) => {
  switch(category) {
    case "academic":
      return "blue";
    case "fee":
      return "red";
    case "club":
      return "purple";
    case "campus":
      return "green";
    case "emergency":
      return "orange";
    default:
      return "slate";
  }
};

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "academic":
      return <Calendar className="h-4 w-4" />;
    case "fee":
      return <AlertCircle className="h-4 w-4" />;
    case "club":
      return <Bell className="h-4 w-4" />;
    case "campus":
      return <Pin className="h-4 w-4" />;
    case "emergency":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const NoticeCard = ({ notice }: { notice: Notice }) => {
  const formattedDate = format(new Date(notice.date), "MMMM d, yyyy");
  
  return (
    <Card className={`${notice.important ? 'border-l-4 border-red-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`bg-${getCategoryColor(notice.category)}-100 text-${getCategoryColor(notice.category)}-800 hover:bg-${getCategoryColor(notice.category)}-200`}>
                {getCategoryIcon(notice.category)}
                <span className="ml-1 capitalize">{notice.category}</span>
              </Badge>
              {notice.important && (
                <Badge variant="outline" className="text-red-500 border-red-200">
                  Important
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{notice.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{notice.content}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {formattedDate}
          </div>
          <div>Posted by: {notice.postedBy}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Get notices data from localStorage or use initial data
    const storedNotices = localStorage.getItem("notices_data");
    if (storedNotices) {
      setNotices(JSON.parse(storedNotices));
    } else {
      setNotices(initialNotices);
      localStorage.setItem("notices_data", JSON.stringify(initialNotices));
    }
  }, []);
  
  const filteredNotices = notices
    .filter(notice => {
      const matchesFilter = filter === "all" || notice.category === filter;
      const matchesSearch = 
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by importance first, then by date (newest first)
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
        <p className="text-muted-foreground">
          Stay updated with important announcements
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid grid-cols-6 w-full max-w-2xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="fee">Fee</TabsTrigger>
            <TabsTrigger value="club">Club</TabsTrigger>
            <TabsTrigger value="campus">Campus</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredNotices.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No notices found</h3>
          <p className="text-muted-foreground">Try changing your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
