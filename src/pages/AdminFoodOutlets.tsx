
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Edit, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { FoodOutlet, MenuItem } from "@/types";

// Sample initial data
const initialFoodOutlets: FoodOutlet[] = [
  {
    id: "1",
    name: "Campus Café",
    description: "Coffee, snacks, and light meals",
    location: "Student Center",
    hours: "7:30 AM - 9:00 PM",
    menu: [
      { id: "1-1", name: "Espresso", category: "Beverages", price: "₹30" },
      { id: "1-2", name: "Sandwich", category: "Food", price: "₹60" },
      { id: "1-3", name: "Muffin", category: "Bakery", price: "₹40" }
    ]
  },
  {
    id: "2",
    name: "Food Court",
    description: "Multiple cuisines under one roof",
    location: "Academic Block",
    hours: "11:00 AM - 10:00 PM",
    menu: [
      { id: "2-1", name: "Burger", category: "Fast Food", price: "₹80" },
      { id: "2-2", name: "Pizza", category: "Fast Food", price: "₹150" },
      { id: "2-3", name: "Noodles", category: "Chinese", price: "₹70" }
    ]
  }
];

const AdminFoodOutlets = () => {
  const navigate = useNavigate();
  const [foodOutlets, setFoodOutlets] = useState<FoodOutlet[]>([]);
  const [isOutletDialogOpen, setIsOutletDialogOpen] = useState(false);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [currentOutletIndex, setCurrentOutletIndex] = useState<number>(-1);
  
  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet>({
    id: "",
    name: "",
    description: "",
    location: "",
    hours: "",
    menu: []
  });
  
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem>({
    id: "",
    name: "",
    category: "",
    price: ""
  });
  
  const [isEditingOutlet, setIsEditingOutlet] = useState(false);
  const [isEditingMenuItem, setIsEditingMenuItem] = useState(false);
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem("food_outlets_data");
    if (storedData) {
      setFoodOutlets(JSON.parse(storedData));
    } else {
      setFoodOutlets(initialFoodOutlets);
    }
  }, []);

  const saveToLocalStorage = (data: FoodOutlet[]) => {
    localStorage.setItem("food_outlets_data", JSON.stringify(data));
  };

  const handleSaveOutlet = () => {
    // Ensure all required fields have values
    const outletToSave: FoodOutlet = {
      ...currentOutlet,
      name: currentOutlet.name || "New Outlet",
      description: currentOutlet.description || "Description",
      location: currentOutlet.location || "Location",
      hours: currentOutlet.hours || "Hours"
    };
    
    if (isEditingOutlet) {
      // Update existing outlet
      const updatedOutlets = foodOutlets.map(outlet => 
        outlet.id === outletToSave.id ? outletToSave : outlet
      );
      setFoodOutlets(updatedOutlets);
      saveToLocalStorage(updatedOutlets);
    } else {
      // Add new outlet
      const newOutlet = {
        ...outletToSave,
        id: `outlet-${Date.now()}`
      };
      const updatedOutlets = [...foodOutlets, newOutlet];
      setFoodOutlets(updatedOutlets);
      saveToLocalStorage(updatedOutlets);
    }
    
    toast.success(isEditingOutlet ? "Outlet updated successfully" : "Outlet added successfully");
    resetOutletForm();
    setIsOutletDialogOpen(false);
  };

  const handleSaveMenuItem = () => {
    if (currentOutletIndex === -1) return;
    
    // Ensure all required fields have values
    const menuItemToSave: MenuItem = {
      ...currentMenuItem,
      name: currentMenuItem.name || "New Item",
      category: currentMenuItem.category || "Other",
      price: currentMenuItem.price || "₹0"
    };
    
    const updatedOutlets = [...foodOutlets];
    
    if (isEditingMenuItem) {
      // Update existing menu item
      updatedOutlets[currentOutletIndex].menu = updatedOutlets[currentOutletIndex].menu.map(item => 
        item.id === menuItemToSave.id ? menuItemToSave : item
      );
    } else {
      // Add new menu item
      const newMenuItem = {
        ...menuItemToSave,
        id: `item-${Date.now()}`
      };
      updatedOutlets[currentOutletIndex].menu.push(newMenuItem);
    }
    
    setFoodOutlets(updatedOutlets);
    saveToLocalStorage(updatedOutlets);
    
    toast.success(isEditingMenuItem ? "Menu item updated successfully" : "Menu item added successfully");
    resetMenuItemForm();
    setIsMenuItemDialogOpen(false);
  };

  const editOutlet = (outlet: FoodOutlet) => {
    setCurrentOutlet(outlet);
    setIsEditingOutlet(true);
    setIsOutletDialogOpen(true);
  };

  const editMenuItem = (outletIndex: number, menuItem: MenuItem) => {
    setCurrentOutletIndex(outletIndex);
    setCurrentMenuItem(menuItem);
    setIsEditingMenuItem(true);
    setIsMenuItemDialogOpen(true);
  };

  const deleteOutlet = (id: string) => {
    const updatedOutlets = foodOutlets.filter(outlet => outlet.id !== id);
    setFoodOutlets(updatedOutlets);
    saveToLocalStorage(updatedOutlets);
    toast.success("Outlet deleted successfully");
  };

  const deleteMenuItem = (outletIndex: number, menuItemId: string) => {
    const updatedOutlets = [...foodOutlets];
    updatedOutlets[outletIndex].menu = updatedOutlets[outletIndex].menu.filter(item => item.id !== menuItemId);
    setFoodOutlets(updatedOutlets);
    saveToLocalStorage(updatedOutlets);
    toast.success("Menu item deleted successfully");
  };

  const resetOutletForm = () => {
    setCurrentOutlet({
      id: "",
      name: "",
      description: "",
      location: "",
      hours: "",
      menu: []
    });
    setIsEditingOutlet(false);
  };

  const resetMenuItemForm = () => {
    setCurrentMenuItem({
      id: "",
      name: "",
      category: "",
      price: ""
    });
    setIsEditingMenuItem(false);
  };

  const handleOutletDialogClose = (open: boolean) => {
    setIsOutletDialogOpen(open);
    if (!open) resetOutletForm();
  };

  const handleMenuItemDialogClose = (open: boolean) => {
    setIsMenuItemDialogOpen(open);
    if (!open) resetMenuItemForm();
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

      <div className="flex justify-end">
        <Dialog open={isOutletDialogOpen} onOpenChange={handleOutletDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOutletDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Outlet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingOutlet ? "Edit Food Outlet" : "Add New Food Outlet"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input 
                  placeholder="Outlet name"
                  value={currentOutlet.name}
                  onChange={(e) => setCurrentOutlet({...currentOutlet, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea 
                  placeholder="Outlet description"
                  value={currentOutlet.description}
                  onChange={(e) => setCurrentOutlet({...currentOutlet, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input 
                  placeholder="Outlet location"
                  value={currentOutlet.location}
                  onChange={(e) => setCurrentOutlet({...currentOutlet, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Operating Hours</label>
                <Input 
                  placeholder="e.g. 9:00 AM - 5:00 PM"
                  value={currentOutlet.hours}
                  onChange={(e) => setCurrentOutlet({...currentOutlet, hours: e.target.value})}
                />
              </div>
              
              <Button className="w-full" onClick={handleSaveOutlet}>
                {isEditingOutlet ? "Update Outlet" : "Add Outlet"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="outlets" className="w-full">
        <TabsList>
          <TabsTrigger value="outlets">Manage Outlets</TabsTrigger>
          <TabsTrigger value="menus">Manage Menus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="outlets">
          <Card>
            <CardHeader>
              <CardTitle>All Food Outlets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodOutlets.map((outlet) => (
                    <TableRow key={outlet.id}>
                      <TableCell className="font-medium">{outlet.name}</TableCell>
                      <TableCell>{outlet.location}</TableCell>
                      <TableCell>{outlet.hours}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editOutlet(outlet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOutlet(outlet.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menus">
          <Dialog open={isMenuItemDialogOpen} onOpenChange={handleMenuItemDialogClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditingMenuItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Item Name</label>
                  <Input 
                    placeholder="Item name"
                    value={currentMenuItem.name}
                    onChange={(e) => setCurrentMenuItem({...currentMenuItem, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Input 
                    placeholder="e.g. Beverages, Snacks, Meals"
                    value={currentMenuItem.category}
                    onChange={(e) => setCurrentMenuItem({...currentMenuItem, category: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Price</label>
                  <Input 
                    placeholder="e.g. ₹50"
                    value={currentMenuItem.price}
                    onChange={(e) => setCurrentMenuItem({...currentMenuItem, price: e.target.value})}
                  />
                </div>
                
                <Button className="w-full" onClick={handleSaveMenuItem}>
                  {isEditingMenuItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        
          {foodOutlets.map((outlet, outletIndex) => (
            <Card key={outlet.id} className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{outlet.name} Menu</span>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentOutletIndex(outletIndex);
                      setIsMenuItemDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {outlet.menu.length === 0 ? (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">No menu items yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outlet.menu.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editMenuItem(outletIndex, item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMenuItem(outletIndex, item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFoodOutlets;
