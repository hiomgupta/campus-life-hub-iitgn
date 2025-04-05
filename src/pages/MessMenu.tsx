
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { messMenuData } from "@/data/mock-data";
import { Coffee, Utensils, Pizza, Clock, ThumbsUp, ThumbsDown } from "lucide-react";

const MessMenu = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [ratings, setRatings] = useState<Record<string, { dish: string, rating: 'up' | 'down' | null }[]>>({});
  
  // Get current day of week
  function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  }
  
  // Handle rating a dish
  const rateDish = (meal: string, dish: string, rating: 'up' | 'down') => {
    const mealKey = `${activeDay}-${meal}`;
    
    setRatings(prev => {
      const mealRatings = prev[mealKey] || [];
      const existingRatingIndex = mealRatings.findIndex(r => r.dish === dish);
      
      if (existingRatingIndex >= 0) {
        // Toggle rating if clicking the same button
        if (mealRatings[existingRatingIndex].rating === rating) {
          mealRatings[existingRatingIndex].rating = null;
        } else {
          mealRatings[existingRatingIndex].rating = rating;
        }
      } else {
        mealRatings.push({ dish, rating });
      }
      
      return {
        ...prev,
        [mealKey]: mealRatings
      };
    });
  };
  
  // Check if a dish has a specific rating
  const hasRating = (meal: string, dish: string, rating: 'up' | 'down'): boolean => {
    const mealKey = `${activeDay}-${meal}`;
    const mealRatings = ratings[mealKey] || [];
    const dishRating = mealRatings.find(r => r.dish === dish);
    return dishRating?.rating === rating;
  };
  
  const renderMeal = (meal: string, dishes: string[]) => {
    const mealIcons: Record<string, React.ElementType> = {
      breakfast: Coffee,
      lunch: Utensils,
      dinner: Pizza
    };
    
    const MealIcon = mealIcons[meal] || Utensils;
    
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="capitalize flex items-center text-lg">
            <MealIcon className="mr-2 h-5 w-5" />
            {meal}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {meal === 'breakfast' ? '7:30 AM - 9:30 AM' : 
             meal === 'lunch' ? '12:30 PM - 2:30 PM' : 
             '7:30 PM - 9:30 PM'}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dishes.map((dish, idx) => (
              <li key={idx} className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/40">
                <span>{dish}</span>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${hasRating(meal, dish, 'up') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                    onClick={() => rateDish(meal, dish, 'up')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${hasRating(meal, dish, 'down') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''}`}
                    onClick={() => rateDish(meal, dish, 'down')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mess Menu</h1>
        <p className="text-muted-foreground">
          Weekly mess menu with daily updates
        </p>
      </div>
      
      <Tabs 
        defaultValue={getCurrentDay()} 
        className="w-full" 
        onValueChange={setActiveDay}
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-full sm:w-auto">
            <TabsTrigger value="monday">Monday</TabsTrigger>
            <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
            <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
            <TabsTrigger value="thursday">Thursday</TabsTrigger>
            <TabsTrigger value="friday">Friday</TabsTrigger>
            <TabsTrigger value="saturday">Saturday</TabsTrigger>
            <TabsTrigger value="sunday">Sunday</TabsTrigger>
          </TabsList>
        </div>
        
        {Object.entries(messMenuData).map(([day, meals]) => (
          <TabsContent key={day} value={day} className="space-y-6">
            {renderMeal('breakfast', meals.breakfast)}
            {renderMeal('lunch', meals.lunch)}
            {renderMeal('dinner', meals.dinner)}
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Feedback</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have suggestions for improving the mess menu? Let us know!
                  </p>
                  <Button>Provide Feedback</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MessMenu;
