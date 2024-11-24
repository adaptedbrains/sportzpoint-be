import mongoose from "mongoose";
import { db } from "../loaders/db.loader.js";

const LiveBlogUpdateSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    content: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
  },
  { timestamps: true }
);

const LiveBlogUpdate = db.model(
  "LiveBlogUpdate",
  LiveBlogUpdateSchema,
  "live_blog_updates"
);

export { LiveBlogUpdate };
