const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const Comment = require("../models/comment");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

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
  const newComment = req.body.comment;

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

module.exports = router;
