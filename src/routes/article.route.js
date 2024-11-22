import { Router } from "express";
import { createArticleController, getAllTagController } from "../controllers/article.controller.js";


const router = Router();
router.route("/tag/").get(getAllTagController)

router.route("/artical/create").post(createArticleController)



export default router;
