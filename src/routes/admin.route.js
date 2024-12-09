import { Router } from "express";
import { publishPostController, unpublishPostController, goLiveController, stopLiveController, checkingController } from '../controllers/admin.controller.js';
import { isAdmin, authenticateJWT, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/post/publish/:id").put(authenticateJWT, checkRole(['Admin', 'Editor']), publishPostController);

router.route("/post/unpublish/:id").patch(authenticateJWT, checkRole(['Admin', 'Editor']), unpublishPostController);

router.patch("/post/live/:id", authenticateJWT, checkRole(['Admin', 'Editor']), goLiveController);

router.patch("/post/stop-live/:id", authenticateJWT, checkRole(['Admin', 'Editor']), stopLiveController);



router.get("/check", authenticateJWT, checkingController);
export default router;
