
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
import { Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Basic admin emails list - in a real app this would come from a secure backend
const ADMIN_EMAILS = [
  "admin@iitgn.ac.in",
  "webadmin@iitgn.ac.in",
  "coordinator@iitgn.ac.in"
];

const formSchema = z.object({
  email: z.string().email("Please enter a valid email").endsWith("iitgn.ac.in", "Must be an IITGN email address"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authOption, setAuthOption] = useState("admin");

  useEffect(() => {
    // Check if already logged in
    const email = localStorage.getItem("admin_email");
    if (email) {
      navigate("/admin/dashboard");
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
      // For admin login
      if (authOption === "admin") {
        const storedAdmins = localStorage.getItem("admin_users");
        const adminList = storedAdmins ? JSON.parse(storedAdmins) : ADMIN_EMAILS.map(email => ({
          id: Math.random().toString(),
          email,
          role: "admin",
          dateAdded: new Date().toISOString().split("T")[0]
        }));
        
        const isAdmin = adminList.some((admin: any) => admin.email === values.email);
        
        if (isAdmin) {
          localStorage.setItem("admin_email", values.email);
          toast.success("Admin login successful");
          navigate("/admin/dashboard");
        } else {
          toast.error("You don't have admin access");
        }
      } 
      // For student login
      else {
        if (values.email.endsWith("iitgn.ac.in")) {
          localStorage.setItem("user_email", values.email);
          toast.success("Student login successful");
          navigate("/");
        } else {
          toast.error("Only IITGN emails are allowed");
        }
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login would be implemented in a production environment");
    
    // Simulate Google login
    setTimeout(() => {
      if (authOption === "admin") {
        toast.error("Please use email login for admin access");
      } else {
        const dummyEmail = "student@iitgn.ac.in";
        localStorage.setItem("user_email", dummyEmail);
        toast.success("Student login successful (Simulated)");
        navigate("/");
      }
    }, 1000);
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
            
            <TabsContent value="admin" className="mt-4">
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
                    {isLoading ? "Checking..." : "Login"}
                  </Button>
                </form>
              </Form>
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
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                </svg>
                Sign in with Google
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
