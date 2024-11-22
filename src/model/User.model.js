import mongoose from "mongoose";
import { db } from "../../loaders/db.loader.js";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    meta_title: { type: String },
    meta_description: { type: String },
    display_order: { type: Number, required: true },
    roles: {
        type: Schema.Types.Array
    },
    description: { type: String },
    hide_on_website: { type: Boolean, default: false },
    social_profiles: [{ type: String }],
    profile_picture: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = db.model("User", UserSchema, "users");

export { User };
