const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const date = require("date-and-time");
const checkChannelPostMembership = require("../middleware/checkChannelPostMembership");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images")); // The folder where the images will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// This is for posting a new post :)
router.post("/", isAuthenticated, upload.single("image"), (req, res) => {
  const now = new Date();
  const UTC = date.addHours(now, 3);
  const dateNtime = date.format(UTC, "DD/MM/YYYY HH:mm:ss", true);
  const postContent = req.body.post;
  const channelId = req.body.channelId;
  const postTitle = req.body.title;

  const newPost = new Post({
    username: req.session.username,
    title: postTitle,
    content: postContent,
    timestamp: dateNtime,
    channel: channelId,
    image: req.file ? "/images/" + req.file.filename : null,
  });

  newPost
    .save()
    .then(() => {
      console.log("Post saved:", newPost);
      res.redirect("/channels/" + channelId);
      // res.redirect by default sends HTTP status code of 301. And i would love to have
      // 201. But for some reason it doesn't work the way i want it to work.
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      res.redirect("/channels/" + channelId);
    });
});

// This is for when opening a post in the '/' route. It will then render the post.ejs
router.get("/post/:postId", isAuthenticated, checkChannelPostMembership, (req, res) => {
  const postId = req.params.postId;
  const username = req.session.username;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }
      const sortedComments = post.comments.sort((a, b) => {
        return b.comlikedBy.length - a.comlikedBy.length;
      });
      const imagePath = post.image ? post.image : null;
      res.status(200).render("post.ejs", { post: post, comments: sortedComments, username: username, image: imagePath, });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});


// This is for posting a comment on a particular post
router.post("/post/:postId", isAuthenticated, async (req, res) => {
  const now = new Date();
  const UTC = date.addHours(now, 3);
  const dateNtime = date.format(UTC, "DD/MM/YYYY HH:mm:ss", true);
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

// Route for flagging a post.
router.post("/post/:postId/report-post", isAuthenticated, checkChannelPostMembership, async (req, res) => {
  try {
    const postId = req.body.postId;
    const username = req.session.username;
    const post = await Post.findById(postId);

    // Add the username to the flagged array if it's not already present
    if (!post.flagged.includes(username)) {
      post.flagged.push(username);
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post successfully flagged." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error flagging the post." });
  }
});

// Route for flagging a comment
router.post("/post/:postId/:commentId/report-comment", isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);
    const username = req.session.username;

    // Add the username to the flagged array if it's not already present
    if (!comment.comflagged.includes(username)) {
      comment.comflagged.push(username);
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Comment successfully flagged." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error flagging the comment." });
  }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
