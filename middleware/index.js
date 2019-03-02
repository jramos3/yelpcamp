const Campground = require("../models/campground");
const Comment = require("../models/comment");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

const checkCampgroundOwnership = (req, res, next) => {
  const { id } = req.params;

  if (req.isAuthenticated()) {
    Campground.findById(id)
      .then(campground => {
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      })
      .catch(err => {
        console.log(err);
        res.redirect("back");
      });
  } else {
    res.redirect("back");
  }
};

const checkCommentOwnership = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  if (req.isAuthenticated()) {
    Comment.findById(commentId)
      .then(comment => {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      })
      .catch(err => {
        console.log(err);
        res.redirect(back);
      });
  } else {
    res.redirect("back");
  }
};

module.exports = {
  isLoggedIn,
  checkCampgroundOwnership,
  checkCommentOwnership
};
