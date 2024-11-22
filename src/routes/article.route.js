import { Router } from "express";
import { createArticleController, getAllTagController, getAllCategoryController, searchTagByNameController, searchCategoryByNameController, updateArticleController } from "../controllers/article.controller.js";


const router = Router();
router.route("/tag/").get(getAllTagController)
router.route("/category/").get(getAllCategoryController)
router.route("/tag/search").get(searchTagByNameController)
router.route("/category/search").get(searchCategoryByNameController)

router.route("/article/create").post(createArticleController)
router.route("/article/update").put(updateArticleController)



export default router;
