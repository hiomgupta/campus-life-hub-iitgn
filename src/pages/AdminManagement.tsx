
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Save, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import { AdminUser } from "@/types";

// Initial admin emails
const initialAdmins: AdminUser[] = [
  {
    id: "1",
    email: "admin@iitgn.ac.in",
    role: "admin",
    dateAdded: "2025-04-01"
  },
  {
    id: "2",
    email: "webadmin@iitgn.ac.in",
    role: "admin",
    dateAdded: "2025-04-01"
  },
  {
    id: "3",
    email: "coordinator@iitgn.ac.in",
    role: "editor",
    dateAdded: "2025-04-02"
  }
];

const AdminManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "editor">("editor");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedData = localStorage.getItem("admin_users");
    if (storedData) {
      setAdmins(JSON.parse(storedData));
    } else {
      setAdmins(initialAdmins);
    }
    
    // Get current user
    const email = localStorage.getItem("admin_email");
    setCurrentUserEmail(email);
  }, []);

  const saveToLocalStorage = (data: AdminUser[]) => {
    localStorage.setItem("admin_users", JSON.stringify(data));
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim() || !newAdminEmail.endsWith("iitgn.ac.in")) {
      toast.error("Please enter a valid IITGN email address");
      return;
    }
    
    // Check if email already exists
    if (admins.some(admin => admin.email === newAdminEmail)) {
      toast.error("This admin already exists");
      return;
    }
    
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: newAdminEmail,
      role: newAdminRole,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    saveToLocalStorage(updatedAdmins);
    
    toast.success("Admin added successfully");
    setNewAdminEmail("");
    setIsDialogOpen(false);
  };

  const handleRemoveAdmin = (id: string, email: string) => {
    // Prevent removing yourself
    if (email === currentUserEmail) {
      toast.error("You cannot remove yourself");
      return;
    }
    
    // Prevent removing the last admin
    const adminCount = admins.filter(admin => admin.role === "admin").length;
    const isAdmin = admins.find(admin => admin.id === id)?.role === "admin";
    
    if (isAdmin && adminCount <= 1) {
      toast.error("Cannot remove the last admin");
      return;
    }
    
    const updatedAdmins = admins.filter(admin => admin.id !== id);
    setAdmins(updatedAdmins);
    saveToLocalStorage(updatedAdmins);
    
    toast.success("Admin removed successfully");
  };

  const toggleAdminRole = (id: string) => {
    const admin = admins.find(a => a.id === id);
    
    // Don't allow changing your own role
    if (admin?.email === currentUserEmail) {
      toast.error("You cannot change your own role");
      return;
    }
    
    // Prevent removing the last admin
    const adminCount = admins.filter(admin => admin.role === "admin").length;
    const isAdmin = admin?.role === "admin";
    
    if (isAdmin && adminCount <= 1) {
      toast.error("Cannot change the role of the last admin");
      return;
    }
    
    const updatedAdmins = admins.map(admin => 
      admin.id === id 
        ? {...admin, role: admin.role === "admin" ? "editor" : "admin"}
        : admin
    );
    
    setAdmins(updatedAdmins);
    saveToLocalStorage(updatedAdmins);
    
    toast.success("Admin role updated successfully");
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage admin access to the system
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <Input 
                  placeholder="email@iitgn.ac.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Must be an IITGN email address
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      checked={newAdminRole === "admin"}
                      onChange={() => setNewAdminRole("admin")}
                      className="mr-2"
                    />
                    Admin (Full access)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      checked={newAdminRole === "editor"}
                      onChange={() => setNewAdminRole("editor")}
                      className="mr-2"
                    />
                    Editor (Content only)
                  </label>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleAddAdmin}>
                Add Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} className={admin.email === currentUserEmail ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">
                    {admin.email}
                    {admin.email === currentUserEmail && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.role === "admin" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}>
                      {admin.role === "admin" ? "Admin" : "Editor"}
                    </span>
                  </TableCell>
                  <TableCell>{admin.dateAdded}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAdminRole(admin.id)}
                        disabled={admin.email === currentUserEmail}
                        title={admin.email === currentUserEmail ? "Cannot change your own role" : "Change role"}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                        disabled={admin.email === currentUserEmail}
                        title={admin.email === currentUserEmail ? "Cannot remove yourself" : "Remove admin"}
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
    </div>
  );
};

export default AdminManagement;
