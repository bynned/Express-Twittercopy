const express = require("express");
const router = express.Router();
const channel = require("../models/channel");
const Post = require("../models/posts");
const userdb = require("../models/users");

// Route for creating a new channel
router.post("/channels", isAuthenticated, (req, res) => {
  const channelName = req.body.channelName;
  const channelKey = req.body.channelKey;
  const username = req.session.username;
  // Generate the href for the new channel
  const href = channelName.toLowerCase().replace(/ /g, "-");

  channel
    .findOne({ $or: [{ name: channelName }, { key: channelKey }] })
    .then((existingChannel) => {
      if (existingChannel) {
        console.error("That channel name or key already exists");
        res.status(409).send({ error: "That channel already exists" });
      } else {
        userdb
          .findOne({ username: req.session.username })
          .then((user) => {
            if (!user) {
              console.error("User not found");
              res.status(404).send({ error: "User not found" });
            } else {
              const newChannel = new channel({
                name: channelName,
                href: href,
                key: channelKey,
                owner: user._id,
              });

              newChannel
                .save()
                .then(() => {
                  userdb
                    .findOneAndUpdate(
                      { username: req.session.username },
                      { $push: { availableChannels: newChannel._id } },
                      { new: true }
                    )
                    .then(() => {
                      console.log("New channel created: ", newChannel);
                      res.redirect("/channels");
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating user's availableChannels: ",
                        error
                      );
                      res.redirect("/channels");
                    });
                })
                .catch((error) => {
                  console.error("Error creating new channel: ", error);
                  res.redirect("/channels");
                });
            }
          })
          .catch((error) => {
            console.error("Error finding user: ", error);
            res.status(500).send({
              error: "An error occurred while finding the user",
            });
          });
      }
    });
});

// POST for users joining a channel by entering a channel key
router.post("/join-channel", isAuthenticated, (req, res) => {
  const channelKey = req.body.enterChannelKey;

  channel
    .findOne({ key: channelKey })
    .then((channel) => {
      if (!channel) {
        console.error("Invalid channel key");
        res.status(404).send({ error: "Invalid channel key" });
      } else {
        // Add the channel to the user's availableChannels
        userdb
          .findOneAndUpdate(
            { username: req.session.username },
            { $addToSet: { availableChannels: channel._id } }, // $addToSet to prevent duplicates
            { new: true }
          )
          .then(() => {
            console.log("Joined channel: ", channel);
            res.redirect("/channels");
          })
          .catch((error) => {
            console.error("Error: ", error);
            res.redirect("/channels");
          });
      }
    })
    .catch((error) => {
      console.error("Error finding channel: ", error);
      res
        .status(500)
        .send({ error: "An error occurred while finding the channel" });
    });
});

router.get("/channels", isAuthenticated, (req, res) => {
  let username = req.session.username;

  // Fetching the users available channels from the database
  userdb
    .findOne({ username: username })
    .populate("availableChannels")
    .then((user) => {
      if (!user) {
        return res.status(404).render("channelView.ejs", {
          username: username,
          channels: [],
        });
      }

      const channels = user.availableChannels;
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
      res
        .status(200)
        .render("index.ejs", { username: username, posts: posts, href: href });
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
