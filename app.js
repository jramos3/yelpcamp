const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");

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
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.campground = req.flash("inputBeforeError")[0]; //req.flash returns an array
  next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
