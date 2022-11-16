const expressAsyncHandler = require("express-async-handler");
const Marketplace = require("../models/Marketplace");
const Questionaire = require("../models/Questionaire");
const Result = require("../models/Result");

module.exports = {
  getCountStatus: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      stat: {
        marketplaceCount: await Marketplace.count(),
        questionaireCount: await Questionaire.count(),
        resultCount: await Result.count(),
      },
    });
  }),
};
