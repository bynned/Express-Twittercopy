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




function isAuthenticated(req, res, next) {
    if (req.session && req.session.username && req.session.userId) {
      req.user = { _id: req.session.userId };
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;