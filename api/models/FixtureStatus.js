const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const predictionStatusSchema = new Schema({
  fixtureId: { type: Schema.Types.ObjectId, ref: 'fixture' },
  status: { type:String, default:"open" },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: Date,
});

module.exports = Model("fixture-status", predictionStatusSchema);
