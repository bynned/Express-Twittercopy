const express = require("express");
const router = express.Router();
const checkUserChannelMembership = require("../middleware/checkUserChannelMembership");

router.get("/channels/:id/moderate", isAuthenticated, checkUserChannelMembership, (req, res) => {
    res.render("moderateChannel.ejs");
});


function isAuthenticated(req, res, next) {
    if (req.session && req.session.username && req.session.userId) {
      req.user = { _id: req.session.userId };
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;