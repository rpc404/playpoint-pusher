const expressAsyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");
const Prediction = require("../models/Prediction");
const Questionaire = require("../models/Questionaire");

module.exports = {
  marketplaceStats: expressAsyncHandler(async (req, res) => {
    const query = {marketplaceSlug: req.params["marketplaceSlug"]};
    
    const totalFixtures = await Fixture.countDocuments(query);
    const totalQuestionaires = await Questionaire.countDocuments(query);
    const totalPredictions = await Prediction.countDocuments(query);

    res.status.json({
      response: {
        totalFixtures,
        totalQuestionaires,
        totalPredictions,
      },
    });
  }),
};
