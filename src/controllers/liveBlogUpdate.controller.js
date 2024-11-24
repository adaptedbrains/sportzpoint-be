import { Article } from "../model/articel.model.js";
import { LiveBlogUpdate } from "../model/ liveBlogUpdate.model.js";
import { broadcast } from "../../index.js";

export const addLiveBlogUpdate = async (req, res) => {
  try {
    const { postId } = req.params;
    const requestedData = req.body;

    const article = await Article.findById(postId);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (article.type !== "LiveBlog") {
      return res
        .status(400)
        .json({ success: false, message: "Article is not a LiveBlog type" });
    }

    // if (article.status !== "published") {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Article must be published to add updates" });
    // }

    const update = await LiveBlogUpdate.create({
      post: postId,
      ...requestedData,
    });

    article.live_blog_updates.push(update._id);
    await article.save();

    // Broadcast the update to all clients
    broadcast({ type: "ADD_LIVEBLOG_UPDATE", data: update });


    res.status(201).json({ success: true, update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const editLiveBlogUpdate = async (req, res) => {
    try {
      const { updateId } = req.params;
      const requestedData = req.body;
  
      const update = await LiveBlogUpdate.findByIdAndUpdate(
        updateId,
        { ...requestedData, updated_at: new Date() },
        { new: true }
      );
  
      if (!update) {
        return res.status(404).json({ success: false, message: "Update not found" });
      }
      // Broadcast the update to all clients
      broadcast({ type: "EDIT_LIVEBLOG_UPDATE", data: update });

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
      // Broadcast the delete event to all clients
      broadcast({ type: "DELETE_LIVEBLOG_UPDATE", data: { updateId } });

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
        // Broadcast the pin event to all clients
        broadcast({ type: "PIN_LIVEBLOG_UPDATE", data: update });


  
      res.status(200).json({ success: true, update });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

  export const getLiveBlogUpdates = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const article = await Article.findById(postId)
        .populate("live_blog_updates")
        .exec();
  
      if (!article) {
        return res.status(404).json({ success: false, message: "Article not found" });
      }
  
      if (article.type !== "LiveBlog") {
        return res.status(400).json({ success: false, message: "Not a LiveBlog article" });
      }
  
      // Include the article details in the response
      res.status(200).json({ success: true, article, updates: article.live_blog_updates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  