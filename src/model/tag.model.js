import { Schema } from "mongoose";
import { db } from "../loaders/db.loader.js";

const TagSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },

    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

TagSchema.index({
    name: "text"
})

TagSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastTag = await this.constructor.findOne().sort({ id: -1 });
        this.id = lastTag ? lastTag.id + 1 : 1;
    }
    next();
});

const Tag = db.model('Tag', TagSchema, 'tags')

export {
    Tag
};
