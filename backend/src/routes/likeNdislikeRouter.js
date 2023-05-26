const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.post("/post/:postId/:commentId/like", isAuthenticated, async (req, res) => {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;

      const post = await Post.findById(postId);
      const comment = post.comments.id(commentId);

      if (comment.comlikedBy.includes(req.session.username)) {
        return res.redirect(req.headers.referer);
      }
      if (comment.comdislikedBy.includes(req.session.username)) {
        // If the user has already liked the comment and decides to dislike it,
        // It would take away the user from the comlikedBy array.
        comment.comdislikedBy = comment.comdislikedBy.filter(
          (user) => user !== req.session.username
        );
        comment.comlikedBy.push(req.session.username);
      } else {
        comment.comlikedBy.push(req.session.username);
      }
      await post.save();
      res.redirect(req.headers.referer);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/post/:postId/:commentId/dislike", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);

    if (comment.comdislikedBy.includes(req.session.username)) {
      return res.redirect(req.headers.referer);
    }
    if (comment.comlikedBy.includes(req.session.username)) {
      // If the user has already liked the comment and decides to like it,
      // It would take away the user from the comdislikedBy array.
      comment.comlikedBy = comment.comlikedBy.filter(
        (user) => user !== req.session.username
      );
      comment.comdislikedBy.push(req.session.username);
    } else {
      comment.comdislikedBy.push(req.session.username);
    }
    await post.save();
    res.redirect(req.headers.referer);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
);

router.post("/post/:postId/like", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // Check if the user has already liked the post
    if (post.likedBy.includes(req.session.username)) {
      return res.status(200).json({ message: "you already liked this post" });
    }

    if (post.dislikedBy.includes(req.session.username)) {
      // If the user has already disliked the post and decides to like it,
      // It would take away the user from the dislikedBy array.
      post.dislikedBy = post.dislikedBy.filter(
        (user) => user !== req.session.username
      );
      post.likedBy.push(req.session.username);
    } else {
      post.likedBy.push(req.session.username);
    }
    await post.save();

    res.status(201).json({ message: "you liked this post" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/post/:postId/dislike", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // Check if the user has already disliked the post
    if (post.dislikedBy.includes(req.session.username)) {
      return res.status(200).json({ message: "you already liked this post" });
    }

    if (post.likedBy.includes(req.session.username)) {
      // If the user has already liked the post and decides to dislike it,
      // It would take away the user from the likedBy array.
      post.likedBy = post.likedBy.filter(
        (user) => user !== req.session.username
      );
      post.dislikedBy.push(req.session.username);
    } else {
      post.dislikedBy.push(req.session.username);
    }
    await post.save();

    res.status(201).json({ message: "you liked this post" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
