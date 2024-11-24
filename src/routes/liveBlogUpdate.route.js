import express from "express";
import {
  addLiveBlogUpdate,
  editLiveBlogUpdate,
  deleteLiveBlogUpdate,
  pinLiveBlogUpdate,
} from "../controllers/liveBlogUpdate.controller.js";

const router = express.Router();

// Add live blog update
// all are going to be protected routes
router.post("/posts/:postId/live-blog/update", addLiveBlogUpdate);

// Edit live blog update
router.patch("/live-blog/update/:updateId", editLiveBlogUpdate);

// Delete live blog update
router.delete("/live-blog/update/:updateId", deleteLiveBlogUpdate);

// Pin live blog update
router.patch("/live-blog/update/:updateId/pin", pinLiveBlogUpdate);

export default router;
