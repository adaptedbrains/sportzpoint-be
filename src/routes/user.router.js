import express from "express";
import { loginUser, createUser, getAllUsersController } from "../controllers/user.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Route to create a new user (admin only)
router.post("/team-members/create", authenticateJWT, isAdmin, createUser);

// New route to get all users
router.get("/users", getAllUsersController);

export default router;
