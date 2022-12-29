const Fixture = require("../models/Fixture");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const FixtureStatus = require("../models/FixtureStatus");
const { default: mongoose } = require("mongoose");
const Prediction = require("../models/Prediction");
const { redis } = require("../../utils/Redis");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  getSpecificFixtureController: expressAsyncHandler(async (req, res) => {
    redis.get(`fixture-${req.params["id"]}`, async (err, result) => {
      if (err) throw err;
      if (result) {
        return res.status(200).json({
          fixture: JSON.parse(result),
        });
      } else {
        const data = await Fixture.findOne({
          _id: sanitizeQueryInput(req.params["id"]),
        });
        const { status } = (await FixtureStatus.findOne({
          fixtureId: sanitizeQueryInput(req.params["id"]),
        })) || { status: null };
        redis.set(`fixture-${req.params["id"]}`, JSON.stringify({fixture:data, status}));
        res.status(200).send({
          fixture: data,
          status,
        });
      }
    });
  }),

  /**
   * @dev Get All Fixtures
   */
  getFixturesController: expressAsyncHandler(async (req, res) => {
    redis.get("fixtures", async (err, result) => {
      if (err) throw err;
      if (result) {
        return res.status(200).json({
          fixtures: JSON.parse(result),
        });
      } else {
        const data = await Fixture.aggregate([
          {
            $lookup: {
              from: "fixture-statuses",
              localField: "_id",
              foreignField: "fixtureId",
              as: "status",
            },
          },
          {
            $lookup: {
              from: "predictions",
              localField: "_id",
              foreignField: "fixtureId",
              as: "predictions",
            },
          },
        ]).exec();
        redis.set("fixtures", JSON.stringify(data));
        res.status(200).json({
          fixtures: data,
        });
      }
    });
  }),

  /**
   * @dev Get Fixtures by Marketplace Slug
   */
  getFixturesByMarketplaceSlugController: expressAsyncHandler(
    async (req, res) => {
      redis.get(
        `fixture-${req.params["marketplaceSlug"]}`,
        async (err, result) => {
          if (err) throw err;
          if (result) {
            return res.status(200).json({
              fixtures: JSON.parse(result),
            });
          } else {
            const data = await Fixture.aggregate([
              {
                $match: {
                  marketplaceSlug: sanitizeQueryInput(
                    req.params["marketplaceSlug"]
                  ),
                },
              },
              {
                $lookup: {
                  from: "fixture-statuses",
                  localField: "_id",
                  foreignField: "fixtureId",
                  as: "status",
                },
              },
              {
                $lookup: {
                  from: "predictions",
                  localField: "_id",
                  foreignField: "fixtureId",
                  as: "predictions",
                },
              },
            ]).exec();
            redis.set(
              `fixture-${req.params["marketplaceSlug"]}`,
              JSON.stringify(data)
            );
            res.status(200).json({
              fixtures: data,
            });
          }
        }
      );
    }
  ),

  /**
   * @dev New Fixture
   */
  newFixtureController: expressAsyncHandler(async (req, res) => {
    const data = await Fixture.create({
      marketplaceSlug: req.body.marketplaceSlug,
      MatchNumber: req.body.MatchNumber,
      RoundNumber: req.body.RoundNumber,
      DateUtc: req.body.DateUtc,
      Location: req.body.Location,
      HomeTeam: req.body.HomeTeam,
      AwayTeam: req.body.AwayTeam,
      Group: req.body.Group,
      HomeTeamScore: req.body.HomeTeamScore || 0,
      AwayTeamScore: req.body.AwayTeamScore || 0,
    });
    redis.del("fixture-"+req.body.marketplaceSlug);
    await FixtureStatus.create({ fixtureId: data._id });
    res.status(200).json({
      message: "New Fixture created successfully!",
      response: data,
    });
  }),
  /**
   * @dev Update Fixture
   */
  updateFixturesController: expressAsyncHandler(async (req, res) => {
    const query = { _id: req.params["id"] };
    const tempFixture = await Fixture.findOne(query);

    redis.del("fixture-"+tempFixture.marketplaceSlug);
    tempFixture &&
      res.status(200).json({
        message: "Updated Fixture Successfully!",
        response: await Fixture.updateOne(query, {
          $set: {
            marketplaceSlug:
              req.body.marketplaceSlug || tempFixture.marketplaceSlug,
            MatchNumber: req.body.MatchNumber || tempFixture.MatchNumber,
            RoundNumber: req.body.RoundNumber || tempFixture.RoundNumber,
            DateUtc: req.body.DateUtc || tempFixture.DateUtc,
            Location: req.body.Location || tempFixture.Location,
            HomeTeam: req.body.HomeTeam || tempFixture.HomeTeam,
            AwayTeam: req.body.AwayTeam || tempFixture.AwayTeam,
            Group: req.body.Group || tempFixture.Group,
            HomeTeamScore: req.body.HomeTeamScore || tempFixture.HomeTeamScore,
            AwayTeamScore: req.body.AwayTeamScore || tempFixture.AwayTeamScore,
            closed: req.body.closed || tempFixture.closed,
          },
        }),
      });
  }),

  /**
   * @dev Update Fixture Status
   */
  updateFixtureStatus: expressAsyncHandler(async (req, res) => {
    const query = { fixtureId: req.params["fixtureId"] };
    const operation = req.params["status"];
    let tempFixture = await FixtureStatus.findOne(query);
    
    if (!tempFixture) {
      const data = req.params;
      tempFixture = await FixtureStatus.create(data);
    } else {
      tempFixture.status = operation;
      await tempFixture.save();
    }

    redis.del("fixture-"+tempFixture.marketplaceSlug);
    tempFixture &&
      res.status(200).json({
        message: "Updated Fixture Successfully!",
        response: tempFixture,
      });
  }),
  /**
   * @dev Delete Fixture
   */
  deleteFixturesController: expressAsyncHandler(async (req, res) =>{
    const {marketplaceSlug} = await Fixture.findOne({_id: req.params["id"]})
    redis.del("fixture-"+marketplaceSlug)
    res.status(200).json({
      message: "Deleted Fixture Successfully!",
      response: await Fixture.deleteOne({
        _id: sanitizeQueryInput(req.params["id"]),
      }),
    })
  }
  ),

  createLeaderboard: expressAsyncHandler(async (req, res) => {
    res.status(200).json({});
  }),
};
