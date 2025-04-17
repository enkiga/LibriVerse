import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginFormSchema } from "@/lib/authFilter";
import { Button } from "@/components/ui/button";
import LIBRIVERSE from "@/assets/LIBRIVERSE.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { auth } from "@/api";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUser(); // Get refreshUser function from context
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Define login form.
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  const onSubmit = async (values) => {
    // Login Logic
    try {
      const { email, password } = values;
      setIsLoading(true);
      await auth.signin({ email, password });

      // Wait for cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Refresh user data
      await refreshUser(); // Call refreshUser to update user state

      // Navigate to the home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      setErrorMessage(error.message || "Login failed. Please try again.");

      toast("Login Failed", {
        description: `${error.message || "Invalid Credentials"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex h-dvh">
      {/* Form Section */}
      <div className="md:w-1/2 w-11/12 mx-auto flex flex-col justify-center">
        <div className=" w-11/12 mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img
              src={LIBRIVERSE}
              alt="Logo"
              className="w-20 h-20 object-cover"
            />
            <p className="font-semibold text-gray-700">LibriVerse</p>
          </div>
          {/* Login Heading */}
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-600 text-sm font-semibold ">
            Fill in the required information to login{" "}
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User not registered */}
              <div className="flex items-center justify-between">
                <Link
                  to="/register"
                  className="text-blue-600 underline font-semibold text-sm"
                >
                  Forgot Password
                </Link>
                <Link
                  to="/register"
                  className="text-blue-600 underline font-semibold text-sm"
                >
                  Don't have an Account?
                </Link>
              </div>
              {/* <Button
                type="submit"
                className="w-full md:w-fit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Submit"}
              </Button> */}
              {!isLoading ? (
                <Button type="submit" className="w-full md:w-fit">
                  Submit
                </Button>
              ) : (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>

      {/* Image Section */}
      <img
        src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Login Image"
        className="md:w-1/2 hidden md:block object-cover object-center"
      />
    </section>
  );
};

export default LoginPage;
