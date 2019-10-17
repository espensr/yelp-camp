var mongoose = require("mongoose");

const userCommentSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("UserComment", userCommentSchema);