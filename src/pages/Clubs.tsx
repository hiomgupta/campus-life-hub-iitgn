
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Award, Calendar, ChevronRight } from "lucide-react";
import { ClubInfo } from "@/types";
import { Link } from "react-router-dom";

// Sample club data
const initialClubs: ClubInfo[] = [
  {
    id: "1",
    name: "Robotics Club",
    description: "A community of robotics enthusiasts working on various robotics projects and participating in competitions.",
    category: "technical",
    coordinators: ["Aditya Sharma", "Priya Patel"],
    members: ["Member 1", "Member 2", "Member 3"],
    logo: "https://via.placeholder.com/60"
  },
  {
    id: "2",
    name: "Cultural Committee",
    description: "Organizes cultural events and festivals on campus to celebrate diversity and talent.",
    category: "cultural",
    coordinators: ["Rahul Mehta", "Sneha Gupta"],
    members: ["Member 1", "Member 2", "Member 3"],
    logo: "https://via.placeholder.com/60"
  },
  {
    id: "3",
    name: "Sports Club",
    description: "Promotes sports activities and organizes tournaments for various sports on campus.",
    category: "sports",
    coordinators: ["Rajiv Kumar", "Ananya Singh"],
    members: ["Member 1", "Member 2", "Member 3", "Member 4"],
    logo: "https://via.placeholder.com/60"
  },
  {
    id: "4",
    name: "Research Club",
    description: "Focused on promoting research culture among students through workshops and seminars.",
    category: "academic",
    coordinators: ["Dr. Neha Sharma", "Prof. Rajesh Verma"],
    members: ["Member 1", "Member 2"],
    logo: "https://via.placeholder.com/60"
  }
];

const getCategoryColor = (category: string) => {
  switch(category) {
    case "technical":
      return "blue";
    case "cultural":
      return "purple";
    case "sports":
      return "green";
    case "academic":
      return "amber";
    default:
      return "slate";
  }
};

const ClubCard = ({ club }: { club: ClubInfo }) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {club.logo ? (
            <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            <Users className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <CardTitle className="text-xl">{club.name}</CardTitle>
          <Badge className={`bg-${getCategoryColor(club.category)}-100 text-${getCategoryColor(club.category)}-800 hover:bg-${getCategoryColor(club.category)}-200`}>
            {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">{club.description}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>Coordinators: {club.coordinators.join(", ")}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Members: {club.members.length}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full" asChild>
        <Link to={`/clubs/${club.id}`}>
          View Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const Clubs = () => {
  const [clubs, setClubs] = useState<ClubInfo[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Get clubs data from localStorage or use initial data
    const storedClubs = localStorage.getItem("clubs_data");
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    } else {
      setClubs(initialClubs);
      localStorage.setItem("clubs_data", JSON.stringify(initialClubs));
    }
  }, []);
  
  const filteredClubs = clubs.filter(club => {
    const matchesFilter = filter === "all" || club.category === filter;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campus Clubs</h1>
        <p className="text-muted-foreground">
          Discover and join clubs at IITGN
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredClubs.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No clubs found</h3>
          <p className="text-muted-foreground">Try changing your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Clubs;
