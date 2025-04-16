import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { registerFormSchema } from "@/lib/authFilter";
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Define registration form.
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  const onSubmit = async (values) => {
    // // For testing let us just console log the values
    // console.log(values.username);
    // console.log(values.email);
    // console.log(values.password);

    // Registration Logic
    try {
      const { username, email, password } = values;
      setIsLoading(true);
      const response = await auth.signup({ username, email, password });

      toast("Registration Successfull", {
        description: "Will be directed to login shortly",
      });
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      setErrorMessage(error.message || "Registration failed. Please try again.");

      toast("Registration Failed", {
        description: `${error.message || "Invalid Credentials"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="w-full flex h-dvh md:h-full ">
      {/* Image Section */}
      <img
        src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Login Image"
        className="md:w-1/2 hidden md:block object-cover object-center"
      />
      {/* Form Section */}
      <div className="md:w-1/2 w-11/12 mx-auto flex flex-col justify-center">
        <div className=" w-11/12 mx-auto space-y-8 my-2">
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
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-gray-600 text-sm font-semibold ">
            Fill in the required information to register your account{" "}
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  to="/login"
                  className="text-blue-600 underline font-semibold text-sm"
                >
                  Already have an Account?
                </Link>
              </div>
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
    </section>
  );
};

export default RegisterPage;
