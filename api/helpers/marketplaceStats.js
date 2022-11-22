const expressAsyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");

module.exports = {
  marketplaceStats: expressAsyncHandler(async (req, res) => {
    const query = {marketplaceSlug: req.params.marketplaceSlug};
    
    const totalFixtures = await Fixture.countDocuments(query);
    const totalQuestionaires = await Fixture.countDocuments(query);
    const totalPredictions = await Fixture.countDocuments(query);

    res.json({
      response: {
        totalFixtures,
        totalQuestionaires,
        totalPredictions,
      },
    });
  }),
};
