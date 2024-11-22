import { Router } from "express";
import { createArticleController } from "../controllers/article.controller.js";


const router = Router();

router.route("/create").post(createArticleController)

export default router;
