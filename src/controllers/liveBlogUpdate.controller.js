import { Article } from "../models/article.model.js";
import { LiveBlogUpdate } from "../models/liveBlogUpdate.model.js";

export const addLiveBlogUpdate = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const article = await Article.findById(postId);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (article.type !== "LiveBlog") {
      return res
        .status(400)
        .json({ success: false, message: "Article is not a LiveBlog type" });
    }

    if (article.status !== "published") {
      return res
        .status(400)
        .json({ success: false, message: "Article must be published to add updates" });
    }

    const update = await LiveBlogUpdate.create({
      post: postId,
      content,
    });

    article.live_blog_updates.push(update._id);
    await article.save();

    res.status(201).json({ success: true, update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const editLiveBlogUpdate = async (req, res) => {
    try {
      const { updateId } = req.params;
      const { content } = req.body;
  
      const update = await LiveBlogUpdate.findByIdAndUpdate(
        updateId,
        { content, updated_at: new Date() },
        { new: true }
      );
  
      if (!update) {
        return res.status(404).json({ success: false, message: "Update not found" });
      }
  
      res.status(200).json({ success: true, update });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  
  export const deleteLiveBlogUpdate = async (req, res) => {
    try {
      const { updateId } = req.params;
  
      const update = await LiveBlogUpdate.findByIdAndDelete(updateId);
  
      if (!update) {
        return res.status(404).json({ success: false, message: "Update not found" });
      }
  
      // Remove the reference from the Article model
      await Article.findByIdAndUpdate(update.article, {
        $pull: { live_blog_updates: updateId },
      });
  
      res.status(200).json({ success: true, message: "Update deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const pinLiveBlogUpdate = async (req, res) => {
    try {
      const { updateId } = req.params;
  
      const update = await LiveBlogUpdate.findByIdAndUpdate(
        updateId,
        { pinned: true },
        { new: true }
      );
  
      if (!update) {
        return res.status(404).json({ success: false, message: "Update not found" });
      }
  
      res.status(200).json({ success: true, update });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  