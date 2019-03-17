const moment = require("moment");

const getRelativeDateFromNow = date => {
  return moment(date).fromNow();
};

const getStarPercentage = averageRating => {
  return `${(averageRating / 5) * 100}%`
}

module.exports = {
  getRelativeDateFromNow,
  getStarPercentage
};
