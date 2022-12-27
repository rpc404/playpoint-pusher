const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const { redis } = require("../../utils/Redis");
const Fixture = require("../models/Fixture");
const Leaderboard = require("../models/Leaderboard");
const Prediction = require("../models/Prediction");
const Result = require("../models/Result");

module.exports = {
  getLeaderboards: expressAsyncHandler(async (req, res) => {
    redis.get("leaderboards", async (err, result) => {
      if (err) throw err;
      if (result) {
        return res.status(200).json({
          leaderboards: JSON.parse(result),
        });
      } else {
        const data = await Leaderboard.find();
        redis.set("leaderboards", JSON.stringify(data));
        return res.status(200).json({
          leaderboards: data,
        });
      }
    });
  }),

  getLeaderboardsByMarketplaceSlug: expressAsyncHandler(async (req, res) => {
    const data = await Prediction.aggregate([
      {
        $match: {
          marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "predictedBy",
          foreignField: "walletID",
          as: "user",
        },
      },
    ]).exec();

    const fixtures = await Fixture.find({
      marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
    });

    let leaderboard = [];
    let topranked = [];
    fixtures.map((fixture, key) => {
      let userCount = 0;
      let volume = 0;
      let users = [];
      data.map((prediction) => {
        if (
          ObjectId(fixture._id).toString() ==
          ObjectId(prediction.fixtureId).toString()
        ) {
          volume += 10;
          users.push({
            name: prediction.user[0].username,
            amount: 10,
          });
          return (userCount += 1);
        }
      });

      users = users.reduce(function (acc, val) {
        var o = acc
          .filter(function (obj) {
            return obj.name == val.name;
          })
          .pop() || { name: val.name, amount: val.amount };

        o.amount += val.amount;
        acc.push(o);
        return acc;
      }, []);
      users = users
        .filter(function (itm, i, a) {
          return i == a.indexOf(itm);
        })
        .sort((a, b) => b.amount - a.amount);
      volume = volume + 10 * users.length;
      return leaderboard.push({
        fixture,
        userCount,
        volume,
        topuser: users[0],
      });
    });

    leaderboard = leaderboard.sort((a, b) => {
      return b.userCount + b.volume - (a.userCount + a.volume);
    });

    // get winners
    let _winners = await Result.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "wallet",
          foreignField: "walletID",
          as: "user",
        },
      },
    ]).sort("points");

    _winners.map((winner) => {
      topranked.push({
        wallet: winner.wallet,
        amount: winner.rewardAmount,
        username: winner.user[0].username,
        points: winner.points,
      });
      return topranked;
    });
    // console.log(topranked)
    topranked = topranked.reduce(function (acc, val) {
      var o = acc
        .filter(function (obj) {
          return obj.wallet == val.wallet;
        })
        .pop() || {
        username: val.username,
        amount: val.amount,
        points: val.points,
        wallet: val.wallet,
      };

      o.amount += val.amount;
      o.points += val.points;

      acc.push(o);
      return acc;
    }, []);

    topranked = topranked
      .filter(function (itm, i, a) {
        return i == a.indexOf(itm);
      })
      .sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      leaderboard,
      topranked,
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

  getTopUsers: expressAsyncHandler(async (req, res) => {
    const data = await Result.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "wallet",
          foreignField: "walletID",
          as: "user",
        },
      },
    ]);
    let final = [];
    data.map((_results) => {
      return final.push({
        points: _results.points,
        amount: _results.rewardAmount,
        username: _results.user[0].username,
        wallet: _results.wallet,
      });
    });

    res.send(final);
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
