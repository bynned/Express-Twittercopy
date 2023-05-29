const express = require("express");
const router = express.Router();
const channel = require("../models/channel");


// Route for creating a new channel
router.post("/channels", isAuthenticated, (req, res) => {
    const channelName = req.body.channelName;

    // Generate the href for the new channel
    const href = "/" + channelName.toLowerCase().replace(/ /g, "-");

    const newChannel = new channel({
        name: channelName,
        href: href
    });

    newChannel
        .save()
        .then(() => {
            console.log("New channel created: ", newChannel);
            res.status(201);
        })
        .catch((error) => {
            console.error("Error creating new channel: ", error);
            res.status(500);
        });
});

function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
      return next();
    }
    res.redirect("/login");
}


module.exports = router;