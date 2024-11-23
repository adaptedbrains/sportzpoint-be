import { Router } from "express";
import { publishPostController } from '../controllers/admin.controller.js';

const router = Router();

router.route("/post/publish/:id").post(publishPostController);

export default router;
