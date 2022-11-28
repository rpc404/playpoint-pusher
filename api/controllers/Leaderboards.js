const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const Fixture = require("../models/Fixture");
const Leaderboard = require("../models/Leaderboard");
const Prediction = require("../models/Prediction");

module.exports = {
  getLeaderboards: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      leaderboards: await Leaderboard.find(),
    });
  }),
  getLeaderboardsByMarketplaceSlug: expressAsyncHandler(async (req, res) => {
    const data = await Prediction.aggregate([
      {
        $match:{
          marketplaceSlug:sanitizeQueryInput(req.params["marketplaceSlug"]),
        }
      },
      {
          $lookup: {
            from: "profiles",
            localField: "predictedBy",
            foreignField: "walletID",
            as: "user",
          },
      },
    ])

    const fixtures = await Fixture.find({marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"])})

    let leaderboard = [];
    fixtures.map((fixture,key)=>{
      let userCount = 0;
      let volume = 0;
      data.map((prediction)=>{
        if(fixture._id == prediction.fixtureId){
          volume += prediction.amount;
         return userCount += 1;
        }
      })
    return leaderboard.push({fixture,userCount, volume})
    })
    leaderboard = leaderboard.sort((a,b)=>{return (b.userCount+b.volume) - (a.userCount+a.volume)})
    res.status(200).json({
      leaderboard,
    });
  }),

  createLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard created succefully!",
      response: await Leaderboard.create({
        ...req.body,
      }),
    });
  }),

  updateLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard updated successfully!",
      response: await Leaderboard.updateOne(
        { _id: req.params["leaderboardId"] },
        {
          $set: {
            totalUsers: req.body.totalUsers,
            totalVolume: req.body.totalVolume,
          },
        }
      ),
    });
  }),

  deleteLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard deleted successfully!",
      response: await Leaderboard.deleteOne({
        _id: req.params["leaderboardId"],
      }),
    });
  }),
};
