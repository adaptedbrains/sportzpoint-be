import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { environment } from "../loaders/environment.loader.js";
import crypto from "crypto";
import bcrypt from "bcrypt";


// Function to handle login

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Create a JWT token
      const token = jwt.sign(
        { userId: user._id, roles: user.roles }, // Payload
        environment.JWT_SECRET
      );
  
      res.status(200).json({ message: "Login successful", token, role: user.roles });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };



export const createUser = async (req, res) => {
  const { name, email, roles } = req.body;

  try {
    // Ensure only admins can create users
    if (!req.user || !req.user.roles.includes("admin")) {
      return res.status(403).json({ message: "You are not authorized to create users" });
    }

    // Check if a user with the same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString("hex");

    // Create a unique slug from the email
    const slug = email.replace(/@.*$/, "").replace(/\s+/g, "-").toLowerCase();

    // Create new user
    const newUser = new User({
      name,
      email,
      password: randomPassword, // The raw password will be hashed by the schema's pre-save hook
      roles, // You can specify roles here when creating a user
      slug, // Add slug to the user object
    });

    await newUser.save();

    // Send a response with the generated password
    res.status(201).json({ message: "User created successfully", password: randomPassword, newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllUsersController = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find().select("-password"); // Exclude password field for security
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
