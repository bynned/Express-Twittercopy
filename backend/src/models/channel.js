const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("channel", channelSchema);