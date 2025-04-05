
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bus, CalendarDays, Utensils, MapPin, Users, Bell, FileEdit } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("admin_email");
    if (!email) {
      navigate("/login");
      return;
    }
    setAdminEmail(email);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_email");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const adminFeatures = [
    {
      title: "Bus Schedule",
      description: "Update campus bus timings",
      icon: <Bus className="h-8 w-8" />,
      path: "/admin/bus-schedule"
    },
    {
      title: "What's On Campus",
      description: "Manage campus activities and events",
      icon: <Bell className="h-8 w-8" />,
      path: "/admin/campus-activities"
    },
    {
      title: "Mess Menu",
      description: "Update weekly mess meals",
      icon: <Utensils className="h-8 w-8" />,
      path: "/admin/mess-menu"
    },
    {
      title: "Food Outlets",
      description: "Manage campus food options",
      icon: <FileEdit className="h-8 w-8" />,
      path: "/admin/food-outlets"
    },
    {
      title: "Campus Map",
      description: "Upload and update campus maps",
      icon: <MapPin className="h-8 w-8" />,
      path: "/admin/campus-map"
    },
    {
      title: "Admin Management",
      description: "Manage admin access",
      icon: <Users className="h-8 w-8" />,
      path: "/admin/manage-admins"
    },
  ];

  if (!adminEmail) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage campus information and content
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Logged in as: {adminEmail}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-fit p-2 rounded-full mb-2">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate(feature.path)}>
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
