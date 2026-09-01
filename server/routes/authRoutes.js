import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  isUserAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .toLowerCase()
        .optional()
        .or(z.literal("")),
      username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores")
        .optional()
        .or(z.literal("")),
      password: z.string().min(1, "Password is required"),
    })
    .refine(
      (data) => (data.email && data.email.length > 0) || (data.username && data.username.length > 0),
      {
        message: "Email or username is required",
        path: ["email"],
      }
    ),
});

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/is-admin", protect, isUserAdmin);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

export default router;
