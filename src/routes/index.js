import ArticleRouter from "./article.route.js";
import AuthRouter from "./user.router.js"
import AdminRouter from "./admin.route.js"
/**
 * @param {import('express').Application} app
 */
const initRoutes = (app) => {
    app.use("/", ArticleRouter);
    app.use("/auth", AuthRouter);
    app.use("/admin", AdminRouter);
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
