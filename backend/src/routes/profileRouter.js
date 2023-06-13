const express = require("express");
const router = express.Router();
const Post = require(".././models/posts");
const User = require(".././models/users");
const Channel = require(".././models/channel");


// Just to keep users on their own profiles
const checkProfileOwnership = (req, res, next) => {
  const { username } = req.params;
  const loggedInUsername = req.session.username;

  if (username !== loggedInUsername) {
    return res.redirect(`/profile/${loggedInUsername}`);
  }

  next();
};

router.get("/profile/:username", checkProfileOwnership, (req, res) => {
  const { username } = req.params;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        console.error("User not found");
        res
          .status(404)
          .render("profile.ejs", {
            username: username,
            posts: [],
            channels: [],
          });
      } else {
        Post.find({ username: username })
          .sort({ timestamp: -1 })
          .then((posts) => {
            Channel.find({ owner: user._id })
              .then((channels) => {
                res.render("profile.ejs", {
                  username: username,
                  posts: posts,
                  channels: channels,
                });
              })
              .catch((error) => {
                console.error("Error fetching channels:", error);
                res.render("profile.ejs", {
                  username: username,
                  posts: posts,
                  channels: [],
                });
              });
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
            res.render("profile.ejs", {
              username: username,
              posts: [],
              channels: [],
            });
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.render("profile.ejs", {
        username: username,
        posts: [],
        channels: [],
      });
    });
});

module.exports = router;
