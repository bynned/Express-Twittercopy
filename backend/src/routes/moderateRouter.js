const express = require("express");
const router = express.Router();
const checkUserChannelMembership = require("../middleware/checkUserChannelMembership");
const Post = require("../models/posts");
const Channel = require("../models/channel");
const mongoose = require("mongoose");
const checkChannelOwnership = require("../middleware/checkChannelOwnership");
const channel = require("../models/channel");

router.get("/channels/:id/moderate", isAuthenticated, checkUserChannelMembership, async (req, res) => {
  try {
    const username = req.session.username;
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
    res.render("moderateChannel.ejs", { channelName: channel.name, username: username, flaggedPosts, flaggedComments, channelId: channelId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving flagged posts and comments." });
  }
});

// This clears the flag of a comment, this is done from the moderation page
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

// Clears the flags from a post. this is done from the channels moderation page
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


// Delete a flagged comment from the moderation page
router.delete('/channels/:commentId/comments/:comId', isAuthenticated, checkChannelOwnership, async (req, res) => {
  const commentId = req.body.commentId;
  const postId = req.body.postId;
  const channelId = req.body.channelId;

  try {
    const post = await Post.findById(postId);

    if (post) {
      const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1); // Remove the comment from the array

        await post.save();

        res.redirect(`/channels/${channelId}/moderate`);
      } else {
        res.status(404).send("Comment was not found");
      }
    }
  } catch (error) {
    res.status(500).send("Error deleting comment");
    console.error(error);
  }
});

// Delete a flagged post.
router.delete('/channels/:channelId/:postId', isAuthenticated, checkChannelOwnership, async (req, res) => {
  const channelId = req.params.channelId;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (post) {
      await post.deleteOne(); // Delete the post

      res.redirect(`/channels/${channelId}/moderate`); // Redirect back to the moderation page
    } else {
      res.status(404).send("Channel was not found");
    }
  } catch (error) {
    res.status(500).send("Error deletind channel");
    console.log(error);
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