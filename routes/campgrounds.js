const querystring = require("querystring");
const url = require("url");
const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const { isLoggedIn, checkCampgroundOwnership } = require("../middleware");

//INDEX Route - Show all campgrounds
router.get("/campgrounds", (req, res) => {
  // console.log(req.user);
  Campground.find()
    .then(campgrounds => {
      const ratings = campgrounds.map(campground => {
        return campground.computeAverageRating(); //promise
      });
      const ratingsAndCampgrounds = [ratings, campgrounds];

      return Promise.all(
        ratingsAndCampgrounds.map(ratingAndCampground => {
          return Promise.all(ratingAndCampground);
        })
      );
    })
    .then(data => {
      const [ratings, campgrounds] = data;
      //converts the array of mongoose objects to plain javascript objects
      //so that we can add properties onto it
      const campgroundObjects = campgrounds.map(campground =>
        campground.toObject()
      );

      campgroundObjects.forEach((campground, i) => {
        campground.averageRating = ratings[i];
      });

      res.render("campgrounds/index", { campgrounds: campgroundObjects });
    })
    .catch(err => console.log(err));
});

//CREATE Route - Add new campground
router.post("/campgrounds", isLoggedIn, (req, res) => {
  const { campground: newCampground } = req.body;
  const { _id, username } = req.user;

  newCampground.author = {
    id: _id,
    username
  };

  Campground.create(newCampground)
    .then(campground => {
      req.flash("success", "Campground successfully added.");
      res.redirect("/campgrounds");
    })
    .catch(err => {
      const errorMsg = Object.keys(err.errors).map(
        key => err.errors[key].message
      );

      req.flash("inputBeforeError", newCampground); //store in session previously inputted data is any
      req.flash("error", errorMsg);
      res.redirect("back");
    });
});

//NEW Route - Shows form to create new campground
router.get("/campgrounds/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW Route - Shows more info about one campground
router.get("/campgrounds/:id", (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .populate("comments")
    .exec()
    .then(campground => {
      return Promise.all([campground.computeAverageRating(), campground]);
    })
    .then(data => {
      const [averageRating, campground] = data;

      res.render("campgrounds/show", {
        campground,
        averageRating
      });
    })
    .catch(err => console.log(err));
});

//EDIT Route - Shows form to update a campground
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .then(campground => {
      res.render("campgrounds/edit", { campground });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/campgrounds");
    });
});

//UPDATE Route - Updates a campground
router.put("/campgrounds/:id", checkCampgroundOwnership, (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;

  Campground.findByIdAndUpdate(id, campground, { runValidators: true })
    .then(updatedCampground => {
      req.flash("success", "Campground successfully updated.");
      res.redirect(`/campgrounds/${id}`);
    })
    .catch(err => {
      const errorMsg = Object.keys(err.errors).map(
        key => err.errors[key].message
      );

      req.flash("inputBeforeError", campground); //store in session previously inputted data is any
      req.flash("error", errorMsg);
      res.redirect("back");
    });
});

//DELETE Route - Deletes a campground
router.delete("/campgrounds/:id", checkCampgroundOwnership, (req, res) => {
  const { id } = req.params;

  // Campground.findByIdAndDelete(id)
  //   .then(campground => {
  //     res.redirect("/campgrounds");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.redirect("/campgrounds");
  //   });

  //needs to call remove() explicitly to trigger pre remove hook on campground
  Campground.findById(id)
    .then(campground => {
      return campground.remove();
    })
    .then(() => {
      req.flash("success", "Campground successfully deleted.");
      res.redirect("/campgrounds");
    })
    .catch(err => {
      console.log(err);
      res.redirect("/campgrounds");
    });
});

module.exports = router;
