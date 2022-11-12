const expressAsyncHandler = require("express-async-handler");
const Marketplace = require("../models/Marketplace");
const Questionaire = require("../models/Questionaire");
const Result = require("../models/Result");

module.exports = {
    getCountStatus: expressAsyncHandler(async (req, res) => {
        const marketplaceCount = await Marketplace.count()
        const questionaireCount = await Questionaire.count()
        const resultCount = await Result.count()

        res.status(200).json({
            stat: {
                marketplaceCount,
                questionaireCount,
                resultCount,
            }
        })
    })
}