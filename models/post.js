const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_json: {
        post_id: { type: Number, required: true },
        title: { type: String, required: true },
        summary: { type: String, required: true },
        legacy_url: { type: String, required: true },
        primary_category: {
            slug: { type: String, required: true },
            name: { type: String, required: true }
        },
        categories: [
            {
                slug: { type: String, required: true },
                name: { type: String, required: true }
            }
        ],
        published_at_datetime: { type: Date, required: true },
        updated_at_datetime: { type: Date, required: true },
        custom_published_at: { type: Date, default: null },
        banner_image: { type: String, required: true },
        banner_desc: { type: String, default: "" },
        hide_banner_image: { type: Boolean, default: null },
        type: { type: String, required: true },
        seo_desc: { type: String, required: true },
        seo_title: { type: String, required: true },
        content: { type: String, required: true },
        live_blog_updates: { type: String, default: null }
    },
    author: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true }
    },
    credits: [
        {
            email: { type: String, required: true },
            name: { type: String, required: true },
            slug: { type: String, required: true }
        }
    ],
    tags: [
        {
            slug: { type: String, required: true },
            name: { type: String, required: true }
        }
    ]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
