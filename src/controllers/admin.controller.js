import { Article } from '../model/articel.model.js';
import { User } from '../model/user.model.js';
// import { generateNewsSitemap } from '../service/sitemap.service.js';

// export const publishPostController = async (req, res) => {
//     try {
//         const { id } = req.params; // Get MongoDB _id from request parameters

//         // Find the article by _id and populate related fields
//         const article = await Article.findOne({ _id: id })
//             .populate("primary_category", "name slug") // Populate primary category
//             .populate("categories", "name slug")       // Populate secondary categories
//             .populate("tags", "name slug")             // Populate tags
//             .populate("author", "name email social_profiles profile_picture") // Populate author details
//             .populate("credits", "name email social_profiles profile_picture") // Populate credits details
//             .populate("live_blog_updates");

//         if (!article) {
//             return res.status(404).json({ message: 'Article not found' });
//         }

//         // Update the published_at_datetime to the current date
//         article.published_at_datetime = new Date();
//         await article.save();
//         await generateNewsSitemap(); 
//         return res.status(200).json({ message: 'Article published successfully', article });
//     } catch (error) {
//         return res.status(500).json({ message: 'An error occurred', error });
//     }
// };




export const publishPostController = async (req, res) => {
    try {
        const { id } = req.params; // Get MongoDB _id from request parameters

        // Find the article by _id
        const article = await Article.findOne({ _id: id })
            .populate("primary_category", "name slug") // Populate primary category
            .populate("categories", "name slug")       // Populate secondary categories
            .populate("tags", "name slug")             // Populate tags
            .populate("author", "name email social_profiles profile_picture") // Populate author details
            .populate("credits", "name email social_profiles profile_picture") // Populate credits details
            .populate("live_blog_updates");

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Check if there's an existing article with the same oldId but a different _id
        if (article.oldId) {
            const existingArticle = await Article.findOne({
                oldId: article.oldId,
                _id: { $ne: article._id }, // Exclude the current article
            });

            if (existingArticle) {
                // Delete the existing article with the same oldId
                await Article.deleteOne({ _id: existingArticle._id });
                console.log(`Deleted existing article with _id: ${existingArticle._id} and oldId: ${existingArticle.oldId}`);
            }
        }

        // Update the published_at_datetime to the current date
        article.published_at_datetime = new Date();
        article.status = "published";
        await article.save();

        // Regenerate the sitemap after publishing
        // await generateNewsSitemap();

        return res.status(200).json({ message: 'Article published successfully', article });
    } catch (error) {
        console.error('Error in publishing article:', error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};



export const getPendingApprovalPostsController = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query; // Extract type, page, and limit from query parameters

        const query = { status: 'pending_approval' }; // Base query for pending approval posts

        // Add type filter if provided
        if (type) {
            query.type = type;
        }

        const skip = (page - 1) * limit; // Calculate how many articles to skip for pagination

        // Fetch articles based on the query
        const articles = await Article.find(query)
            .populate("primary_category", "name slug") // Populate primary category
            .populate("categories", "name slug")       // Populate secondary categories
            .populate("tags", "name slug")             // Populate tags
            .populate("author", "name email social_profiles profile_picture") // Populate author details
            .populate("credits", "name email social_profiles profile_picture") // Populate credits details
            .populate("live_blog_updates")
            sort({ createdAt: -1 })        // Sort by latest `published_at_datetime`
            .skip(skip)        // Skip documents for pagination
            .limit(parseInt(limit)) // Limit the number of documents

        // Get total count of matching articles for pagination metadata
        const totalCount = await Article.countDocuments(query);

        return res.status(200).json({
            articles,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching pending approval posts',
            error: error.message, // Include error message for debugging
        });
    }
};


export const unpublishPostController = async (req, res) => {
    try {
        const { id } = req.params; // Get MongoDB _id from request parameters

        // Find the article by _id
        const article = await Article.findOne({ _id: id });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Set the published_at_datetime to null
        article.published_at_datetime = null;
        await article.save();

        return res.status(200).json({ message: 'Article unpublished successfully', article });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
};

export const goLiveController = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the article by ID
        const article = await Article.findById(id);

        // Check if the article exists and is published
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        if (!article.published_at_datetime) {
            return res.status(400).json({ message: "Article must be published to go live" });
        }

        // Set the article to live
        article.isLive = true;
        await article.save();

        return res.status(200).json({ message: "Article is now live", article });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const stopLiveController = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the article by ID
        const article = await Article.findById(id);

        // Check if the article exists
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Set the article to not live
        article.isLive = false;
        await article.save();

        return res.status(200).json({ message: "Article is no longer live", article });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


export const checkingController = async (req, res) => {
  try {

    const userId = req.user.userId; // retrieved from the JWT payload



    // Fetch the user using userId and lean to return plain JavaScript object
    const user = await User.findOne({ _id: userId }).lean();

    // If no user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

  

