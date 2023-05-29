const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userdb = require(".././models/users");

router.post("/login", function (req, res) {
  let secretkey = process.env.JWT_SECRET_KEY;
  if (!req.body.username) {
    res.json({ success: false, message: "Username was not given" });
  } else if (!req.body.password) {
    res.json({ success: false, message: "Password was not given" });
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        console.log(err);
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({
            success: false,
            message: "username or password incorrect",
          });
        } else {
          req.session.username = user.username;
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            secretkey,
            { expiresIn: "24h" }
          );
          res.status(200);
          res.redirect("/channels");
        }
      }
    })(req, res);
  }
});

module.exports = router;
