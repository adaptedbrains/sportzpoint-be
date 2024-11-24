import { Article } from '../model/articel.model.js';

export const publishPostController = async (req, res) => {
    try {
        const { id } = req.params; // Get MongoDB _id from request parameters

        // Find the article by _id and slug
        const article = await Article.findOne({ _id: id });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Update the published_at_datetime to the current date
        article.published_at_datetime = new Date();
        await article.save();

        return res.status(200).json({ message: 'Article published successfully', article });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
};


export const getPendingApprovalPostsController = async (req, res) => {
    try {
        const pendingArticles = await Article.find({ status: 'pending_approval' });

        return res.status(200).json({ message: 'Pending approval articles retrieved successfully', articles: pendingArticles });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
};
