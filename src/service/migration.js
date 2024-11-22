import { db } from "../loaders/db.loader.js";
// Import your models
import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";

// Assume `sourceData` is your JSON data
import sourceData from "../../data.json" assert { type: "json" };

async function migrateData() {
  try {

    // Connect to the database



    console.log("Connected to the database");
    // 1. Extract unique categories, tags, and authors
    const uniqueCategories = new Map();
    const uniqueTags = new Map();
    const uniqueAuthors = new Map();


    sourceData.forEach(data => {
      // Collect categories
      const article = JSON.parse(data.post_json);
      
      if (article.primary_category) {
        uniqueCategories.set(article.primary_category.slug, {
          name: article.primary_category.name,
          slug: article.primary_category.slug,
        });
      }
      if (article.categories) {
        article.categories.forEach(cat => {
          uniqueCategories.set(cat.slug, { name: cat.name, slug: cat.slug });
        });
      }

      // Collect tags
      if (article.tags) {
        article.tags.forEach(tag => {
          uniqueTags.set(tag.slug, { name: tag.name, slug: tag.slug });
        });
      }

      // Collect authors
      if (article.author) {
        uniqueAuthors.set(article.author.email, {
          name: article.author.name,
          email: article.author.email,
          slug: article.author.slug,
        });
      }
    });



    // 2. Insert categories, tags, and authors into their collections
    console.log("Inserting categories...");
    const categoryMap = new Map();
    for (const [slug, category] of uniqueCategories) {
      const savedCategory = await Category.findOneAndUpdate(
        { slug },
        category,
        { upsert: true, new: true }
      );
      categoryMap.set(slug, savedCategory._id);
    }


    console.log("Inserting tags...");
    const tagMap = new Map();
    for (const [slug, tag] of uniqueTags) {
      const savedTag = await Tag.findOneAndUpdate(
        { slug },
        tag,
        { upsert: true, new: true }
      );
      tagMap.set(slug, savedTag._id);
    }

    console.log("Inserting authors...");
    const authorMap = new Map();
    for (const [email, author] of uniqueAuthors) {
      const savedAuthor = await User.findOneAndUpdate(
        { email },
        author,
        { upsert: true, new: true }
      );
      authorMap.set(email, savedAuthor._id);
    }

 // Step 3: Insert articles with references
 console.log("Inserting articles...");
 const bulkOperations = sourceData.map(data => {
   const article = JSON.parse(data.post_json);
   return {
     updateOne: {
       filter: { post_id: article.post_id },
       update: {
         $set: {
           type: article.type,
           title: article.title,
           summary: article.summary,
           legacy_url: article.legacy_url,
           primary_category: article.primary_category
             ? categoryMap.get(article.primary_category.slug)
             : null,
           categories: article.categories
             ? article.categories.map(cat => categoryMap.get(cat.slug))
             : [],
           tags: article.tags
             ? article.tags.map(tag => tagMap.get(tag.slug))
             : [],
           author: article.author
             ? authorMap.get(article.author.email)
             : null,
           credits: article.credits
             ? article.credits.map(credit =>
                 authorMap.get(credit.email)
               )
             : [],
           published_at_datetime: article.published_at_datetime,
           updated_at_datetime: article.updated_at_datetime,
           custom_published_at: article.custom_published_at,
           banner_image: article.banner_image,
           banner_desc: article.banner_desc,
           hide_banner_image: article.hide_banner_image,
           seo_desc: article.seo_desc,
           seo_title: article.seo_title,
           content: article.content,
         },
       },
       upsert: true,
     },
   };
 });

 await Article.bulkWrite(bulkOperations);
 console.log("Data migration completed successfully!");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    // Close the database connection

  }
}

export {
  migrateData
};
