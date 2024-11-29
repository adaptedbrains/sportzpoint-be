

import { db } from "../loaders/db.loader.js";
// Import your models
import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";
import { LiveBlogUpdate } from "../model/ liveBlogUpdate.model.js";
import bcrypt from "bcrypt";


import fs from 'fs';
import path from 'path';

const dataPath = path.resolve("/Users/sajdakabir/Downloads/db/data.json");
const sourceData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// console.log(sourceData);


// async function migrateData() {
//   try {
//     console.log("Connected to the database");

//     const uniqueCategories = new Map();
//     const uniqueTags = new Map();
//     const uniqueAuthors = new Map();

//     // Extract unique categories, tags, and authors
//     sourceData.forEach(data => {
//       const article = JSON.parse(data.post_json);
      
//       if (article.primary_category) {
//         uniqueCategories.set(article.primary_category.slug, {
//           name: article.primary_category.name,
//           slug: article.primary_category.slug,
//         });
//       }
//       if (article.categories) {
//         article.categories.forEach(cat => {
//           uniqueCategories.set(cat.slug, { name: cat.name, slug: cat.slug });
//         });
//       }

//       if (article.tags) {
//         article.tags.forEach(tag => {
//           uniqueTags.set(tag.slug, { name: tag.name, slug: tag.slug });
//         });
//       }

//       if (article.author) {
//         uniqueAuthors.set(article.author.email, {
//           name: article.author.name,
//           email: article.author.email,
//           slug: article.author.slug,
//         });
//       }
//     });

//     // Insert categories, tags, and authors into their collections
//     console.log("Inserting categories...");
//     const categoryMap = new Map();
//     for (const [slug, category] of uniqueCategories) {
//       const savedCategory = await Category.findOneAndUpdate(
//         { slug },
//         category,
//         { upsert: true, new: true }
//       );
//       categoryMap.set(slug, savedCategory._id);
//     }

//     console.log("Inserting tags...");
//     const tagMap = new Map();
//     for (const [slug, tag] of uniqueTags) {
//       const savedTag = await Tag.findOneAndUpdate(
//         { slug },
//         tag,
//         { upsert: true, new: true }
//       );
//       tagMap.set(slug, savedTag._id);
//     }

//     console.log("Inserting authors...");
//     const authorMap = new Map();
//     for (const [email, author] of uniqueAuthors) {
//       const savedAuthor = await User.findOneAndUpdate(
//         { email },
//         author,
//         { upsert: true, new: true }
//       );
//       authorMap.set(email, savedAuthor._id);
//     }

//     // Step 1: Get all existing post_ids from the database
//     const existingArticles = await Article.find({}).select('post_id');
//     const existingPostIds = new Set(existingArticles.map(article => article.post_id));
//     console.log("exjjfjek: ", existingPostIds);

//     // Step 2: Find new articles that are not in the database
//     const newArticles = sourceData.filter(data => {
//       const article = JSON.parse(data.post_json);
//       return !existingPostIds.has(article.post_id);
//     });

//     console.log(`Found ${newArticles.length} new articles that are not in the database.`);

//     // Step 3: Insert new articles into the database
//     const bulkOperations = [];
//     for (const data of newArticles) {
//       const article = JSON.parse(data.post_json);

//       bulkOperations.push({
//         updateOne: {
//           filter: { post_id: article.post_id },
//           update: {
//             $set: {
//               type: article.type,
//               title: article.title,
//               summary: article.summary,
//               legacy_url: article.legacy_url,
//               primary_category: article.primary_category
//                 ? categoryMap.get(article.primary_category.slug)
//                 : null,
//               categories: article.categories
//                 ? article.categories.map(cat => categoryMap.get(cat.slug))
//                 : [],
//               tags: article.tags
//                 ? article.tags.map(tag => tagMap.get(tag.slug))
//                 : [],
//               author: article.author
//                 ? authorMap.get(article.author.email)
//                 : null,
//               credits: article.credits
//                 ? article.credits.map(credit =>
//                     authorMap.get(credit.email)
//                   )
//                 : [],
//               published_at_datetime: article.published_at_datetime,
//               updated_at_datetime: article.updated_at_datetime,
//               custom_published_at: article.custom_published_at,
//               banner_image: article.banner_image,
//               banner_desc: article.banner_desc,
//               hide_banner_image: article.hide_banner_image,
//               seo_desc: article.seo_desc,
//               seo_title: article.seo_title,
//               content: article.content,
//             },
//           },
//           upsert: true,
//         },
//       });
//     }

