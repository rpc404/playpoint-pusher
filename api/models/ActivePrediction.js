const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const returnType = (type, require, requiredMessage) => {
    return {
      type,
      require: require === true ? [require, requiredMessage] : [false],
    };
  };

  const fixtureSchema = new Schema({
    poolType: returnType(String, true, "Pool type is required!"),
    poolPrice: returnType(Number, true, "Pool Price is required!"),
    fixtureName: returnType(String, true, "Fixture Name is required!"),
    predictorAddress: returnType(String, true, "Predictor address is required!"),
    questionsAnswer: [{
        question: returnType(String, true, "Question is required!"),
        answer: returnType(String, true, "Answer is required!")
    }],
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: Date,
  });
  
  module.exports = Model("activePrediction", fixtureSchema);