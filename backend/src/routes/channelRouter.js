const express = require("express");
const router = express.Router();
const channel = require("../models/channel");
const Post = require("../models/posts");

// Route for creating a new channel
router.post("/channels", isAuthenticated, (req, res) => {
  const channelName = req.body.channelName;
  const channelKey = req.body.channelKey;
  // Generate the href for the new channel
  const href = channelName.toLowerCase().replace(/ /g, "-");

  channel.findOne({ name: channelName }).then((existingChannel) => {
    if (existingChannel) {
      console.error("That channel name already exists");
      res.status(409).send({ error: "That channel already exists" });
    } else {
      const newChannel = new channel({
        name: channelName,
        href: href,
        key: channelKey,
      });

      newChannel
        .save()
        .then(() => {
          console.log("New channel created: ", newChannel);
          res.redirect("/channels");
        })
        .catch((error) => {
          console.error("Error creating new channel: ", error);
          res.redirect("/channels");
        });
    }
  });
});

router.get("/channels", isAuthenticated, (req, res) => {
  let username = req.session.username;

  channel
    .find()
    .then((channels) => {
      res.status(200).render("channelView.ejs", {
        username: username,
        channels: channels,
      });
    })
    .catch((error) => {
      console.error("Error fetching channels", error);
      res.status(404).render("channelView.ejs", {
        username: username,
        channels: [],
      });
    });
});

router.get("/channels/:href", isAuthenticated, (req, res) => {
  const href = req.params.href;
  const searchQuery = req.query.search || "";

  Post.find({ channel: href, content: { $regex: searchQuery, $options: "i" } })
    .sort({ timestamp: -1 })
    .then((posts) => {
      const username = req.session.username;
      res.status(200).render("index.ejs", { username: username, posts: posts, href: href });
    })
    .catch((error) => {
      console.error("Error fetching posts from MongoDB:", error);
      const username = req.session.username;
      res.render("index.ejs", { username: username, posts: [], href: href });
    });
});


function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
