const Channel = require('../models/channel');
const checkChannelOwnership = async (req, res, next) => {
    const channelId = req.body.channelId;
    const userId = req.session.userId.toString();
  
    try {
      console.log("ChannelId: ", channelId);
      const channel = await Channel.findById(channelId);
      console.log("Channel: ", channel);
      console.log("UserId: ",userId);
      console.log("Channel owner to string: ", channel.owner.toString())
  
      if (channel && channel.owner.toString() === userId) {
        // User is the owner of the channel
        next();
      } else {
        // User is not the owner of the channel
        res.sendStatus(403);
      }
    } catch (error) {
      res.status(500).send("Error checking channel ownership");
    }
  };
  
  module.exports = checkChannelOwnership;