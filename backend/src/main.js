require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const userdb = require("./models/users");
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(userdb.authenticate()));
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const postRouter = require("./routes/postRouter");
const profileRouter = require("./routes/profileRouter");
const likeNdislikeRouter = require("./routes/likeNdislikeRouter");
const channelRouter = require("./routes/channelRouter");
const bodyParser = require('body-parser');
const port = 4040; // Port where server is running
const path = require("path");

// Connect to database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"/*, { maxAge: '7d' }*/));
app.use("/images", express.static(path.join(__dirname, "routes", "images")));
//app.use('/icons', express.static('public/icons', { maxAge: '7d' }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userdb.serializeUser());
passport.deserializeUser(userdb.deserializeUser());
app.use(methodOverride("_method"));

app.use(loginRouter);
app.use(registerRouter);
app.use(postRouter);
app.use(profileRouter);
app.use(likeNdislikeRouter);
app.use(channelRouter);

app.get("/", isAuthenticated, (req, res) => {
  res.redirect("/channels");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.delete("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

// Here we check weather the user is authenticated or not. I had this before but there was some "problems"
// The original function AND the way it's supposed to be done by the documentation:
/*
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
But this isAuthenticated middleware only checks wather req.user is set or not. and i wasn't setting it anywhere
So i modified the function to be req.session and req.session.username because thats what ive been using in other functions
*/
function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

app.listen(port, () =>{
  console.log(`HushHub running on port ${port}`);
})