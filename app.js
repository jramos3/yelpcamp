const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true
});

seedDB();

const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//--------------------------------
//CAMPGROUNDS Routes
//--------------------------------

app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX Route - Show all campgrounds
app.get("/campgrounds", (req, res) => {
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
app.get("/campgrounds/:id/comments/new", (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .then(campground => {
      res.render("comments/new", { campground });
    })
    .catch(err => console.log(err));
});

//CREATE Route
app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
