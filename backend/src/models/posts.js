const mongoose = require("mongoose");
const date = require("date-and-time");

const now = new Date();
const UTC = date.addHours(now, 3);
const dateNtime = date.format(UTC, "DD/MM/YYYY HH:mm:ss");

const postsSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
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
  comments: [
    {
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
    },
  ],
});

module.exports = mongoose.model("posts", postsSchema);
