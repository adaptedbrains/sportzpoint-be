// Common pagination helper
import { Article } from "../model/articel.model.js";
const getPaginationParams = (req) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 items per page
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  return { skip, limitNum };
};

// Fetch all published articles
export const getPublishedAllArticles = async (req, res) => {
  try {
    const { skip, limitNum } = getPaginationParams(req);
    const articles = await Article.find({
      published_at_datetime: { $ne: null }, // Ensure `published_at_datetime` is not null
    })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // Sort by newest

    const total = await Article.countDocuments({ status: 'published' });
    res.json({ data: articles, total, page: Math.ceil(skip / limitNum) + 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch published articles' });
  }
};

// Fetch all draft articles by type
export const getAllDraftArticlesByType = async (req, res) => {
  
  
  try {
    const { skip, limitNum } = getPaginationParams(req);
    const { type } = req.query;

    const query = { status: 'draft' };
    if (type === 'Article') {
      if (type) {
        query.type = { $in: ['Article', 'article'] };
      }
    } else {
      query.type = type
    }

    const articles = await Article.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ updatedAt: -1 }); // Sort by last update

    const total = await Article.countDocuments(query);
    res.json({ data: articles, total, page: Math.ceil(skip / limitNum) + 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch draft articles' });
  }
};

// Fetch all posts pending approval with role check
export const getAllPendingApprovalPostsController = async (req, res) => {

  try {
    const { skip, limitNum } = getPaginationParams(req);
    const { type } = req.query;

    // Define query for posts with specific statuses
    const query = { status: { $in: ['send-for-approval', 'pending-approval', 'pending_approval'] } };

    // Add case-insensitive type filter if type is provided
    if (type === 'Article') {
      if (type) {
        query.type = { $in: ['Article', 'article'] };
      }
    } else {
      query.type = type
    }

    // Fetch articles with pagination and sorting
    const articles = await Article.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ updatedAt: -1 });

    // Count total articles matching the query
    const total = await Article.countDocuments(query);

    // Send response
    res.json({
      articles,
      pagination: {
        total,
        limit: limitNum,
        page: Math.ceil(skip / limitNum) + 1,
        totalPages: Math.ceil(total / limitNum),
      }
     
     
    });
  } catch (error) {
    console.error('Error fetching pending approval posts:', error); // Log the error
    res.status(500).json({ error: 'Failed to fetch posts pending approval' });
  }
};


export const getUserPendingApprovalPostsController = async (req, res) => {
  try {

    const { skip, limitNum } = getPaginationParams(req);
    const user = req.user.userId;


    const articles = await Article.find({ status: 'send-for-approval', author: user })
      .skip(skip)
      .limit(limitNum)
      .sort({ updatedAt: -1 });

    const total = await Article.countDocuments({ status: 'send-for-approval', author: user });
    res.json({ data: articles, total, page: Math.ceil(skip / limitNum) + 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts pending approval' });
  }
};



export const searchArticlesByTitle = async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Title query parameter is required' });
  }

  try {
    // Case-insensitive search using regex
    const articles = await Article.find({
      title: { $regex: title, $options: 'i' }
    });

    if (articles.length === 0) {
      return res.status(404).json({ message: 'No articles found' });
    }

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
