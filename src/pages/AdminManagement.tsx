
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminUser } from "@/types";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "clubAdmin">("clubAdmin");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load admins from localStorage
    const storedAdmins = localStorage.getItem("admin_users");
    if (storedAdmins) {
      setAdmins(JSON.parse(storedAdmins));
    } else {
      // If no admins exist, create a default list with the current user
      const currentUserEmail = localStorage.getItem("admin_email");
      if (currentUserEmail) {
        const defaultAdmins: AdminUser[] = [
          {
            id: "1",
            email: currentUserEmail,
            role: "admin",
            dateAdded: new Date().toISOString().split("T")[0]
          }
        ];
        setAdmins(defaultAdmins);
        localStorage.setItem("admin_users", JSON.stringify(defaultAdmins));
      }
    }
  }, []);
  
  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (!newAdminEmail.endsWith("iitgn.ac.in")) {
      toast.error("Only IITGN email addresses are allowed");
      return;
    }
    
    // Check if email already exists
    if (admins.some(admin => admin.email === newAdminEmail)) {
      toast.error("This email is already registered as an admin");
      return;
    }
    
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      email: newAdminEmail,
      role: newAdminRole,
      dateAdded: new Date().toISOString().split("T")[0]
    };
    
    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    localStorage.setItem("admin_users", JSON.stringify(updatedAdmins));
    
    toast.success("Admin added successfully");
    setNewAdminEmail("");
    setNewAdminRole("clubAdmin");
    setDialogOpen(false);
  };
  
  const handleRemoveAdmin = (id: string) => {
    // Check if it's the current user
    const currentUserEmail = localStorage.getItem("admin_email");
    const adminToRemove = admins.find(admin => admin.id === id);
    
    if (adminToRemove?.email === currentUserEmail) {
      toast.error("You cannot remove yourself");
      return;
    }
    
    const updatedAdmins = admins.filter(admin => admin.id !== id);
    setAdmins(updatedAdmins);
    localStorage.setItem("admin_users", JSON.stringify(updatedAdmins));
    toast.success("Admin removed successfully");
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage admin access to the campus management system
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Give admin access to another IITGN staff member.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="staff@iitgn.ac.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newAdminRole} onValueChange={(value: "admin" | "clubAdmin") => setNewAdminRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator (Full access)</SelectItem>
                    <SelectItem value="clubAdmin">Club Admin (Content management only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            These users can access the admin features of the Campus Life Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="capitalize">{admin.role}</TableCell>
                  <TableCell>{admin.dateAdded}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
