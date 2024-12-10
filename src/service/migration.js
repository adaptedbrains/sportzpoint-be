

// import { db } from "../loaders/db.loader.js";
// // Import your models
import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";
// import { LiveBlogUpdate } from "../model/ liveBlogUpdate.model.js";
// import bcrypt from "bcrypt";


import mongoose from "mongoose";
// import { Article } from "./path-to-your-article-model.js";

const updateArticles = async () => {
  try {
    // Find all articles with type "Video"
    const articles = await Article.find({ type: "Video" });

    for (const article of articles) {
      const content = article.content;

      // Regex to extract the YouTube iframe src link
      const youtubeLinkRegex = /<iframe[^>]*src="([^"]*youtube\.com\/embed\/[^"]*)"[^>]*><\/iframe>/;
      const match = content.match(youtubeLinkRegex);

      if (match && match[1]) {
        const youtubeLink = match[1];

        // Update the video field with the extracted YouTube link
        article.video = youtubeLink;

        // Remove the iframe tag from the content
        article.content = content.replace(youtubeLinkRegex, "").trim();

        await article.save();
        console.log(`Updated video link and content for article with post_id: ${article.post_id}`);
      } else {
        console.log(`No YouTube link found for article with post_id: ${article.post_id}`);
      }
    }

    console.log("Processing completed.");
  } catch (err) {
    console.error("Error updating articles:", err);
  }
};

// Run the function
export default updateArticles;