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

const resultSchema = new Schema({
  predictionId: { type: Schema.Types.ObjectId, ref: 'prediction' },
  points: returnType(Number, true, "Points are required!"), // contains points, ranks, amount
  rewardAmount: returnType(Number,true,"Reward Amount is required"),
  isPaid: returnType(Boolean,true, "Required"),
  wallet: returnType(String, true, "walet are required!"),
  txnhash: returnType(String, false,""),
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("results", resultSchema);