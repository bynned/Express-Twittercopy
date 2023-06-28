const mongoose = require("mongoose");
const date = require("date-and-time");

const now = new Date();
const UTC = date.addHours(now, 3);
const dateNtime = date.format(UTC, "DD/MM/YYYY HH:mm:ss");

const postsSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "channel",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: dateNtime,
  },
  image: {
    type: String,
  },
  likedBy: [
    {
      type: String,
      required: true,
    },
  ],
  dislikedBy: [
    {
      type: String,
      required: true,
    },
  ],
  flagged: [
    {
      type: String,
    },
  ],
  comments: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
      },
      username: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: String,
        default: dateNtime,
      },
      comlikedBy: [
        {
          type: String,
          required: true,
        },
      ],
      comdislikedBy: [
        {
          type: String,
          required: true,
        },
      ],
      comflagged: [
        {
          type: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("posts", postsSchema);
