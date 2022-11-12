const Fixture = require("../models/Fixture");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");

module.exports = {
  /**
   * ****************************************************************
   *               @dev Get Specific Marketplaces
   * ****************************************************************
   */
  getSpecificFixtureController: expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;
    const fixture = await Fixture.findOne({ _id: sanitizeQueryInput(_id) });
    res.status(200).send({data: fixture});
  }),
  /**
   * ****************************************************************
   *                  @dev Get All Fixtures
   * ****************************************************************
   */
  getFixturesController: expressAsyncHandler(async (req, res) => {
    const fixtures = await Fixture.find();
    res.status(200).json({ data: fixtures });
  }),

  /**
   * ****************************************************************
   *                     @dev New Fixture
   * ****************************************************************
   */
  newFixtureController: expressAsyncHandler(async (req, res) => {
    const {
      marketplaceSlug,
      MatchNumber,
      RoundNumber,
      DateUtc,
      Location,
      HomeTeam,
      AwayTeam,
      Group,
      HomeTeamScore,
      AwayTeamScore,
    } = req.body;

    const newFixture = new Fixture({
      marketplaceSlug,
      MatchNumber,
      RoundNumber,
      DateUtc,
      Location,
      HomeTeam,
      AwayTeam,
      Group,
      HomeTeamScore: HomeTeamScore || 0,
      AwayTeamScore: AwayTeamScore || 0,
    });

    await newFixture.save();

    res.status(200).json({ message: "New Fixture created successfully!" });
  }),
  /**
   * ****************************************************************
   *                     @dev Update Fixture
   * ****************************************************************
   */
  updateFixturesController: async (req, res) => {
    const { _id } = req.body;

    try {
      const {
        marketplaceSlug,
        MatchNumber,
        RoundNumber,
        DateUtc,
        Location,
        HomeTeam,
        AwayTeam,
        Group,
        HomeTeamScore,
        AwayTeamScore,
      } = req.body;
      const tempFixture = await Fixture.findOne({
        _id: sanitizeQueryInput(_id),
      });

      Fixture.updateOne(
        { _id: sanitizeQueryInput(_id) },
        {
          $set: {
            marketplaceSlug: marketplaceSlug || tempFixture.marketplaceSlug,
            MatchNumber: MatchNumber || tempFixture.MatchNumber,
            RoundNumber: RoundNumber || tempFixture.RoundNumber,
            DateUtc: DateUtc || tempFixture.DateUtc,
            Location: Location || tempFixture.Location,
            HomeTeam: HomeTeam || tempFixture.HomeTeam,
            AwayTeam: AwayTeam || tempFixture.AwayTeam,
            Group: Group || tempFixture.Group,
            HomeTeamScore: HomeTeamScore || tempFixture.HomeTeamScore,
            AwayTeamScore: AwayTeamScore || tempFixture.AwayTeamScore,
          },
        }
      )
        .then(() =>
          res.status(200).json({ message: "Updated Fixture Successfully!" })
        )
        .catch((error) => console.error(error));
    } catch (error) {}
  },
  /**
   * ****************************************************************
   *                     @dev Delete Fixture
   * ****************************************************************
   */
  deleteFixturesController: (req, res) => {
    const { _id } = req.body;
    Fixture.deleteOne({ _id: sanitizeQueryInput(_id) })
      .then(() =>
        res.status(200).json({ message: "Deleted Fixture Successfully!" })
      )
      .catch((error) => console.error(error));
  },
};
