const express = require('express');
const router = express.Router();
const Post = require('.././models/posts');

router.get('/profile/:username', (req, res) => {
    const { username } = req.params;

    Post.find({ username: username })
      .sort({ timestamp: -1 })
      .then((posts) => {
        res.render('profile.ejs', { username: username, posts: posts });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        res.render('profile.ejs', { username: username, posts: [] });
      });
});

module.exports = router;

