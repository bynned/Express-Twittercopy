const channel = require("../models/channel");
const User = require("../models/users");


// This is to check weather a user is allowed to view a channel,
// So this checks if the channelID exists in the users availableChannels array
// If not,
// They are not authorized to view the channel
const checkUserChannelMembership = (req, res, next) => {
  const channelId = req.params.id;
  const username = req.session.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      const isMember = user.availableChannels.some((channel) => {
        return channel.toString() === channelId.toString();
      });

      if (!isMember) {
        return res.status(403).send("You are not authorized to view this channel.");
      }
      next();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = checkUserChannelMembership;
