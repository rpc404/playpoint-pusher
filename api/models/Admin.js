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

const returnType = (type, require, requiredMessage, option) => {
  return {
    type,
    require: require === true ? [require, requiredMessage] : [false],
    option
  };
};

const adminSchema = new Schema({
  wallet: returnType(String, true, "wallet are required!", {unique:true}),
  role: returnType(String, true, "role are required!",{}),
  name:  returnType(String, true, "name are required!",{}),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("admins", adminSchema);