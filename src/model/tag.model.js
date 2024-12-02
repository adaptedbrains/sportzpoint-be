import { Schema } from "mongoose";
import { db } from "../loaders/db.loader.js";

// Helper function to generate a unique slug for tags
const generateUniqueSlug = async (slug) => {
    let uniqueSlug = slug;
    let count = 1;

    // Check if the slug already exists
    while (await Tag.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
    }

    return uniqueSlug;
};

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

// Ensuring unique slug before saving
TagSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('slug')) {
        // If the slug is new or modified, generate a unique slug
        this.slug = await generateUniqueSlug(this.slug);
    }

    if (this.isNew) {
        // Auto-increment the id field for new tags
        const lastTag = await this.constructor.findOne().sort({ id: -1 });
        this.id = lastTag ? lastTag.id + 1 : 1;
    }

    next();
});

TagSchema.index({
    name: "text"
});

const Tag = db.model('Tag', TagSchema, 'tags');

export {
    Tag
};
