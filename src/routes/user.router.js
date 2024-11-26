import express from "express";
import { loginUser, createUser, getAllUsersController, deleteUser, updateUser } from "../controllers/user.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",authenticateJWT, getAllUsersController);

// Login route

router.post("/login", loginUser);

// Route to create a new user (admin only)
router.post("/team-members/create", authenticateJWT, isAdmin, createUser);

router.put("/team-members/update/:id", authenticateJWT, isAdmin, updateUser);
router.delete("/team-members/delete/:id", authenticateJWT, isAdmin, deleteUser);


export default router;
