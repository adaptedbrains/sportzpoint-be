import { Router } from "express";
import { createArticleController, getAllTagController, getAllCategoryController, searchTagByNameController, searchCategoryByNameController, updateArticleController, publishArticleController, getArticlesByCategorySlug, getArticleByIdController, getArticlesByTagSlug, getLatestArticles, getArticleBySlugController, getArticlesByType, getPublishedArticlesByType, saveAsDraftController, getDraftArticlesByType, sendForApprovalController, getArticlesByCategoryAndTypeController, deleteArticleController, updateArticleByIdController } from "../controllers/article.controller.js";
import { isAdmin, authenticateJWT, checkRole } from '../middleware/auth.middleware.js';
import { getPendingApprovalPostsController } from "../controllers/admin.controller.js"
import { getPublishedAllArticles, getAllDraftArticlesByType, getAllPendingApprovalPostsController, searchArticlesByTitle } from "../controllers/getAllpost.js";


const router = Router();
router.route("/tag/").get(getAllTagController)
router.route("/category/").get(getAllCategoryController)
router.route("/tag/search").get(searchTagByNameController)
router.route("/category/search").get(searchCategoryByNameController)

router.route("/article/create").post(createArticleController)
<<<<<<< HEAD
router.route("/article/update").put(updateArticleController)
router.route("/article/delete").put(deleteArticleController)
=======
router.route("/article/update/:id").patch(updateArticleController);
>>>>>>> 95ebfc2f81e4d4803e84670ac805c449e8f5dd5b
router.route("/article/publish").get(publishArticleController) // end user
router.get("/article/latest-articles", getLatestArticles);  // end user
router.get("/articles/category/:slug", getArticlesByCategorySlug); // end user
router.get("/articles/tags/:slug", getArticlesByTagSlug); // end user
router.get("/articles/type/:type", getArticlesByType);  // end user
router.get("/article/:id", getArticleByIdController);  // end user
router.get("/article/slug/:slug", getArticleBySlugController); // end user

// New route to get articles by category and type
router.get("/articles/category/:slug/type/:type", getArticlesByCategoryAndTypeController); // end user


router.get("/posts/published", getPublishedArticlesByType);  // end user
router.post("/posts/draft", authenticateJWT, saveAsDraftController); 
router.get("/posts/draft", authenticateJWT,  getDraftArticlesByType);
router.get("/posts/send-for-approval", authenticateJWT, sendForApprovalController);
router.get("/posts/pending-approval", authenticateJWT, checkRole(['Admin', 'Editor']), getPendingApprovalPostsController);

router.delete("/article/:id", authenticateJWT, deleteArticleController);

router.route("/article/update/:id").put(authenticateJWT, updateArticleByIdController);



// get all the posts by typr


router.get("/posts/published/all", getPublishedAllArticles); 
router.get("/posts/draft/all", authenticateJWT,  getAllDraftArticlesByType);
router.get("/posts/pending-approval/all", authenticateJWT, checkRole(['Admin', 'Editor']), 
getAllPendingApprovalPostsController);
router.get('/posts/search', searchArticlesByTitle);



// published posts



export default router;
