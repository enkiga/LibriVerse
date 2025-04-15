import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .trim()
    .toLowerCase(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/?.test(value), {
      message: "Password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export { loginFormSchema, registerFormSchema };
