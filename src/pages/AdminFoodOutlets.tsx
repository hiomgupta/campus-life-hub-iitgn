
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Save, Edit } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FoodOutlet {
  id: string;
  name: string;
  description: string;
  location: string;
  hours: string;
  menu: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
}

const outletFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  location: z.string().min(2, "Location is required"),
  hours: z.string(),
});

const menuItemFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  category: z.string(),
});

const AdminFoodOutlets = () => {
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState<FoodOutlet[]>([]);
  const [isAddingOutlet, setIsAddingOutlet] = useState(false);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<string | null>(null);
  const [currentOutlet, setCurrentOutlet] = useState<string | null>(null);
  
  const outletForm = useForm<z.infer<typeof outletFormSchema>>({
    resolver: zodResolver(outletFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      hours: "",
    },
  });

  const menuItemForm = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "Main Course",
    },
  });

  useEffect(() => {
    // Load data from localStorage or initialize with example data
    const storedData = localStorage.getItem("food_outlets");
    if (storedData) {
      setOutlets(JSON.parse(storedData));
    } else {
      // Initialize with some example data
      const initialData: FoodOutlet[] = [
        {
          id: "1",
          name: "Campus Cafe",
          description: "A cozy cafe offering drinks and snacks",
          location: "Student Center, Ground Floor",
          hours: "8:00 AM - 8:00 PM",
          menu: [
            { id: "101", name: "Coffee", price: "₹20", category: "Beverages" },
            { id: "102", name: "Sandwich", price: "₹60", category: "Snacks" }
          ]
        },
        {
          id: "2",
          name: "Academic Block Canteen",
          description: "Quick meals for students on the go",
          location: "Academic Block, First Floor",
          hours: "9:00 AM - 5:00 PM",
          menu: [
            { id: "201", name: "Lunch Thali", price: "₹80", category: "Main Course" },
            { id: "202", name: "Tea", price: "₹10", category: "Beverages" }
          ]
        }
      ];
      
      setOutlets(initialData);
      localStorage.setItem("food_outlets", JSON.stringify(initialData));
    }
  }, []);

  const handleSaveOutlets = () => {
    localStorage.setItem("food_outlets", JSON.stringify(outlets));
    toast.success("Food outlets saved successfully");
  };

  const handleAddOutlet = (data: z.infer<typeof outletFormSchema>) => {
    const newOutlet: FoodOutlet = {
      id: Date.now().toString(),
      ...data,
      menu: []
    };
    
    const updatedOutlets = [...outlets, newOutlet];
    setOutlets(updatedOutlets);
    localStorage.setItem("food_outlets", JSON.stringify(updatedOutlets));
    
    setIsAddingOutlet(false);
    outletForm.reset();
    toast.success("Outlet added successfully");
  };

  const handleEditOutlet = (outlet: FoodOutlet) => {
    setEditingOutlet(outlet.id);
    outletForm.reset({
      name: outlet.name,
      description: outlet.description,
      location: outlet.location,
      hours: outlet.hours,
    });
    setIsAddingOutlet(true);
  };

  const handleUpdateOutlet = (data: z.infer<typeof outletFormSchema>) => {
    if (!editingOutlet) return;
    
    const updatedOutlets = outlets.map(outlet => {
      if (outlet.id === editingOutlet) {
        return {
          ...outlet,
          ...data
        };
      }
      return outlet;
    });
    
    setOutlets(updatedOutlets);
    localStorage.setItem("food_outlets", JSON.stringify(updatedOutlets));
    
    setIsAddingOutlet(false);
    setEditingOutlet(null);
    outletForm.reset();
    toast.success("Outlet updated successfully");
  };

  const handleDeleteOutlet = (id: string) => {
    const updatedOutlets = outlets.filter(outlet => outlet.id !== id);
    setOutlets(updatedOutlets);
    localStorage.setItem("food_outlets", JSON.stringify(updatedOutlets));
    toast.success("Outlet deleted successfully");
    
    if (currentOutlet === id) {
      setCurrentOutlet(null);
    }
  };

  const handleAddMenuItem = (data: z.infer<typeof menuItemFormSchema>) => {
    if (!currentOutlet) return;
    
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      ...data
    };
    
    const updatedOutlets = outlets.map(outlet => {
      if (outlet.id === currentOutlet) {
        return {
          ...outlet,
          menu: [...outlet.menu, newMenuItem]
        };
      }
      return outlet;
    });
    
    setOutlets(updatedOutlets);
    localStorage.setItem("food_outlets", JSON.stringify(updatedOutlets));
    
    setIsAddingMenuItem(false);
    menuItemForm.reset();
    toast.success("Menu item added successfully");
  };

  const handleDeleteMenuItem = (outletId: string, itemId: string) => {
    const updatedOutlets = outlets.map(outlet => {
      if (outlet.id === outletId) {
        return {
          ...outlet,
          menu: outlet.menu.filter(item => item.id !== itemId)
        };
      }
      return outlet;
    });
    
    setOutlets(updatedOutlets);
    localStorage.setItem("food_outlets", JSON.stringify(updatedOutlets));
    toast.success("Menu item deleted successfully");
  };

  const onOutletSubmit = (data: z.infer<typeof outletFormSchema>) => {
    if (editingOutlet) {
      handleUpdateOutlet(data);
    } else {
      handleAddOutlet(data);
    }
  };

  const onMenuItemSubmit = (data: z.infer<typeof menuItemFormSchema>) => {
    handleAddMenuItem(data);
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
          <h1 className="text-3xl font-bold tracking-tight">Food Outlets</h1>
          <p className="text-muted-foreground">
            Manage campus food outlets and menus
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => {
          outletForm.reset();
          setEditingOutlet(null);
          setIsAddingOutlet(!isAddingOutlet);
        }}>
          {isAddingOutlet ? "Cancel" : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Food Outlet
            </>
          )}
        </Button>
        <Button onClick={handleSaveOutlets}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {isAddingOutlet && (
        <Card>
          <CardHeader>
            <CardTitle>{editingOutlet ? "Edit Food Outlet" : "Add New Food Outlet"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...outletForm}>
              <form onSubmit={outletForm.handleSubmit(onOutletSubmit)} className="space-y-4">
                <FormField
                  control={outletForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Outlet name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={outletForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description" rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={outletForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Outlet location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={outletForm.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 9:00 AM - 5:00 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {editingOutlet ? "Update Outlet" : "Add Outlet"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Food Outlets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outlets.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No food outlets added yet
                </p>
              ) : (
                outlets.map((outlet) => (
                  <div 
                    key={outlet.id} 
                    className={`flex justify-between items-center p-3 rounded-md border ${currentOutlet === outlet.id ? 'bg-muted' : ''}`}
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => setCurrentOutlet(outlet.id)}
                    >
                      <h3 className="font-medium">{outlet.name}</h3>
                      <p className="text-sm text-muted-foreground">{outlet.location}</p>
                    </button>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditOutlet(outlet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOutlet(outlet.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {currentOutlet && (
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Menu Items
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {outlets.find(o => o.id === currentOutlet)?.name}
                  </span>
                </CardTitle>
                <Button 
                  size="sm"
                  onClick={() => {
                    menuItemForm.reset();
                    setIsAddingMenuItem(!isAddingMenuItem);
                  }}
                >
                  {isAddingMenuItem ? "Cancel" : "Add Item"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingMenuItem && (
                <Card className="border mb-4">
                  <CardContent className="pt-6">
                    <Form {...menuItemForm}>
                      <form onSubmit={menuItemForm.handleSubmit(onMenuItemSubmit)} className="space-y-4">
                        <FormField
                          control={menuItemForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Menu item name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={menuItemForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. ₹50" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={menuItemForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Beverages" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">
                            Add Item
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                {outlets.find(o => o.id === currentOutlet)?.menu.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    No menu items added yet
                  </p>
                ) : (
                  outlets.find(o => o.id === currentOutlet)?.menu.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-md border">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex text-sm text-muted-foreground space-x-2">
                          <span>{item.price}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMenuItem(currentOutlet, item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFoodOutlets;
