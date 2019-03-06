const mongoose = require("mongoose");
const Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Campground Name is required."]
  },
  image: {
    type: String,
    required: [true, "Campground Image is required."]
  },
  price: {
    type: Number,
    required: [true, "Campground Price is required."]
  },
  description: {
    type: String,
    required: [true, "Campground Description is required."]
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

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
