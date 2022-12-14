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
const returnType = (type, require, requiredMessage,ref=null) => {
  return {
    type,
    require: require === true ? [require, requiredMessage] : [false],
    ref:ref?ref:""
  };
};

const questionaireSchema = new Schema({
  marketplaceSlug: returnType(String, true, "Marketplace slug is required!"),
  fixtureId: returnType(String, true, "Fixture ID is required!"),
  questionaireType: returnType(Number, true, "Questionaire Type is required!"),
  questionairePrice: returnType(
    Number,
    true,
    "Questionaire Price is required!"
  ),
  questionaires: {
    questions: returnType(Array, true, "Questionaires is required!"),
    answers: returnType(Array, true, "Answers is required!"),
    points: returnType(Array, true, "Points is required!"),
  },
  poolType: returnType(String, true, "Pool Type is required!"),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("questionaire", questionaireSchema);