import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { db } from "../loaders/db.loader.js";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    meta_title: { type: String },
    meta_description: { type: String },
    display_order: { type: Number },
    roles: {
      type: [String], // Array of strings for roles
      default: [], // Default to an empty array
    },
    description: { type: String },
    hide_on_website: { type: Boolean, default: false },
    social_profiles: [{ type: String }],
    profile_picture: { type: String },
    password: { type: String, required: true }, // Add password field
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password:", hashedPassword); // Debugging
    this.password = hashedPassword;
  }
  next();
});


const User = db.model("User", UserSchema, "users");

export { User };
