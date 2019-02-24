const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true
});

// seedDB();

const app = express();

//--------------------------------
//MIDDLEWARES
//--------------------------------

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//PASSPORT Config
app.use(
  session({
    secret: "nsfiansnfaoisfjpasdajshasjnabsbasoppqiwunxms",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//--------------------------------
//CAMPGROUNDS Routes
//--------------------------------

app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX Route - Show all campgrounds
app.get("/campgrounds", (req, res) => {
  // console.log(req.user);
  Campground.find()
    .then(campgrounds => {
      res.render("campgrounds/index", { campgrounds });
    })
    .catch(err => console.log(err));
});

//CREATE Route - Add new campground
app.post("/campgrounds", (req, res) => {
  const { name, image, description } = req.body;
  const newCampground = { name, image, description };

  Campground.create(newCampground)
    .then(campground => {
      res.redirect("/campgrounds");
    })
    .catch(err => console.log(err));
});

//NEW Route - Shows form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW Route - Shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
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

//--------------------------------
//COMMENTS Routes
//--------------------------------

//NEW Route
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .then(campground => {
      res.render("comments/new", { campground });
    })
    .catch(err => console.log(err));
});

//CREATE Route
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

//--------------------------------
//AUTH Routes
//--------------------------------

//Sign Up
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//Logout
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/campgrounds");
});

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
