import { Router } from "express";
import { publishPostController, getPendingApprovalPostsController, unpublishPostController, goLiveController, stopLiveController } from '../controllers/admin.controller.js';
import { isAdmin, authenticateJWT, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/post/publish/:id").get(authenticateJWT, checkRole(['Admin', 'Editor']), publishPostController);

router.route("/post/unpublish/:id").patch(authenticateJWT, checkRole(['Admin', 'Editor']), unpublishPostController);

router.patch("/post/live/:id", authenticateJWT, checkRole(['Admin', 'Editor']), goLiveController);

router.patch("/post/stop-live/:id", authenticateJWT, checkRole(['Admin', 'Editor']), stopLiveController);

router.get("/posts/pending-approval", authenticateJWT, checkRole(['Admin, Editor']), getPendingApprovalPostsController);

export default router;
