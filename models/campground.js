const mongoose = require("mongoose");
const _ = require("lodash");
const Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Campground Name is required."],
    trim: true
  },
  image: {
    type: String,
    required: [true, "Campground Image is required."],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Campground Price is required."],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Campground Description is required."],
    trim: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//deletes associated comments on a campground before deleting it
campgroundSchema.pre("remove", function() {
  Comment.deleteMany({
    _id: {
      $in: this.comments
    }
  })
    .then()
    .catch(err => console.log(err));
});

campgroundSchema.methods.computeAverageRating = function() {
  return Comment.find({ _id: { $in: this.comments } })
    .then(comments => {
      return comments.map(comment => {
        return comment.rating;
      });
    })
    .then(ratings => {
      if (ratings.length === 0) {
        return 0;
      }

      return _.round(_.mean(ratings), 1);
    })
    .catch(err => {
      console.log(err);
    });
};

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
