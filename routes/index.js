const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

//--------------------------------
//AUTH Routes
//--------------------------------

//Sign Up
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username });

  User.register(newUser, password)
    .then(user => {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", `Welcome to YelpCamp, ${user.username}`);
        res.redirect("campgrounds");
      });
    })
    .catch(err => {
      console.log(err);
      req.flash("error", err.message);
      res.render("register");
    });
});

//Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    successFlash: "You have successfully logged in.",
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {}
);

//Logout
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "You have successfully logged out.");
  res.redirect("/campgrounds");
});

module.exports = router;
