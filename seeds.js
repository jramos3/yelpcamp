const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  },
  {
    name: "Desert Mesa",
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  },
  {
    name: "Canyon Floor",
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
  }
];

const seedDB = () => {
  Promise.all([Campground.deleteMany().exec(), Comment.deleteMany().exec()])
    .then(() => console.log("campgrounds & comments removed"))
    .then(() => {
      return Promise.all(
        data
          .map(seed => {
            return Campground.create(seed);
          })
          .concat(
            data.map(seed => {
              return Comment.create({
                text: "This place is great, but I wish there was internet",
                author: "Homer"
              });
            })
          )
      );
    })
    .then(campgroundsAndComments => {
      console.log("campgrounds & comments created");

      const campgrounds = campgroundsAndComments.slice(0, 3);
      const comments = campgroundsAndComments.slice(3);

      return Promise.all(
        campgrounds.map((campground, i) => {
          campground.comments.push(comments[i]);

          return campground.save();
        })
      );
    })
    .then(campgrounds => {
      console.log("Comment pushed on campgrounds");
      console.log(campgrounds);
    })
    .catch(err => console.log(err));
};

module.exports = seedDB;
