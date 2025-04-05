
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClubInfo } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

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

const AdminClubs = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<ClubInfo[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(null);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "technical" as "technical" | "cultural" | "sports" | "academic" | "other",
    coordinators: "",
    logo: ""
  });
  
  useEffect(() => {
    // Load clubs from localStorage
    const storedClubs = localStorage.getItem("clubs_data");
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    } else {
      setClubs(initialClubs);
      localStorage.setItem("clubs_data", JSON.stringify(initialClubs));
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddClub = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.coordinators.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newClub: ClubInfo = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      coordinators: formData.coordinators.split(",").map(c => c.trim()),
      members: [],
      logo: formData.logo || undefined
    };
    
    const updatedClubs = [...clubs, newClub];
    setClubs(updatedClubs);
    localStorage.setItem("clubs_data", JSON.stringify(updatedClubs));
    
    toast.success("Club added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditClub = () => {
    if (!selectedClub) return;
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.coordinators.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const updatedClub: ClubInfo = {
      id: selectedClub.id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      coordinators: formData.coordinators.split(",").map(c => c.trim()),
      members: selectedClub.members,
      logo: formData.logo || undefined
    };
    
    const updatedClubs = clubs.map(club => 
      club.id === selectedClub.id ? updatedClub : club
    );
    
    setClubs(updatedClubs);
    localStorage.setItem("clubs_data", JSON.stringify(updatedClubs));
    
    toast.success("Club updated successfully");
    setIsEditDialogOpen(false);
    setSelectedClub(null);
    resetForm();
  };
  
  const handleDeleteClub = (id: string) => {
    const updatedClubs = clubs.filter(club => club.id !== id);
    setClubs(updatedClubs);
    localStorage.setItem("clubs_data", JSON.stringify(updatedClubs));
    toast.success("Club deleted successfully");
  };
  
  const openEditDialog = (club: ClubInfo) => {
    setSelectedClub(club);
    setFormData({
      id: club.id,
      name: club.name,
      description: club.description,
      category: club.category,
      coordinators: club.coordinators.join(", "),
      logo: club.logo || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      category: "technical",
      coordinators: "",
      logo: ""
    });
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Club Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage campus clubs and organizations
          </p>
        </div>
        
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Club
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campus Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Coordinators</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map(club => (
                <TableRow key={club.id}>
                  <TableCell className="font-medium">{club.name}</TableCell>
                  <TableCell className="capitalize">{club.category}</TableCell>
                  <TableCell>{club.coordinators.join(", ")}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(club)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClub(club.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Club Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Club</DialogTitle>
            <DialogDescription>
              Create a new club or organization on campus
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Club Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Robotics Club"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                name="category" 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the club"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="coordinators">Coordinators (comma separated)</Label>
              <Input
                id="coordinators"
                name="coordinators"
                placeholder="John Doe, Jane Smith"
                value={formData.coordinators}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                name="logo"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClub}>
              Add Club
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Club Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
            <DialogDescription>
              Update club information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Club Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                name="category" 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-coordinators">Coordinators (comma separated)</Label>
              <Input
                id="edit-coordinators"
                name="coordinators"
                value={formData.coordinators}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-logo">Logo URL (optional)</Label>
              <Input
                id="edit-logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClub}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClubs;
