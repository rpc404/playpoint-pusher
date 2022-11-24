const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

/**
 *
 * @param {*} type => Can be Number, String or any data type
 * @param {*} require => It stores boolean value, either the variable is required on every user creation or not
 * @param {*} requiredMessage => If the boolean for require === true, then the specific message descripting why it's required
 * @returns Returns an object with type and require value
 */
const returnType = (type, require, requiredMessage) => {
  return {
    type,
    require: require === true ? [require, requiredMessage] : [false],
  };
};

const leaderboardSchema = new Schema({
  fixture: {
    HomeTeam: returnType(String, true, "Home team is required!"),
    AwayTeam: returnType(String, true, "Away team is required!"),
  },
  totalUsers: returnType(Number, true, "Total users is required!"),
  totalVolume: returnType(Number, true, "Total volume is required!"),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("leaderboard", leaderboardSchema);