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

const predictionSchema = new Schema({
  marketplaceSlug: returnType(String, true, "Marketplace slug is required"),
  fixtureId: { type: Schema.Types.ObjectId, ref: 'fixture' },
  predictionType: returnType(String, true, "Prediction Type is required!"),
  questionaireId: returnType(String, true, "Questionaire ID is required!"),
  predictedBy: returnType(String, true, "Predicted By is required!"),
  amount: returnType(Number, true, "Amount is required!"),
  answers: returnType(Object, true, "Answers is required!"),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("prediction", predictionSchema);
