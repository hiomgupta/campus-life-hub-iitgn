
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
      if (ADMIN_EMAILS.includes(values.email)) {
        // Store the email in localStorage to persist the login
        localStorage.setItem("admin_email", values.email);
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error("You don't have admin access");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your IITGN email to access admin features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@iitgn.ac.in" {...field} />
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
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Only authorized IITGN staff can access admin features
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
