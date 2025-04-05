
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUser, UserProfile } from "@/types";

// Basic admin emails list - in a real app this would come from a secure backend
const ADMIN_EMAILS = [
  "admin@iitgn.ac.in",
  "webadmin@iitgn.ac.in",
  "coordinator@iitgn.ac.in"
];

// Default club admin data
const DEFAULT_CLUB_ADMINS = [
  {
    id: "club1",
    email: "cultural@iitgn.ac.in",
    role: "clubAdmin",
    dateAdded: "2025-01-01",
    clubId: "c1",
    clubName: "Cultural Club"
  },
  {
    id: "club2",
    email: "technical@iitgn.ac.in",
    role: "clubAdmin",
    dateAdded: "2025-01-01",
    clubId: "c2",
    clubName: "Technical Club"
  }
];

// Add a default student user
const DEFAULT_STUDENT = {
  email: "aryan.s@iitgn.ac.in",
  name: "Aryan Sharma",
  rollNumber: "21CS1001",
  program: "B.Tech Computer Science",
  year: "3rd Year",
  phone: "+91 9876543210",
  hostel: "Dhanush Hostel, Room 203",
  joinedDate: "July 2021"
};

const formSchema = z.object({
  email: z.string().email("Please enter a valid email").endsWith("iitgn.ac.in", "Must be an IITGN email address"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authOption, setAuthOption] = useState("admin");

  useEffect(() => {
    // Check if already logged in
    const email = localStorage.getItem("user_email") || localStorage.getItem("admin_email");
    const role = localStorage.getItem("user_role");
    
    if (email) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "clubAdmin") {
        navigate("/admin/campus-activities");
      } else {
        navigate("/");
      }
    }
    
    // Initialize admin users if not already set
    const storedAdmins = localStorage.getItem("admin_users");
    if (!storedAdmins) {
      const defaultAdmins = [
        ...ADMIN_EMAILS.map(email => ({
          id: Math.random().toString(),
          email,
          role: "admin",
          dateAdded: new Date().toISOString().split("T")[0]
        })),
        ...DEFAULT_CLUB_ADMINS
      ];
      localStorage.setItem("admin_users", JSON.stringify(defaultAdmins));
      console.log("Initialized admin users:", defaultAdmins);
    }
    
    // Initialize default student profile if not already set
    const storedStudentProfile = localStorage.getItem(`user_profile_${DEFAULT_STUDENT.email}`);
    if (!storedStudentProfile) {
      const userProfile = {
        id: Math.random().toString(),
        email: DEFAULT_STUDENT.email,
        name: DEFAULT_STUDENT.name,
        rollNumber: DEFAULT_STUDENT.rollNumber,
        program: DEFAULT_STUDENT.program,
        year: DEFAULT_STUDENT.year,
        phone: DEFAULT_STUDENT.phone,
        hostel: DEFAULT_STUDENT.hostel,
        joinedDate: DEFAULT_STUDENT.joinedDate,
        role: "student",
        clubMemberships: ["Technical Club", "Photography Club"],
        interests: ["Coding", "Photography", "Reading"],
        bookmarks: []
      };
      localStorage.setItem(`user_profile_${DEFAULT_STUDENT.email}`, JSON.stringify(userProfile));
      console.log("Initialized student profile:", userProfile);
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate authentication check
    setTimeout(() => {
      console.log("Login attempt with email:", values.email);
      console.log("Authentication option:", authOption);
      
      // For admin login
      if (authOption === "admin") {
        const storedAdmins = localStorage.getItem("admin_users");
        console.log("Stored admins:", storedAdmins);
        
        const adminList: AdminUser[] = storedAdmins 
          ? JSON.parse(storedAdmins) 
          : [];
        
        console.log("Parsed admin list:", adminList);
        
        const adminUser = adminList.find(admin => admin.email === values.email);
        console.log("Found admin user:", adminUser);
        
        if (adminUser) {
          localStorage.setItem("admin_email", values.email);
          localStorage.setItem("user_email", values.email);
          localStorage.setItem("user_role", adminUser.role);
          
          if (adminUser.clubId) {
            localStorage.setItem("club_id", adminUser.clubId);
          }
          
          if (adminUser.clubName) {
            localStorage.setItem("club_name", adminUser.clubName);
          }
          
          toast.success(`Login successful as ${adminUser.role}`);
          
          if (adminUser.role === "admin") {
            navigate("/admin/dashboard");
          } else if (adminUser.role === "clubAdmin") {
            navigate("/admin/campus-activities");
          } else {
            navigate("/");
          }
        } else {
          toast.error("You don't have admin access");
        }
      } 
      // For student login
      else {
        if (values.email.endsWith("iitgn.ac.in")) {
          localStorage.setItem("user_email", values.email);
          
          // Check if there's a user profile, use that data if available
          const storedUserProfile = localStorage.getItem(`user_profile_${values.email}`);
          if (storedUserProfile) {
            const userProfile = JSON.parse(storedUserProfile);
            localStorage.setItem("user_name", userProfile.name || values.email.split("@")[0]);
          } else {
            localStorage.setItem("user_name", values.email.split("@")[0]);
          }
          
          localStorage.setItem("user_role", "student");
          toast.success("Student login successful");
          navigate("/user/dashboard");
        } else {
          toast.error("Only IITGN emails are allowed");
        }
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google OAuth login
    setTimeout(() => {
      // In production, this would use the actual Google OAuth flow
      const mockGoogleUser = {
        email: authOption === "admin" 
          ? "admin@iitgn.ac.in" 
          : "aryan.s@iitgn.ac.in",
        name: authOption === "admin" ? "Admin User" : "Aryan Sharma",
      };
      
      console.log("Google login with:", mockGoogleUser);
      
      // Check if admin
      if (authOption === "admin") {
        const storedAdmins = localStorage.getItem("admin_users");
        const adminList: AdminUser[] = storedAdmins 
          ? JSON.parse(storedAdmins) 
          : [];
        
        console.log("Parsed admin list for Google login:", adminList);
        
        const adminUser = adminList.find(admin => admin.email === mockGoogleUser.email);
        console.log("Found admin for Google login:", adminUser);
        
        if (adminUser) {
          localStorage.setItem("admin_email", mockGoogleUser.email);
          localStorage.setItem("user_email", mockGoogleUser.email);
          localStorage.setItem("user_name", mockGoogleUser.name);
          localStorage.setItem("user_role", adminUser.role);
          
          if (adminUser.clubId) {
            localStorage.setItem("club_id", adminUser.clubId);
          }
          
          if (adminUser.clubName) {
            localStorage.setItem("club_name", adminUser.clubName);
          }
          
          toast.success(`Google login successful as ${adminUser.role}`);
          
          if (adminUser.role === "admin") {
            navigate("/admin/dashboard");
          } else if (adminUser.role === "clubAdmin") {
            navigate("/admin/campus-activities");
          } else {
            navigate("/");
          }
        } else {
          toast.error("You don't have admin access");
        }
      } else {
        localStorage.setItem("user_email", mockGoogleUser.email);
        localStorage.setItem("user_name", mockGoogleUser.name);
        localStorage.setItem("user_role", "student");
        toast.success("Student login successful via Google");
        navigate("/user/dashboard");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">IITGN Campus Life Hub</CardTitle>
          <CardDescription className="text-center">
            Access campus information and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full" onValueChange={setAuthOption}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
              <TabsTrigger value="student">Student Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="mt-4 space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@iitgn.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Login with Email"}
                  </Button>
                </form>
              </Form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Only authorized IITGN staff can access admin features
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="mt-4 space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IITGN Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@iitgn.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Login with Email"}
                  </Button>
                </form>
              </Form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center flex justify-center">
          <Button
            variant="link"
            className="text-muted-foreground text-sm"
            onClick={() => navigate('/')}
          >
            Back to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
