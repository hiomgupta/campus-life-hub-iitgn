
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Notice } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
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

const AdminNotices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    category: "academic" as "academic" | "fee" | "club" | "campus" | "emergency" | "other",
    date: new Date().toISOString().split("T")[0],
    postedBy: "",
    important: false
  });
  
  useEffect(() => {
    // Load notices from localStorage
    const storedNotices = localStorage.getItem("notices_data");
    if (storedNotices) {
      setNotices(JSON.parse(storedNotices));
    } else {
      setNotices(initialNotices);
      localStorage.setItem("notices_data", JSON.stringify(initialNotices));
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, important: checked }));
  };
  
  const handleAddNotice = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.postedBy.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      date: formData.date,
      postedBy: formData.postedBy,
      important: formData.important
    };
    
    const updatedNotices = [...notices, newNotice];
    setNotices(updatedNotices);
    localStorage.setItem("notices_data", JSON.stringify(updatedNotices));
    
    toast.success("Notice added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditNotice = () => {
    if (!selectedNotice) return;
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.postedBy.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const updatedNotice: Notice = {
      id: selectedNotice.id,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      date: formData.date,
      postedBy: formData.postedBy,
      important: formData.important
    };
    
    const updatedNotices = notices.map(notice => 
      notice.id === selectedNotice.id ? updatedNotice : notice
    );
    
    setNotices(updatedNotices);
    localStorage.setItem("notices_data", JSON.stringify(updatedNotices));
    
    toast.success("Notice updated successfully");
    setIsEditDialogOpen(false);
    setSelectedNotice(null);
    resetForm();
  };
  
  const handleDeleteNotice = (id: string) => {
    const updatedNotices = notices.filter(notice => notice.id !== id);
    setNotices(updatedNotices);
    localStorage.setItem("notices_data", JSON.stringify(updatedNotices));
    toast.success("Notice deleted successfully");
  };
  
  const openEditDialog = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      category: notice.category,
      date: notice.date,
      postedBy: notice.postedBy,
      important: notice.important
    });
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      content: "",
      category: "academic",
      date: new Date().toISOString().split("T")[0],
      postedBy: "",
      important: false
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
            <h1 className="text-3xl font-bold tracking-tight">Notice Board Management</h1>
          </div>
          <p className="text-muted-foreground">
            Post and manage announcements for the campus community
          </p>
        </div>
        
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Notice
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campus Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Posted By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map(notice => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell className="capitalize">{notice.category}</TableCell>
                  <TableCell>{format(new Date(notice.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{notice.postedBy}</TableCell>
                  <TableCell>
                    {notice.important ? (
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        Important
                      </span>
                    ) : "Normal"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(notice)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteNotice(notice.id)}
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
      
      {/* Add Notice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Notice</DialogTitle>
            <DialogDescription>
              Create a new announcement for the campus community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Exam Schedule Announcement"
                value={formData.title}
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
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Details of the announcement"
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="postedBy">Posted By</Label>
              <Input
                id="postedBy"
                name="postedBy"
                placeholder="Academic Office"
                value={formData.postedBy}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="important" 
                checked={formData.important} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="important" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Mark as Important
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNotice}>
              Add Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Notice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>
              Update notice information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
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
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-postedBy">Posted By</Label>
              <Input
                id="edit-postedBy"
                name="postedBy"
                value={formData.postedBy}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-important" 
                checked={formData.important} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-important" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Mark as Important
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditNotice}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotices;
