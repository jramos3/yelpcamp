const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
