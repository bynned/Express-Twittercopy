const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

const date = require("date-and-time");

const now = new Date();
const UTC = date.addHours(now, 3);
const dateNtime = date.format(UTC, "DD/MM/YYYY HH:mm:ss", true);


// This is for posting a new post :)
router.post("/", isAuthenticated, (req, res) => {
  const postContent = req.body.post;

  const newPost = new Post({
    username: req.session.username,
    content: postContent,
    timestamp: dateNtime,
  });

  newPost
    .save()
    .then(() => {
      console.log("Post saved:", newPost);
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      res.redirect("/");
    });
});

// This is for when opening a post in the '/' route. It will then render the post.ejs
router.get("/post/:postId", isAuthenticated, (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }
      res.render("post.ejs", { post: post });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

// This is for posting a comment on a particular post
router.post("/post/:postId", isAuthenticated, async (req, res) => {
  const postId = req.params.postId;
  const commentContent = req.body.content;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      username: req.session.username,
      content: commentContent,
      timestamp: dateNtime,
      comlikedBy: [],
      comdislikedBy: [],
    };
    post.comments.push(comment);

    await post.save();

    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
