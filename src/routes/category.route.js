import express from 'express';
import { Category } from '../model/category.model.js'; // Adjust the path as needed

const router = express.Router();

// POST /api/categories
router.post('/categories', async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required.' });
        }

        // Create a new category
        const category = new Category({ name, slug });

        // Save the category to the database
        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle unique constraint violation (e.g., duplicate slug)
            return res.status(409).json({ message: 'Slug must be unique.' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default router;
