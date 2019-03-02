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
  const text = req.body.comment.text;

  const newComment = {
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
      res.redirect(`/campgrounds/${id}`);
    })
    .catch(err => {
      console.log(err);
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

    Comment.findByIdAndUpdate(commentId, updatedComment)
      .then(() => {
        res.redirect(`/campgrounds/${campgroundId}`);
      })
      .catch(err => {
        console.log(err);
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
        res.redirect(`/campgrounds/${campgroundId}`);
      })
      .catch(err => {
        console.log(err);
        res.redirect("back");
      });
  }
);

module.exports = router;
