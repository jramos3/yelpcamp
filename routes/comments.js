const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const { isLoggedIn, checkCommentOwnership } = require("../middleware");

//NEW Route
router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .then(campground => {
      res.render("comments/new", { campground });
    })
    .catch(err => console.log(err));
});

//CREATE Route
router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { _id, username } = req.user;
  const { rating, text } = req.body.comment;

  const newComment = {
    rating,
    text,
    author: {
      id: _id,
      username
    }
  };

  Promise.all([Campground.findById(id).exec(), Comment.create(newComment)])
    .then(data => {
      const [campground, comment] = data;

      campground.comments.push(comment);
      return campground.save();
    })
    .then(campground => {
      req.flash("success", "Comment successfully added.");
      res.redirect(`/campgrounds/${id}`);
    })
    .catch(err => {
      const errorMsg = Object.keys(err.errors).map(
        key => err.errors[key].message
      );

      req.flash("inputBeforeError", newComment); //store in session previously inputted data if any
      req.flash("error", errorMsg);
      res.redirect("back");
    });
});

//EDIT Route
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  checkCommentOwnership,
  (req, res) => {
    const { id: campgroundId, comment_id: commentId } = req.params;

    Comment.findById(commentId)
      .then(comment => {
        res.render("comments/edit", { campgroundId, comment });
      })
      .catch(err => {
        console.log(err);
        res.redirect("back");
      });
  }
);

//UPDATE Route
router.put(
  "/campgrounds/:id/comments/:comment_id",
  checkCommentOwnership,
  (req, res) => {
    const { id: campgroundId, comment_id: commentId } = req.params;
    const { comment: updatedComment } = req.body;

    Comment.findByIdAndUpdate(commentId, updatedComment, {
      runValidators: true
    })
      .then(() => {
        req.flash("success", "Comment successfully updated.");
        res.redirect(`/campgrounds/${campgroundId}`);
      })
      .catch(err => {
        const errorMsg = Object.keys(err.errors).map(
          key => err.errors[key].message
        );

        req.flash("inputBeforeError", updatedComment); //store in session previously inputted data if any
        req.flash("error", errorMsg);
        res.redirect("back");
      });
  }
);

//DELETE Route
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  checkCommentOwnership,
  (req, res) => {
    const { id: campgroundId, comment_id: commentId } = req.params;

    Comment.findByIdAndDelete(commentId)
      .then(() => {
        req.flash("success", "Comment successfully deleted.");
        res.redirect(`/campgrounds/${campgroundId}`);
      })
      .catch(err => {
        console.log(err);
        res.redirect("back");
      });
  }
);

module.exports = router;
