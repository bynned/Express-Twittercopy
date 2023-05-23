const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const users = require("./models/users.js");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await users.findOne({ email });

      if (!user) {
        return done(null, false, { message: "No user with that email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
  getUserById(id, (err, user) => {
    done(err, user);
  });
});
}

module.exports = initialize;
