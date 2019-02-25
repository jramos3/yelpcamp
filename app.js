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
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/index");

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
