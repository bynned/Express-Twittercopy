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
      res.status(409).send({ error: "That channel aleady exists "});
    } else {
      const newChannel = new channel({
        name: channelName,
        href: href,
      });

      newChannel
        .save()
        .then(() => {
          console.log("New channel created: ", newChannel);
          res.status(201).render("channelView.ejs", { username: username, channels: channelName });
        })
        .catch((error) => {
          console.error("Error creating new channel: ", error);
          res.status(500).send({ error: "Error creating a new channel "});
        });
    }
  });
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
