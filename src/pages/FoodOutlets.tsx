
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, MapPin, Star } from "lucide-react";
import { foodOutletsData } from "@/data/mock-data";
import { FoodOutlet, STORAGE_KEYS } from "@/types";

const FoodOutlets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [outlets, setOutlets] = useState<FoodOutlet[]>([]);
  
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEYS.FOOD_OUTLETS);
    if (storedData) {
      setOutlets(JSON.parse(storedData));
    } else {
      // Make sure the mock data has menu property
      const formattedData = foodOutletsData.map(outlet => ({
        ...outlet,
        menu: outlet.menu || []
      }));
      setOutlets(formattedData);
      localStorage.setItem(STORAGE_KEYS.FOOD_OUTLETS, JSON.stringify(formattedData));
    }
  }, []);
  
  const allCuisines = Array.from(
    new Set(
      outlets.flatMap(outlet => outlet.cuisine || [])
    )
  );
  
  const filteredOutlets = outlets.filter(outlet => {
    const matchesSearch = outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outlet.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outlet.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = cuisineFilter === "All" || 
                          (outlet.cuisine && outlet.cuisine.some(c => c === cuisineFilter));
                          
    return matchesSearch && matchesCuisine;
  });
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="relative">
            <Star className="h-4 w-4 text-muted" />
            <Star className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400 overflow-hidden w-[50%]" />
          </span>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Food Outlets</h1>
        <p className="text-muted-foreground">
          Explore campus food options and menus
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Find Food Outlets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="outlet-search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="outlet-search"
                  placeholder="Search by name or location..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cuisine-filter">Filter by Cuisine</Label>
              <Select 
                defaultValue="All" 
                onValueChange={setCuisineFilter}
              >
                <SelectTrigger id="cuisine-filter">
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cuisines</SelectItem>
                  {allCuisines.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4 pt-4">
          {filteredOutlets.length > 0 ? (
            filteredOutlets.map(outlet => (
              <Card key={outlet.id} className="overflow-hidden">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="md:col-span-2 bg-muted h-full flex items-center justify-center p-6">
                    <div className="text-4xl font-bold text-muted-foreground">
                      {outlet.name.charAt(0)}
                    </div>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{outlet.name}</h3>
                      {renderRatingStars(outlet.rating)}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{outlet.location}</span>
                      <span className="mx-2">•</span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{outlet.hours}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm">{outlet.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{outlet.type}</Badge>
                      {outlet.cuisine && outlet.cuisine.map(cuisine => (
                        <Badge 
                          key={cuisine} 
                          variant="secondary"
                          className={cuisineFilter === cuisine ? "bg-primary text-primary-foreground" : ""}
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No food outlets found matching your criteria
            </div>
          )}
        </TabsContent>
        <TabsContent value="map" className="pt-4">
          <Card className="border shadow-sm">
            <div className="aspect-[16/9] relative bg-muted flex items-center justify-center p-6">
              <div className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">Food Outlets Map</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive map view coming soon
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodOutlets;
