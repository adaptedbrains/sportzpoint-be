import { Article } from "../model/articel.model.js";
import { Category } from "../model/category.model.js";
import { Tag } from "../model/tag.model.js";

export const createArticleController = async (req, res, next) => {
  const requestedData = req.body;
  try {
    const newArticle = new Article({
      ...requestedData,
    });

    const article = await newArticle.save();
    return res.status(200).json({ article });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const getAllTagController = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({ tags });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};

export const getAllCategoryController = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (err) {
    console.log("err: ", err);
    next(err);
  }
};
