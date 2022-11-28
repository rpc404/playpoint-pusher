const Fixture = require("../models/Fixture");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  getSpecificFixtureController: expressAsyncHandler(async (req, res) => {
    res.status(200).send({
      fixture: await Fixture.findOne({
        _id: sanitizeQueryInput(req.params["id"]),
      }),
    });
  }),

  /**
   * @dev Get All Fixtures
   */
  getFixturesController: expressAsyncHandler(async (req, res) =>
    res.status(200).json({ fixtures: await Fixture.find() })
  ),

  /**
   * @dev Get Fixtures by Marketplace Slug
   */
  getFixturesByMarketplaceSlugController: expressAsyncHandler(
    async (req, res) =>
      res.status(200).json({
        fixtures: await Fixture.find({
          marketplaceSlug: sanitizeQueryInput(req.params["marketplaceSlug"]),
        }),
      })
  ),

  /**
   * @dev New Fixture
   */
  newFixtureController: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      message: "New Fixture created successfully!",
      response: await Fixture.create({
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
      }),
    });
  }),
  /**
   * @dev Update Fixture
   */
  updateFixturesController: expressAsyncHandler(async (req, res) => {
    const query = { _id: req.params["id"] };

    const tempFixture = await Fixture.findOne(query);
    console.log(req.body);

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
   * @dev Delete Fixture
   */
  deleteFixturesController: expressAsyncHandler(async (req, res) =>
    res.status(200).json({
      message: "Deleted Fixture Successfully!",
      response: await Fixture.deleteOne({
        _id: sanitizeQueryInput(req.params["id"]),
      }),
    })
  ),
};
