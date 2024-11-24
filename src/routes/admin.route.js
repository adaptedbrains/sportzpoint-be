import { Router } from "express";
import { publishPostController , getPendingApprovalPostsController, unpublishPostController} from '../controllers/admin.controller.js';

const router = Router();

router.route("/post/publish/:id").get(publishPostController);
router.route("/post/unpublish/:id").patch(unpublishPostController);
router.get("/posts/pending-approval", getPendingApprovalPostsController);

export default router;
