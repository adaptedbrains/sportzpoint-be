import { Router } from "express";
import { publishPostController , getPendingApprovalPostsController} from '../controllers/admin.controller.js';

const router = Router();

router.route("/post/publish/:id").post(publishPostController);
router.get("/posts/pending-approval", getPendingApprovalPostsController);

export default router;