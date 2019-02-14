const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true
});

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create([
//   {
//     name: "Salmon Creek",
//     image:
//       "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
//   },
//   {
//     name: "Granite Hill",
//     image:
//       "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg"
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image:
//       "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"
//   }
// ])
//   .then(campground => console.log("NEWLY CREATED CAMPGROUND: ", campground))
//   .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  Campground.find()
    .then(campgrounds => {
      res.render("campgrounds", { campgrounds });
    })
    .catch(err => console.log(err));
});

app.post("/campgrounds", (req, res) => {
  const { name, image } = req.body;
  const newCampground = { name, image };

  Campground.create(newCampground)
    .then(campground => {
      res.redirect("/campgrounds");
    })
    .catch(err => console.log(err));
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
