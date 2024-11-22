import mongoose from "mongoose";
import { db } from "../../loaders/db.loader.js";

const ArticleSchema = new mongoose.Schema({
  post_id: { type: Number, unique: true },
  type: { type: String, enum: ["Article", "Video", "Web Story", "Photo Gallery", "Live Blog", "Custom Page", "Newsletter"], required: true },
  title: { type: String, required: true },
  summary: { type: String },
  legacy_url: { type: String },
  primary_category:[{
    type: Schema.Types.ObjectId,
    ref: 'Category'
}],
categories:[{
    type: Schema.Types.ObjectId,
    ref: 'Category'
}],
tags:[{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
}],
live_blog_updates:[{
    type: Schema.Types.ObjectId,
    ref: 'LiveBlogPpdates'
}],
author:{
    type: Schema.Types.ObjectId,
    ref: 'User'
},
credits:{
    type: Schema.Types.ObjectId,
    ref: 'User'
},
  published_at_datetime: { type: Date },
  updated_at_datetime: { type: Date },
  custom_published_at: { type: Date },
  banner_image: { type: String },
  banner_desc: { type: String },
  hide_banner_image: { type: Boolean, default: false },
  seo_desc: { type: String },
  seo_title: { type: String },
  content: { type: String, required: true },
});

const Article = db.model('Article', ArticleSchema, 'articles')

export {
    Article
};
