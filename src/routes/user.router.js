import express from "express";
import { loginUser, createUser } from "../controllers/user.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Route to create a new user (admin only)
router.post("/team-members/create", authenticateJWT, isAdmin, createUser);

export default router;