//     // Perform bulk write if there are new articles to insert
//     if (bulkOperations.length > 0) {
//       await Article.bulkWrite(bulkOperations);
//       console.log("Data migration completed successfully!");
//     } else {
//       console.log("No new articles to migrate.");
//     }
//   } catch (err) {
//     console.error("Error during migration:", err);
//   } finally {
//     // Close the database connection
//   }
// }

// const updateWebStoryImages = async () => {
//   console.log("Updating web story images...");
//   try {
//     // Find articles of type Web Story with images containing 'sportzpoint/media/'
//     const articles = await Article.find({
//       "content": { $regex: "sportzpoint/media/" },
//       "type": "Web Story"
//     });

//     for (const article of articles) {
//       console.log("Processing article: ", article._id);
      
//       // Parse the content to manipulate the image sources
//       const contentData = JSON.parse(article.content);

//       // Check if the content contains web_story images and update each image source
//       if (contentData.data && contentData.data.web_story) {
//         contentData.data.web_story.forEach((webStory) => {
//           if (webStory.img_src && webStory.img_src.includes("sportzpoint/media/")) {
//             // Remove the prefix 'sportzpoint/media/' from the image source
//             webStory.img_src = webStory.img_src.replace("sportzpoint/media/", "");
//           }
//         });

//         // Convert the updated content back to a string
//         article.content = JSON.stringify(contentData);

//         // Save the updated article
//         await article.save();
//       }
//     }

//     console.log(`${articles.length} records updated`);
//   } catch (err) {
//     console.error("Error updating web story images:", err);
//   }
// };


// const updateBannerImages = async () => {
//   console.log("hey..")
//   try {
//     const users = await Article.find({ banner_image: { $regex: "^sportzpoint/media/" } });

//     for (const user of users) {
//       console.log("user: ", user._id)
//       user.banner_image = user.banner_image.replace("sportzpoint/media/", ""); // Remove the prefix
//       await user.save(); // Save the updated document
//     }

//     console.log(`${users.length} records updated`);
//   } catch (err) {
//     console.error("Error updating banner images:", err);
//   }
// };


// Function to update slugs for existing articles
//   const updateSlugs = async () => {
//   try {
//     console.log("hey")
//     // Find all articles that have a legacy_url
//     const articles = await Article.find({ legacy_url: { $exists: true, $ne: null } });

//     // Iterate over the articles to update the slug
//     for (const article of articles) {
//       // Split the legacy_url by '/' and get the last part
//       const urlParts = article.legacy_url.split("/");
//       const slug = urlParts[urlParts.length - 1]; // Get the last part of the URL

//       // Update the slug field if the last part exists
//       if (slug && slug !== article.slug) {
//         article.slug = slug; // Set the new slug
//         await article.save(); // Save the updated article
//         console.log(`Updated slug for article with post_id: ${article.post_id}`);
//       }
//     }

//     console.log(`${articles.length} articles updated successfully!`);
//   } catch (err) {
//     console.error("Error updating slugs:", err);
//   }
// };

// Call the function to update sl


// const migrateLiveBlogUpdatesForSinglePost = async () => {
//   try {

//     const postIdToMigrate = 7360616;  // Specify the post_id for the new data

//     console.log("Starting migration for post_id:", postIdToMigrate);

//     // Find the post with the specific post_id
//     const data = sourceData.find(item => JSON.parse(item.post_json).post_id === postIdToMigrate);

//     if (!data) {
//       console.log(`No data found for post_id: ${postIdToMigrate}`);
//       return;
//     }

//     const post = JSON.parse(data.post_json);

//     if (post.type === "LiveBlog") {
//       const article = await Article.findOne({ post_id: post.post_id });

//       if (!article) {
//         console.log(`Article not found for post_id: ${post.post_id}`);
//         return;
//       }

//       // Skip if live_blog_updates are already migrated
//       if (article.live_blog_updates && article.live_blog_updates.length > 0) {
//         console.log(`Live blog updates already migrated for post_id: ${post.post_id}`);
//         return;
//       }

