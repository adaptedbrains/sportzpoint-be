import { User } from "../model/user.model.js";
import { Article } from "../model/articel.model.js";
import jwt from "jsonwebtoken";
import { environment } from "../loaders/environment.loader.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";


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



// export const createUser = async (req, res) => {
//   const { name, email, roles } = req.body;

//   try {
//     // Ensure only admins can create users
//     if (!req.user || !req.user.roles.includes("admin")) {
//       return res.status(403).json({ message: "You are not authorized to create users" });
//     }

//     // Check if a user with the same email exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User with this email already exists" });
//     }

//     // Generate a random password
//     const randomPassword = crypto.randomBytes(8).toString("hex");

//     // Create a unique slug from the email
//     const slug = email.replace(/@.*$/, "").replace(/\s+/g, "-").toLowerCase();

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: randomPassword, // The raw password will be hashed by the schema's pre-save hook
//       roles, // You can specify roles here when creating a user
//       slug, // Add slug to the user object
//     });

//     await newUser.save();

//     // Send a response with the generated password
//     res.status(201).json({ message: "User created successfully", password: randomPassword, newUser });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


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

    // Send email with the user's credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use another email service provider
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASSWORD, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your Account Credentials",
      text: `Hi ${name},\n\nYour account has been created successfully.\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in and change your password immediately for security purposes.\n\nBest regards,\n[Your Team]`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User created successfully and email sent",
      password: randomPassword,
      newUser,
    });
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

export const getArticlesByAuthor = async (req, res) => {
    try {
        const userId = req.user._id;

        const articles = await Article.find({ author: userId })
            .populate('primary_category')
            .populate('categories')
            .populate('tags')
            .populate('live_blog_updates')
            .populate('author', 'name email') // Populate author details if needed
            .populate('credits', 'name email') // Populate credits details if needed
            .exec();

        res.status(200).json({
            success: true,
            data: articles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving articles",
            error: error.message,
        });
    }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};
