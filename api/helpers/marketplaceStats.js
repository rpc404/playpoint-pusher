const expressAsyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");
const Prediction = require("../models/Prediction");
const Questionaire = require("../models/Questionaire");

module.exports = {
  marketplaceStats: expressAsyncHandler(async (req, res) => {
    const query = { marketplaceSlug: req.params["marketplaceSlug"] };

    const totalFixtures = await Fixture.find(query).count();
    const totalQuestionaires = await Questionaire.find(query).count();
    const totalPredictions = await Prediction.find(query).count();

    res.status(200).json({
      response: {
        totalFixtures,
        totalQuestionaires,
        totalPredictions,
      },
    });
  }),
};