//       if (!Array.isArray(post.live_blog_updates)) {
//         console.warn(`Skipping post with invalid live_blog_updates for post_id: ${post.post_id}`);
//         return;
//       }

//       const liveBlogUpdateIds = [];
//       for (const update of post.live_blog_updates) {
//         const newLiveBlogUpdate = new LiveBlogUpdate({
//           post: article._id,
//           content: update.content,
//           title: update.title,
//           created_at: update.created_at,
//           updated_at: update.updated_at,
//         });

//         const savedUpdate = await newLiveBlogUpdate.save();
//         liveBlogUpdateIds.push(savedUpdate._id);
//       }

//       article.live_blog_updates = liveBlogUpdateIds;
//       await article.save();

//       console.log(`Migrated LiveBlog updates for Article ID: ${article._id}`);
//     }
//   } catch (error) {
//     console.error("Error during migration:", error);
//   }
// };



// async function updateAllWebStoryArticles() {
//   try {
//     // Step 1: Find all articles with the type "Web Story"
//     console.log ("jcbhdsh:")
//     const articles = await Article.find({ type: 'Web Story' });

//     if (articles.length === 0) {
//       console.log('No Web Story articles found');
//       return;
//     }

//     // Step 2: Iterate through each article and update its content
//     for (const article of articles) {
//       // Step 3: Parse the existing content
//       const parsedContent = JSON.parse(article.content);


//       // Step 4: Modify the structure
//       // const newStructure = {
//       //   data: {
//       //     gallery: [], // Optional empty array for future use
//       //     web_story: parsedContent.data.web_story.map(item => ({
//       //       type: item.type.toLowerCase(),
//       //       cta_link: item.cta_link || "",
//       //       cta_text: item.cta_text || "",
//       //       title: item.title || "",
//       //       img_src: item.img_src || "",
//       //       desc: item.desc || ""
//       //     }))
//       //   }
//       // };

//       // Step 5: Update the article's content
//       article.content = parsedContent;

//       // const as = JSON.stringify(parsedContent);
//       // console.log ("ad:", as)
//       // Step 6: Save the updated article
//       await article.save();
//       console.log(`Article with id ${article._id} updated successfully`);
//     }

//     console.log('All Web Story articles updated successfully');
//   } catch (error) {
//     console.error('Error updating Web Story articles:', error);
//   }
// }


// async function updateAllWebStoryArticles() {
//   try {
//     console.log("Starting migration for Web Story articles...");
//     const articles = await Article.find({ type: 'Web Story' });

//     if (articles.length === 0) {
//       console.log('No Web Story articles found');
//       return;
//     }

//     for (const article of articles) {
//       try {
//         const parsedContent = JSON.parse(article.content);

//         // Ensure parsedContent has the correct structure
//         const webStoryData = parsedContent?.data?.web_story || [];

//         // Transforming web_story data to match the schema
//         const newWebStoryData = webStoryData.map(item => ({
//           type: item.type.toLowerCase(),
//           cta_link: item.cta_link || "",
//           cta_text: item.cta_text || "",
//           title: item.title || "",
//           img_src: item.img_src || "",
//           desc: item.desc || ""
//         }));

//         // Update the web_story field
//         article.web_story = newWebStoryData;

//         // Save the updated article
//         await article.save();
//         console.log(`Article with id ${article._id} updated successfully`);
//       } catch (err) {
//         console.error(`Error updating article with id ${article._id}:`, err);
//       }
//     }

//     console.log('All Web Story articles updated successfully');
//   } catch (error) {
//     console.error('Error updating Web Story articles:', error);
//   }
// }




async function addDummyPasswordToUsers() {
  try {
console.log("hu");

    // Dummy password
    const dummyPassword = "dummyPassword123";

    // Hash the dummy password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dummyPassword, salt);

    // Find users without a password field
    const usersWithoutPassword = await User.find({ password: { $exists: false } });
    console.log("da: ", usersWithoutPassword);

    for (const user of usersWithoutPassword) {
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }

    console.log("All users updated successfully.");
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    // Close the database connection
  
  }
}



export { addDummyPasswordToUsers };



