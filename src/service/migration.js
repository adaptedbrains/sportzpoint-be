import { db } from "../loaders/db.loader.js";
// Import your models
import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";
import { LiveBlogUpdate } from "../model/ liveBlogUpdate.model.js";
// Assume `sourceData` is your JSON data
import sourceData from "../../data.json" assert { type: "json" };


const migrateLiveBlogUpdates = async () => {
  try {
    console.log("Starting migration...");

    for (const data of sourceData) {
      const post = JSON.parse(data.post_json);

      if (post.type === "LiveBlog") {
        const article = await Article.findOne({ post_id: post.post_id });

        if (!article) {
          console.log(`Article not found for post_id: ${post.post_id}`);
          continue;
        }

        // Skip if live_blog_updates are already migrated
        if (article.live_blog_updates && article.live_blog_updates.length > 0) {
          console.log(`Live blog updates already migrated for post_id: ${post.post_id}`);
          continue;
        }

        if (!Array.isArray(post.live_blog_updates)) {
          console.warn(`Skipping post with invalid live_blog_updates for post_id: ${post.post_id}`);
          continue;
        }

        const liveBlogUpdateIds = [];
        for (const update of post.live_blog_updates) {
          const newLiveBlogUpdate = new LiveBlogUpdate({
            post: article._id,
            content: update.content,
            title: update.title,
            created_at: update.created_at,
            updated_at: update.updated_at,
          });

          const savedUpdate = await newLiveBlogUpdate.save();
          liveBlogUpdateIds.push(savedUpdate._id);
        }

        article.live_blog_updates = liveBlogUpdateIds;
        await article.save();

        console.log(`Migrated LiveBlog updates for Article ID: ${article._id}`);
      }
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  }
};





export {
  migrateLiveBlogUpdates
};
