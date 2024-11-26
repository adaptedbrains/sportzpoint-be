import express from "express";
import {
  addLiveBlogUpdate,
  editLiveBlogUpdate,
  deleteLiveBlogUpdate,
  pinLiveBlogUpdate,
  getLiveBlogUpdates
} from "../controllers/liveBlogUpdate.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { getMediaFileNames } from "../controllers/media.controller.js";
import { getArticlesByAuthor } from "../controllers/user.controller.js"

const router = express.Router();

// public route 
router.get("/post/:postId/live-blog/updates", getLiveBlogUpdates);

// Add live blog update
// all are going to be protected routes
router.post("/posts/:postId/live-blog/update", authenticateJWT, addLiveBlogUpdate);

// Edit live blog update
router.patch("/live-blog/update/:updateId", authenticateJWT, editLiveBlogUpdate);

// Delete live blog update
router.delete("/live-blog/update/:updateId", authenticateJWT, deleteLiveBlogUpdate);

// Pin live blog update
router.patch("/live-blog/update/:updateId/pin", authenticateJWT, pinLiveBlogUpdate);


// Route to fetch media file names
router.get("/media",authenticateJWT,  getMediaFileNames);
router.get('/my-posts', authenticateJWT, getArticlesByAuthor);

export default router;
