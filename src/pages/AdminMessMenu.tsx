
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { messMenuData } from "@/data/mock-data";

// Define interfaces to match the messMenuData structure
type MessDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MessMenuType {
  [key: MessDay]: {
    [key in MealType]: string[];
  };
}

const AdminMessMenu = () => {
  const navigate = useNavigate();
  const [messMenu, setMessMenu] = useState<MessMenuType>({} as MessMenuType);
  const [activeDay, setActiveDay] = useState<MessDay>('monday');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedData = localStorage.getItem("mess_menu_data");
    if (storedData) {
      setMessMenu(JSON.parse(storedData));
    } else {
      setMessMenu(messMenuData);
    }
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem("mess_menu_data", JSON.stringify(messMenu));
    toast.success("Mess menu saved successfully");
    setIsEditing(false);
  };

  const handleAddDish = (day: MessDay, meal: MealType) => {
    const updatedMenu = { ...messMenu };
    updatedMenu[day][meal] = [...updatedMenu[day][meal], "New Dish"];
    setMessMenu(updatedMenu);
    setIsEditing(true);
  };

  const handleRemoveDish = (day: MessDay, meal: MealType, index: number) => {
    const updatedMenu = { ...messMenu };
    updatedMenu[day][meal] = updatedMenu[day][meal].filter((_, i) => i !== index);
    setMessMenu(updatedMenu);
    setIsEditing(true);
  };

  const handleUpdateDish = (day: MessDay, meal: MealType, index: number, value: string) => {
    const updatedMenu = { ...messMenu };
    updatedMenu[day][meal][index] = value;
    setMessMenu(updatedMenu);
    setIsEditing(true);
  };

  // Get days of the week for tabs
  const days: MessDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Get meal types
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner'];

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
          <h1 className="text-3xl font-bold tracking-tight">Mess Menu Editor</h1>
          <p className="text-muted-foreground">
            Update weekly mess meals
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

      <Card>
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="monday" 
            className="w-full" 
            onValueChange={(value) => setActiveDay(value as MessDay)}
            value={activeDay}
          >
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-full sm:w-auto">
                {days.map(day => (
                  <TabsTrigger key={day} value={day} className="capitalize">
                    {day}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {days.map(day => (
              <TabsContent key={day} value={day} className="space-y-6">
                {meals.map(meal => (
                  <Card key={meal} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="capitalize">{meal}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {messMenu[day]?.[meal].map((dish, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input 
                              value={dish}
                              onChange={(e) => handleUpdateDish(day, meal, index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDish(day, meal, index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          onClick={() => handleAddDish(day, meal)}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Dish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessMenu;
