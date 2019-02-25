const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

//INDEX Route - Show all campgrounds
router.get("/campgrounds", (req, res) => {
  // console.log(req.user);
  Campground.find()
    .then(campgrounds => {
      res.render("campgrounds/index", { campgrounds });
    })
    .catch(err => console.log(err));
});

//CREATE Route - Add new campground
router.post("/campgrounds", (req, res) => {
  const { name, image, description } = req.body;
  const newCampground = { name, image, description };

  Campground.create(newCampground)
    .then(campground => {
      res.redirect("/campgrounds");
    })
    .catch(err => console.log(err));
});

//NEW Route - Shows form to create new campground
router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW Route - Shows more info about one campground
router.get("/campgrounds/:id", (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .populate("comments")
    .exec()
    .then(campground => {
      // console.log(campground);
      res.render("campgrounds/show", { campground });
    })
    .catch(err => console.log(err));
});

module.exports = router;
