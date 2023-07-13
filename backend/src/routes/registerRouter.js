const express = require("express");
const router = express.Router();
const userdb = require(".././models/users");
const { v4: uuidv4 } = require('uuid');

router.post("/register", function (req, res) {
  userdb.register(
    new userdb({ email: req.body.email, username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        res
          .status(500)
          .json({ message: "Your account could not be saved. Error: " + err });
      } else {
        req.login(user, (er) => {
          if (er) {
            res.redirect("/register");
          } else {
            res.redirect("/login");
          }
        });
      }
    }
  );
});

// Generate verificationToken
function generateVerificationToken() {
  return uuidv4();
}

module.exports = router;
