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
  image: String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create([
//   {
//     name: "Salmon Creek",
//     image:
//       "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
//     description:
//       "1 Lorem ipsum dolor sit amet consectetur adipisicing elit. A eius, amet eos porro reprehenderit provident hic quisquam quis voluptatibus? A molestias tempora inventore sint rerum pariatur impedit dolores est amet."
//   },
//   {
//     name: "Granite Hill",
//     image:
//       "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
//     description:
//       "2 Lorem ipsum dolor sit amet consectetur adipisicing elit. A eius, amet eos porro reprehenderit provident hic quisquam quis voluptatibus? A molestias tempora inventore sint rerum pariatur impedit dolores est amet."
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image:
//       "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg",
//     description:
//       "3 Lorem ipsum dolor sit amet consectetur adipisicing elit. A eius, amet eos porro reprehenderit provident hic quisquam quis voluptatibus? A molestias tempora inventore sint rerum pariatur impedit dolores est amet."
//   }
// ])
//   .then(campground => console.log("NEWLY CREATED CAMPGROUND: ", campground))
//   .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX Route - Show all campgrounds
app.get("/campgrounds", (req, res) => {
  Campground.find()
    .then(campgrounds => {
      res.render("index", { campgrounds });
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
  res.render("new");
});

//SHOW Route - Shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  const { id } = req.params;

  Campground.findById(id)
    .then(campground => {
      res.render("show", { campground });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
