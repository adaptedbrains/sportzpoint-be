import { Router } from "express";
import { createArticleController, getAllTagController, getAllCategoryController } from "../controllers/article.controller.js";


const router = Router();
router.route("/tag/").get(getAllTagController)
router.route("/category/").get(getAllCategoryController)

router.route("/artical/create").post(createArticleController)



export default router;
