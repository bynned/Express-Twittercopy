const express = require("express");
const router = express.Router();
const checkUserChannelMembership = require("../middleware/checkUserChannelMembership");
const Post = require("../models/posts");
const Channel = require("../models/channel");
const mongoose = require("mongoose");

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
    res.render("moderateChannel.ejs", { channelName: channel.name, flaggedPosts, flaggedComments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving flagged posts and comments." });
  }
});

/*
router.delete("/channels/:commentId", (req, res) => {
  const commentId = req.body.commentId;
  const comIndex = req.body.comIndex; 
  console.log("clear flags of comment called");
  // Logic to clear the contents of the comflagged array for the specified comment

  if (commentId && comIndex >= 0 && comIndex < flaggedComments.length) {
    const comment = flaggedComments.find((comment) => comment._id === commentId);

    if (comment) {
      if (comIndex >= 0 && comIndex < comment.comments.length) {
        comment.comments[comIndex].comflagged = []; // Clear the comflagged array

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

*/



function isAuthenticated(req, res, next) {
    if (req.session && req.session.username && req.session.userId) {
      req.user = { _id: req.session.userId };
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;