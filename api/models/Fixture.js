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

const fixtureSchema = new Schema({
  marketplaceSlug: returnType(String, true, "Marketplace Slug is required!"),
  MatchNumber: {
    ...returnType(Number, true, "Match number is required!"),
  },
  RoundNumber: returnType(Number, true, "Round number is required!"),
  DateUtc: returnType(String, true, "Game date utc is required!"),
  Location: returnType(String, true, "Location is required!"),
  HomeTeam: returnType(String, true, "Home Team is required!"),
  AwayTeam: returnType(String, true, "Away Team is required!"),
  Group: returnType(String, true, "Group is required!"),
  HomeTeamScore: returnType(Number, true, "Home Team Score is required!"),
  AwayTeamScore: returnType(Number, true, "Away Team Score is required!"),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("fixture", fixtureSchema);