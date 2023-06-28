const express = require("express");
const router = express.Router();
const checkUserChannelMembership = require("../middleware/checkUserChannelMembership");
const Post = require("../models/posts");
const Channel = require("../models/channel");
const mongoose = require("mongoose");
const checkChannelOwnership = require("../middleware/checkChannelOwnership");

router.get("/channels/:id/moderate", isAuthenticated, checkUserChannelMembership, async (req, res) => {
  try {
    const channelId = req.params.id;
    const channel = await Channel.findById(channelId);
    // Return a post with a populated flagged, and only from that channel that is being moderated
    const flaggedPosts = await Post.find({ channel: channelId, flagged: { $exists: true, $not: { $size: 0 } } });
    // Return comment from channelID that has populated comflagged.
    const flaggedComments = await Post.find(
      { 
        channel: channelId,
        comments: { 
          $elemMatch: { 
            comflagged: { $exists: true, $not: { $size: 0 } } 
          } 
        } 
      },
    );
    res.render("moderateChannel.ejs", { channelName: channel.name, flaggedPosts, flaggedComments, channelId: channelId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving flagged posts and comments." });
  }
});

router.post('/channels/:postId/comments/:commentId/clear-flags',isAuthenticated, checkChannelOwnership, async (req, res) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;

  try {
    const post = await Post.findById(postId);

    if (post) {
      const comment = post.comments.id(commentId);

      if (comment) {
        comment.comflagged = []; // Clear the comflagged array
        await post.save();
        const channelId = post.channel;
        res.redirect(`/channels/${channelId}/moderate`);
      } else {
        res.status(404).send("Comment was not found");
      }
    } else {
      res.status(404).send("Comment was not found");
    }
  } catch (error) {
    res.status(500).send("Error clearing flags");
  }
});

router.post('/channels/:postId/clear-flags', isAuthenticated, checkChannelOwnership, async (req, res) => {
  const postId = req.body.postId;

  try {
    const post = await Post.findById(postId);

    if (post) {
      post.flagged = []; // Clear the flagged arrray
      await post.save();

      const channelId = post.channel; // Get the channelID
      res.redirect(`/channels/${channelId}/moderate`);
    } else {
      res.status(404).send("Post was not found");
    }
  } catch (error) {
    res.status(500).send("Error clearing flags");
  }
});





function isAuthenticated(req, res, next) {
    if (req.session && req.session.username && req.session.userId) {
      req.user = { _id: req.session.userId };
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;