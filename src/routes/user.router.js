import express from "express";
import { loginUser, createUser, getAllUsersController, deleteUser, updateUser, forgotPassword, resetPassword, getUserProfileController, updateUserProfileController } from "../controllers/user.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",authenticateJWT, getAllUsersController);

// Login route

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Route to create a new user (admin only)
router.post("/team-members/create", authenticateJWT, isAdmin, createUser);

router.put("/team-members/update/:id", authenticateJWT, isAdmin, updateUser);
router.delete("/team-members/delete/:id", authenticateJWT, isAdmin, deleteUser);


// Get a specific user's data (accessible to all authenticated users)
router.get("/profile/:id", getUserProfileController);

// Update the logged-in user's profile
router.put("/profile/update", authenticateJWT, updateUserProfileController);



export default router;
