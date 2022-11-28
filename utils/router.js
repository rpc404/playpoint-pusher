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
const { getLeaderboards, createLeaderboard, updateLeaderboard, deleteLeaderboard } = require("../api/controllers/Leaderboards");
const { setPrediction, getPredictions } = require("../api/controllers/Prediction");

const APIRouter = require("express").Router();
const { authorize } = require("../api/middlewares/authorize")

// @note Marketplace API Endpoints
APIRouter.get("/marketplace-specific/:marketplaceSlug", getSpecificMarketplace)
  .get("/marketplace", getMarketplaces)
  .post(
    "/new-marketplace",
    authorize,
    multerUpload.single("marketplaceCoverImage"),
    newMarketplace
  )
  .patch("/update-marketplace/:marketplaceSlug",authorize, updateMarketplace)
  .delete("/delete-marketplace/:marketplaceSlug",authorize, deleteMarketplace);

// @note Fixture API Endpoints
APIRouter.get("/fixture", getFixturesController)
  .get("/fixture-specific/:id", getSpecificFixtureController)
  .get(
    "/fixture-marketplace/:marketplaceSlug",
    getFixturesByMarketplaceSlugController
  )
  .post("/new-fixture", authorize, newFixtureController)
  .patch("/update-fixture/:id",authorize, updateFixturesController)
  .delete("/delete-fixture/:id",authorize, deleteFixturesController);

// @note Questionaires API Endpoints
APIRouter.get("/questionaires", getQuestionaireController)
  .get("/questionaires/:fixtureId", getSpecificQuestionaireController)
  .post("/new-questionaire",authorize, newQuestionaireController)
  .patch("/update-questionaire/:questionaireId",authorize, updateQuestionaireController)
  .delete("/delete-questionaire/:questionaireId",authorize, deleteQuestionaireController);

// @note Results API Endpoints
APIRouter.get("/results", getResultController)
  .post("/new-result",authorize, newResultController)
  .patch("/update-result",authorize, updateResultController)
  .delete("/delete-result",authorize, deleteResultController);

// @note Leaderboards API Endpoints
APIRouter.get("/leaderboards", getLeaderboards)
.post("/leaderboards",authorize, createLeaderboard)
.patch("/leaderboards/:leaderboardId",authorize, updateLeaderboard)
.delete("/leaderboards/:leaderboardId",authorize, deleteLeaderboard)

// @note Active Prediction
APIRouter.post("/prediction", setPrediction).get("/prediction", getPredictions);

// @note Admin Status
APIRouter.get("/admin-stats", getCountStatus);

module.exports = APIRouter;
