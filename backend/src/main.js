require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const date = require('date-and-time');
const mongoose = require('mongoose');
const userdb = require('./models/users');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(userdb.authenticate()));
const jwt = require('jsonwebtoken');
const Post = require('./models/posts')


// Connect to database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"));

const now  =  new Date();
const UTC = date.addHours(now, 3);
const dateNtime = date.format(UTC,'DD/MM/YYYY HH:mm:ss');

app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
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

app.get('/', isAuthenticated,  (req, res) => {
    Post.find()
      .sort({ timestamp: -1 })
      .then((posts) => {
        const username = req.session.username;
        res.render('index.ejs', { username: username, posts: posts });
      })
      .catch((error) => {
        console.error('Error fetching posts from MongoDB:', error);
        const username = req.session.username;
        res.render('index.ejs', { username: username, posts: [] });
      });
  });

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", function (req, res) {
    let secretkey = process.env.JWT_SECRET_KEY;
	if (!req.body.username) {
		res.json({ success: false, message: "Username was not given" })
	}
	else if (!req.body.password) {
		res.json({ success: false, message: "Password was not given" })
	}
	else {
		passport.authenticate("local", function (err, user, info) {
			if (err) {
                console.log(err);
				res.json({ success: false, message: err });
			}
			else {
				if (!user) {
					res.json({ success: false, message: "username or password incorrect" });
				}
				else {
                    req.session.username = user.username;
					const token = jwt.sign({ userId: user._id, username: user.username }, secretkey, { expiresIn: "24h" });
					res.redirect("/");
				}
			}
		})(req, res);
	}
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", function (req, res) {
    userdb.register(new userdb({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            res.status(500).json({ message: "Your account could not be saved. Error: " + err });
        } else {
            req.login(user, (er) => {
                if (er) {
                    res.redirect("/register");
                }
                else {
                    res.redirect("/login");
                }
            });
        }
    });
});

app.delete("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

app.post('/', isAuthenticated, (req, res) => {
    const postContent = req.body.post;

    const newPost = new Post({
      username: req.session.username,
      content: postContent,
      timestamp: dateNtime,
    });

    newPost.save()
      .then(() => {
        console.log('Post saved:', newPost);
        res.redirect('/');
      })
      .catch((error) => {
        console.error('Error saving post:', error);
        res.redirect('/');
      });
});

app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;

    Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).send('Post not found');
        }
        res.render('post.ejs', { post: post });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  });

  app.post('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const commentContent = req.body.content;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const comment = {
        username: req.session.username,
        content: commentContent,
        timestamp: dateNtime,
      };
      post.comments.push(comment);

      await post.save();

      res.redirect(`/post/${postId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
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
    res.redirect('/login');
}



app.listen(4040);