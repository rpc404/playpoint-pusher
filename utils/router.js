const {
  getMarketplaces,
  newMarketplace,
  updateMarketplace,
  deleteMarketplace,
  getSpecificMarketplace,
} = require("../api/controllers/Marketplace");
const {
  getSpecificFixtureController,
  getFixturesController,
  newFixtureController,
  updateFixturesController,
  deleteFixturesController,
  getFixturesByMarketplaceSlugController,
} = require("../api/controllers/Fixture");
const {
  getQuestionaireController,
  newQuestionaireController,
  updateQuestionaireController,
  deleteQuestionaireController,
  getSpecificQuestionaireController,
} = require("../api/controllers/Questionaires");
const { multerUpload } = require("./MulterConfig");
const {
  getResultController,
  newResultController,
  updateResultController,
  deleteResultController,
} = require("../api/controllers/Result");
const { getCountStatus } = require("../api/helpers/adminStats");
const { getLeaderboards, createLeaderboard } = require("../api/controllers/Leaderboards");
const { setPrediction, getPredictions } = require("../api/controllers/Prediction");

const APIRouter = require("express").Router();

// @note Marketplace API Endpoints
APIRouter.get("/marketplace-specific/:marketplaceSlug", getSpecificMarketplace)
  .get("/marketplace", getMarketplaces)
  .post(
    "/new-marketplace",
    multerUpload.single("marketplaceCoverImage"),
    newMarketplace
  )
  .patch("/update-marketplace/:marketplaceSlug", updateMarketplace)
  .delete("/delete-marketplace/:marketplaceSlug", deleteMarketplace);

// @note Fixture API Endpoints
APIRouter.get("/fixture", getFixturesController)
  .get("/fixture-specific/:id", getSpecificFixtureController)
  .get(
    "/fixture-marketplace/:marketplaceSlug",
    getFixturesByMarketplaceSlugController
  )
  .post("/new-fixture", newFixtureController)
  .patch("/update-fixture/:id", updateFixturesController)
  .delete("/delete-fixture/:id", deleteFixturesController);

// @note Questionaires API Endpoints
APIRouter.get("/questionaires", getQuestionaireController)
  .get("/questionaires/:fixtureId", getSpecificQuestionaireController)
  .post("/new-questionaire", newQuestionaireController)
  .patch("/update-questionaire/:questionaireId", updateQuestionaireController)
  .delete("/delete-questionaire/:questionaireId", deleteQuestionaireController);

// @note Results API Endpoints
APIRouter.get("/results", getResultController)
  .post("/new-result", newResultController)
  .patch("/update-result", updateResultController)
  .delete("/delete-result", deleteResultController);

// @note Leaderboards API Endpoints
APIRouter.get("/leaderboards", getLeaderboards)
.post("/leaderboards", createLeaderboard)
.patch("/leaderboards/:leaderboardId")
.delete("/leaderboards/:leaderboardId")

// @note Active Prediction
APIRouter.post("/prediction", setPrediction).get("/prediction", getPredictions);

// @note Admin Status
APIRouter.get("/admin-stats", getCountStatus);

module.exports = APIRouter;
