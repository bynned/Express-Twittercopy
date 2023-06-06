const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    availableChannels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channel',
      }],
});
usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('userdb', usersSchema)