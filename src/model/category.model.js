import { Schema } from "mongoose";
import { db } from "../loaders/db.loader.js";

const CategorySchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

CategorySchema.index({
    name: "text"
})

CategorySchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastCategory = await this.constructor.findOne().sort({ id: -1 });
        this.id = lastCategory ? lastCategory.id + 1 : 1;
    }
    next();
});

const Category = db.model('Category', CategorySchema, 'categories')

export {
    Category
};
