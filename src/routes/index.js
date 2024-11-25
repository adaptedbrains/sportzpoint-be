import ArticleRouter from "./article.route.js";
import AuthRouter from "./user.router.js"
import AdminRouter from "./admin.route.js"
import LiveBlogUpdateRouter from "./liveBlogUpdate.route.js"
import UserRouter from "./user.router.js"
/**
 * @param {import('express').Application} app
 */
const initRoutes = (app) => {
    app.use("/", ArticleRouter);
    app.use("/", LiveBlogUpdateRouter);
    app.use("/auth", AuthRouter);
    app.use("/admin", AdminRouter);
    app.use("/user", UserRouter)
    app.get("/", async (req, res) => {
        res.json({
            "message": "Welcome to Sportzpoint Developers Portal"
        })
    })

    app.use("*", (req, res) => {
        res.status(404).json({
            "status": 404,
            "message": "Invalid route"
        })
    })
}

export {
    initRoutes
}
