import { db } from "../loaders/db.loader.js";
// Import your models
import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";

// Assume `sourceData` is your JSON data
// import sourceData from "../../data.json" assert { type: "json" };

// async function migrateData() {
//   try {

//     // Connect to the database



//     console.log("Connected to the database");
//     // 1. Extract unique categories, tags, and authors
//     const uniqueCategories = new Map();
//     const uniqueTags = new Map();
//     const uniqueAuthors = new Map();


//     sourceData.forEach(data => {
//       // Collect categories
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

//       // Collect tags
//       if (article.tags) {
//         article.tags.forEach(tag => {
//           uniqueTags.set(tag.slug, { name: tag.name, slug: tag.slug });
//         });
//       }

//       // Collect authors
//       if (article.author) {
//         uniqueAuthors.set(article.author.email, {
//           name: article.author.name,
//           email: article.author.email,
//           slug: article.author.slug,
//         });
//       }
//     });



//     // 2. Insert categories, tags, and authors into their collections
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

//  // Step 3: Insert articles with references
//  console.log("Inserting articles...");
//  const bulkOperations = sourceData.map(data => {
//    const article = JSON.parse(data.post_json);
//    return {
//      updateOne: {
//        filter: { post_id: article.post_id },
//        update: {
//          $set: {
//            type: article.type,
//            title: article.title,
//            summary: article.summary,
//            legacy_url: article.legacy_url,
//            primary_category: article.primary_category
//              ? categoryMap.get(article.primary_category.slug)
//              : null,
//            categories: article.categories
//              ? article.categories.map(cat => categoryMap.get(cat.slug))
//              : [],
//            tags: article.tags
//              ? article.tags.map(tag => tagMap.get(tag.slug))
//              : [],
//            author: article.author
//              ? authorMap.get(article.author.email)
//              : null,
//            credits: article.credits
//              ? article.credits.map(credit =>
//                  authorMap.get(credit.email)
//                )
//              : [],
//            published_at_datetime: article.published_at_datetime,
//            updated_at_datetime: article.updated_at_datetime,
//            custom_published_at: article.custom_published_at,
//            banner_image: article.banner_image,
//            banner_desc: article.banner_desc,
//            hide_banner_image: article.hide_banner_image,
//            seo_desc: article.seo_desc,
//            seo_title: article.seo_title,
//            content: article.content,
//          },
//        },
//        upsert: true,
//      },
//    };
//  });

//  await Article.bulkWrite(bulkOperations);
//  console.log("Data migration completed successfully!");
//   } catch (err) {
//     console.error("Error during migration:", err);
//   } finally {
//     // Close the database connection

//   }
// }


// const generateSlug = (title, postId) => {
//   // Generate a slug by replacing spaces with hyphens, removing non-alphanumeric characters
//   let slug = title
//     .replace(/\s+/g, '-') // Replace spaces with hyphens
//     .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters except hyphens
//     .toLowerCase(); // Convert to lowercase

//   // Append postId to ensure uniqueness (optional)
//   if (postId) slug = `${slug}-${postId}`;

//   return slug;
// };

// const updateSlugs = async () => {
//   console.log("hey")
//   try {
//     const articles = await Article.find({ slug: { $exists: false } }); // Find articles without slugs
//     for (const article of articles) {
//       const postId = article.post_id || ''; // Use post_id for uniqueness if available
//       const seoTitle = article.seo_title || ''; // Use seo_title as the base for slug
//       const slug = generateSlug(seoTitle, postId); // Generate the slug
      
//       // Update the article with the generated slug
//       article.slug = slug;
//       await article.save();
//       console.log(`Updated article ID: ${article._id} with slug: ${slug}`);
//     }

//     console.log('Slug migration completed!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error updating slugs:', error);
//     process.exit(1);
//   }
// };

// const generateSlug = (title, postId) => {
//   // Generate a slug by replacing spaces with hyphens, removing non-alphanumeric characters
//   let slug = title
//     .replace(/\s+/g, '-') // Replace spaces with hyphens
//     .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters except hyphens
//     .toLowerCase(); // Convert to lowercase

//   // Append postId to ensure uniqueness (optional)
//   if (postId) slug = `${slug}-${postId}`;

//   return slug;
// };

// const updateSlugs = async () => {
//   console.log("Starting slug migration...");

//   try {
//     // Fetch all articles without a slug or where the slug is empty
//     const articles = await Article.find({ $or: [{ slug: { $exists: false } }, { slug: '' }] });
//     if (articles.length === 0) {
//       console.log("No articles require slug updates.");
//       process.exit(0);
//     }

//     for (const article of articles) {
//       const postId = article.post_id || ''; // Use post_id for uniqueness if available
//       const seoTitle = article.seo_title || article.title || ''; // Use `seo_title`, fallback to `title`

//       if (!seoTitle) {
//         console.warn(`Skipping article ID: ${article._id} because it has no SEO title or title.`);
//         continue;
//       }

//       const slug = generateSlug(seoTitle, postId); // Generate the slug

//       // Update the article with the generated slug
//       article.slug = slug;

//       try {
//         await article.save();
//         console.log(`Updated article ID: ${article._id} with slug: ${slug}`);
//       } catch (saveError) {
//         console.error(`Error saving article ID: ${article._id}`, saveError);
//       }
//     }

//     console.log('Slug migration completed!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error updating slugs:', error);
//     process.exit(1);
//   }
// };



// updateSlugs();



import fs from "fs";
import csv from "csv-parser";



const updateRolesFromCSV = async () => {
  const csvFilePath = "/Users/sajdakabir/Downloads/db/sportz.users - sportz.users.csv"; 
  console.log("hu")
  try {
    // Step 1: Parse CSV
    const updates = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        // Collect data from each row
        updates.push({ email: row.email, role: row.role });
      })
      .on("end", async () => {
        console.log("CSV file successfully processed.");

        // Step 2: Update roles in MongoDB
        for (const { email, role } of updates) {
          console.log("Saj: ", updates)
          if (!email || !role) {
            console.warn(`Skipping row with missing email or role: ${email}, ${role}`);
            continue;
          }

          try {
            // Find user by email and update the role
            const user = await User.findOneAndUpdate(
              { email }, // Find user by email
              { $set: { roles: [role] } }, // Update the `roles` field
              { new: true } // Return the updated document
            );

            if (user) {
              console.log(`Updated user: ${email} with role: ${role}`);
            } else {
              console.warn(`No user found with email: ${email}`);
            }
          } catch (err) {
            console.error(`Error updating user with email: ${email}`, err);
          }
        }

        console.log("Role update migration completed.");
        process.exit(0);
      });
  } catch (err) {
    console.error("Error processing migration:", err);
    process.exit(1);
  }
};

// Run the migration
const csvFilePath = "/Users/sajdakabir/Downloads/db/sportz.users.csv"; // Replace with the path to your CSV file
// updateRolesFromCSV(csvFilePath);



export {
  // migrateData
  // updateSlugs

  updateRolesFromCSV
};
