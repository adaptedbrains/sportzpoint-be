import { Article } from "../model/articel.model.js";

export const createArticleController = async (req, res, next) => {
    const requestedData = req.body;
    try {

        const newArticle = new Article({
        ...requestedData
    });

    const article = await newArticle.save()
    return res.status(200).json({ article });
} catch (err) {
    console.log("err: ", err)
  next(err)
}
};

