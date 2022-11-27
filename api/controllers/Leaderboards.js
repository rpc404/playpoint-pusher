const expressAsyncHandler = require("express-async-handler");
const Leaderboard = require("../models/Leaderboard");

module.exports = {
  getLeaderboards: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      leaderboards: await Leaderboard.find(),
    });
  }),

  createLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      msg: "Leaderboard created succefully!",
      response: await Leaderboard.create({
        ...req.body
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
        response: await Leaderboard.deleteOne({_id: req.params["leaderboardId"]})
    })
  })
};
