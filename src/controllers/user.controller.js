import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { environment } from "../loaders/environment.loader.js";
import crypto from "crypto";

// Function to handle login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token without expiration
    const token = jwt.sign({ userId: user._id, roles: user.roles }, environment.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Function to handle user creation (admin only)
export const createUser = async (req, res) => {
  const { name, email, roles } = req.body;

  try {
    // Ensure only admins can create users
    if (!req.user || !req.user.roles.includes("admin")) {
      return res.status(403).json({ message: "You are not authorized to create users" });
    }

    // Check if user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate a random password
    const password = crypto.randomBytes(8).toString('hex');

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      roles, // You can specify roles here when creating a user
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", password });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
