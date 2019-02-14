const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const campgrounds = [
  {
    name: "Salmon Creek",
    image:
      "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
  },
  {
    name: "Granite Hill",
    image:
      "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image:
      "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"
  },
  {
    name: "Salmon Creek",
    image:
      "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
  },
  {
    name: "Granite Hill",
    image:
      "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image:
      "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"
  },
  {
    name: "Salmon Creek",
    image:
      "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
  },
  {
    name: "Granite Hill",
    image:
      "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg"
  },
  {
    name: "Mountain Goat's Rest",
    image:
      "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"
  }
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
  const { name, image } = req.body;
  const newCampground = { name, image };

  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.listen(3000, () => console.log("YelpCamp server started at port 3000..."));
