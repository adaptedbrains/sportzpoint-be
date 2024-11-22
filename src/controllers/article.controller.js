import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";
import { User } from "../model/user.model.js";

export const createArticleController = async (req, res, next) => {
  const requestedData = req.body;
  try {
    const newArticle = new Article({
      ...requestedData,
    });

    const article = await newArticle.save();
    return res.status(200).json({ article });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const getAllTagController = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({ tags });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const getAllCategoryController = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const searchTagByNameController = async (req, res, next) => {
  try {
    const { name } = req.query; 
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const tag = await Tag.findOne({ name: new RegExp(name, 'i') });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json({ tag });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const searchCategoryByNameController = async (req, res, next) => {
  try {
    const { name } = req.query; 
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOne({ name: new RegExp(name, 'i') });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const updateArticleController = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body; 

        const updatedArticle = await ArticleModel.updateArticle(id, updateData);

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.status(200).json({ message: "Article updated successfully", article: updatedArticle });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating the article", error: error.message });
    }
};


export const publishArticleController = async (req, res) => {
    try {
        // Get the limit and page from query parameters, with default values
        const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
        const page = parseInt(req.query.page, 10) || 1;    // Default page is 1

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Query articles with published_at_datetime and apply pagination
        const articles = await Article.find({
            published_at_datetime: { $ne: null } // Only published articles
        })
            .limit(limit) // Limit the number of results
            .skip(skip)   // Skip documents for pagination
            .sort({ published_at_datetime: -1 }); // Optional: sort by publish date (descending)

        // Count the total number of articles matching the query (for pagination metadata)
        const totalCount = await Article.countDocuments({
            published_at_datetime: { $ne: null }
        });

        // Send the response with articles and pagination info
        res.status(200).json({
            articles,
            pagination: {
                total: totalCount,       // Total number of articles
                limit,                   // Number of articles per page
                currentPage: page,       // Current page
                totalPages: Math.ceil(totalCount / limit) // Total number of pages
            }
        });
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getArticlesByCategorySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { limit = 10, page = 1 } = req.query;

        // Validate limit and page
        const limitValue = Math.max(Number(limit), 1); // Ensure limit is at least 1
        const pageValue = Math.max(Number(page), 1);   // Ensure page is at least 1

        // Find the category by its slug
        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch articles with populated references
        const articles = await Article.find({ primary_category: category._id })
            .populate("primary_category", "name slug") // Populate primary category
            .populate("categories", "name slug")       // Populate secondary categories
            .populate("tags", "name slug")             // Populate tags
            .populate("author", "name email social_profiles profile_picture")          // Populate author details
            .populate("credits", "name email social_profiles profile_picture")         // Populate credits details
            .sort({ published_at_datetime: -1 })       // Sort by published_at_datetime
            .skip((pageValue - 1) * limitValue)        // Skip documents for pagination
            .limit(limitValue);                        // Limit the number of documents

        // Get the total count of articles for the category
        const totalArticles = await Article.countDocuments({ primary_category: category._id });

        res.status(200).json({
            articles,
            pagination: {
                total: totalArticles,
                limit: limitValue,
                page: pageValue,
                totalPages: Math.ceil(totalArticles / limitValue),
            },
        });
    } catch (error) {
        console.error("Error fetching articles by category slug:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};