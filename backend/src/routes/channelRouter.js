const express = require("express");
const router = express.Router();
const channel = require("../models/channel");

// Route for creating a new channel
router.post("/channels", isAuthenticated, (req, res) => {
  const channelName = req.body.channelName;
  const username = req.session.username;
  // Generate the href for the new channel
  const href = "/" + channelName.toLowerCase().replace(/ /g, "-");

  channel.findOne({ name: channelName }).then((existingChannel) => {
    if (existingChannel) {
      console.error("That channel name already exists");
      res.status(409).send({ error: "That channel already exists" });
    } else {
      const newChannel = new channel({
        name: channelName,
        href: href,
      });

      newChannel
        .save()
        .then(() => {
          console.log("New channel created: ", newChannel);
          res.redirect("/channels");
        })
        .catch((error) => {
          console.error("Error creating new channel: ", error);
          res.status(500).render("channelView.ejs", {
            username: username,
            channels: [],
          });
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

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
