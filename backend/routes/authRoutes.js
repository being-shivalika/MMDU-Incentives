import { Router } from "express";

import { login, getMe, logout, forgotPassword, resetPassword } from "../controllers/authController.js";

import protect from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authLimiter, login);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password", authLimiter, resetPassword);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

export default router;
