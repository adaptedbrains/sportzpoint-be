import mongoose from "mongoose";
import { db } from "../loaders/db.loader.js";

const ArticleSchema = new mongoose.Schema({
  post_id: { type: Number, unique: true },
  type: { type: String, enum: ["Article", "Video", "Newsletter", "LiveBlog", "CustomPage", "Gallery","Web Story" ], required: true },
  title: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true
},
  summary: { type: String },
  legacy_url: { type: String },
  primary_category:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
}],
categories:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
}],
tags:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
}],
live_blog_updates:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveBlogUpdate'
}],
author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
credits:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
  published_at_datetime: { type: Date, default: null },
  updated_at_datetime: { type: Date },
  custom_published_at: { type: Date },
  banner_image: { type: String },
  banner_desc: { type: String },
  img_alt: { type: String },
  hide_banner_image: { type: Boolean, default: false },
  seo_desc: { type: String },
  seo_title: { type: String },
  content: { type: String },
  status: { type: String, enum: ["draft", "published", "pending_approval", ""], default: "" },
  isLive: { type: Boolean, default: false },
  focusKeyphrase: { type: String},
  web_story: [{
    type: { type: String, default:'' },
    cta_link: { type: String, default:'' },
    cta_text: { type: String, default:'' },
    title: { type: String, default:'' },
    img_src: { type: String, default:'' },
    desc: { type: String, default:'' }
  }]
},
{ timestamps: true }
);

const Article = db.model('Article', ArticleSchema, 'articles')

export {
    Article
};