const Post = require("../models/posts");
const User = require("../models/users");

const checkChannelMembership = (req, res, next) => {
  const postId = req.params.postId;
  const username = req.session.username;

  Post.findById(postId)
    .populate("channel")
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }

      const channelId = post.channel._id;
      console.log(channelId);

      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return res.status(404).send("User not found");
          }

          const isMember = user.availableChannels.includes(channelId);

          if (!isMember) {
            return res.status(403).send("You are not authorized to view this post.");
          }

          req.post = post;
          req.channel = post.channel;
          next();
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = checkChannelMembership;
