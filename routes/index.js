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
        res.redirect("campgrounds");
      });
    })
    .catch(err => {
      console.log(err);
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
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//Logout
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/campgrounds");
});

module.exports = router;
