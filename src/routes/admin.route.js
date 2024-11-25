import { Router } from "express";
import { publishPostController , getPendingApprovalPostsController, unpublishPostController} from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/post/publish/:id").get(authenticateJWT, isAdmin, publishPostController);
router.route("/post/unpublish/:id").patch(authenticateJWT, isAdmin, unpublishPostController);
router.get("/posts/pending-approval", authenticateJWT, isAdmin, getPendingApprovalPostsController);

export default router;
