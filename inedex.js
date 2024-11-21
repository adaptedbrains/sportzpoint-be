const express = require('express');
const Post = require('./models/post');
const app = express();
const port = 8000;
require("./db");
app.get('/v2', async (req, res) => {
    try {
      const { limit = 10, page = 1, category } = req.query;
  
      // Validate and sanitize input
      const limitInt = Math.max(parseInt(limit, 10), 1); // Default to 10, ensure it's at least 1
      const pageInt = Math.max(parseInt(page, 10), 1);   // Default to 1, ensure it's at least 1
  
      // Construct the query object
      const query = {};
      if (category) {
        query.category = 'football';
      }
  
      // Perform the database query with pagination and filtering
      const posts = await Post.find(query)
        .skip((pageInt - 1) * limitInt)
        .limit(limitInt);
  
      const postCount = await Post.countDocuments(query); // Get total number of posts
  
      res.json({
        posts,
        totalPosts: postCount,
        totalPages: Math.ceil(postCount / limitInt), // Total pages
        currentPage: pageInt,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 