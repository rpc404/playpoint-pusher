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
  walletID: returnType(String, true, "Fixture Id is required"),
  username: returnType(String, false, "Prediction Type is required!"),
});

module.exports = Model("profile", predictionSchema);
