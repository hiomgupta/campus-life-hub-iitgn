
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  
  // This is just a demonstration - in a real app, the password would be server-verified
  const DEMO_ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    // Load admin emails from localStorage
    const storedEmails = localStorage.getItem("admin_emails");
    if (storedEmails) {
      setAdminEmails(JSON.parse(storedEmails));
    } else {
      // Default admin emails
      const defaultEmails = [
        "admin@iitgn.ac.in",
        "webadmin@iitgn.ac.in",
        "coordinator@iitgn.ac.in"
      ];
      localStorage.setItem("admin_emails", JSON.stringify(defaultEmails));
      setAdminEmails(defaultEmails);
    }
  }, []);

  const handleVerifyPassword = () => {
    if (adminPassword === DEMO_ADMIN_PASSWORD) {
      setIsPasswordVerified(true);
      toast.success("Password verified");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleAddEmail = () => {
    // Validate email
    if (!newEmail || !newEmail.endsWith("iitgn.ac.in")) {
      toast.error("Please enter a valid IITGN email address");
      return;
    }

    // Add email if it doesn't exist already
    if (!adminEmails.includes(newEmail)) {
      const updatedEmails = [...adminEmails, newEmail];
      setAdminEmails(updatedEmails);
      localStorage.setItem("admin_emails", JSON.stringify(updatedEmails));
      toast.success(`${newEmail} added to admin list`);
      setNewEmail("");
      setIsAddingEmail(false);
    } else {
      toast.error("This email is already an admin");
    }
  };

  const handleRemoveEmail = (email: string) => {
    // Don't allow removing the last admin
    if (adminEmails.length <= 1) {
      toast.error("Cannot remove the last admin email");
      return;
    }

    const updatedEmails = adminEmails.filter(e => e !== email);
    setAdminEmails(updatedEmails);
    localStorage.setItem("admin_emails", JSON.stringify(updatedEmails));
    toast.success(`${email} removed from admin list`);
  };

  // If password not yet verified, show password form
  if (!isPasswordVerified) {
    return (
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <Button
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-2"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center">Admin Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter admin password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For demo purposes use: admin123
                </p>
              </div>
              <Button className="w-full" onClick={handleVerifyPassword}>
                Verify
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Manage which email addresses have admin access
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Admin Emails</CardTitle>
            {!isAddingEmail ? (
              <Button onClick={() => setIsAddingEmail(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {isAddingEmail && (
            <div className="mb-6 flex gap-2">
              <Input 
                placeholder="new.admin@iitgn.ac.in" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button onClick={handleAddEmail}>Add</Button>
              <Button variant="outline" onClick={() => {
                setIsAddingEmail(false);
                setNewEmail("");
              }}>
                Cancel
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminEmails.map((email) => (
                <TableRow key={email}>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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
