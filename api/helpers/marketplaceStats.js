const expressAsyncHandler = require("express-async-handler");
const Fixture = require("../models/Fixture");

module.exports = {
  marketplaceStats: expressAsyncHandler(async (req, res) => {
    const fixtures = await Fixture.find({
      marketplaceSlug: req.params.marketplaceSlug,
    });

    for(f in fixtures){
        console.log(fixtures)
    }
  }),
};
