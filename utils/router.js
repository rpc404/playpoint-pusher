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
  updateFixtureStatus,
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
const {
  getLeaderboards,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
  getLeaderboardsByMarketplaceSlug,
} = require("../api/controllers/Leaderboards");
const {
  setPrediction,
  getPredictions,
  getPredictionById,
} = require("../api/controllers/Prediction");
const { marketplaceStats } = require("../api/helpers/marketplaceStats");
const { setProfile } = require("../api/controllers/Profile");

const APIRouter = require("express").Router();
const { authorize } = require("../api/middlewares/authorize");

// @note Marketplace API Endpoints
APIRouter.get("/marketplace-specific/:marketplaceSlug", getSpecificMarketplace)
  .get("/marketplace", getMarketplaces)
  .post(
    "/new-marketplace",
    authorize,
    multerUpload.single("marketplaceCoverImage"),
    newMarketplace
  )
  .patch("/update-marketplace/:marketplaceSlug", authorize, updateMarketplace)
  .delete("/delete-marketplace/:marketplaceSlug", authorize, deleteMarketplace);

// @note Fixture API Endpoints
APIRouter.get("/fixture", getFixturesController)
  .get("/fixture-specific/:id", getSpecificFixtureController)
  .get(
    "/fixture-marketplace/:marketplaceSlug",
    getFixturesByMarketplaceSlugController
  )
  .post("/new-fixture", authorize, newFixtureController)
  .patch("/update-fixture/:id", authorize, updateFixturesController)
  .delete("/delete-fixture/:id", authorize, deleteFixturesController)
  .post(
    "/update-fixture-status/:fixtureId/:status",
    authorize,
    updateFixtureStatus
  );

// @note Questionaires API Endpoints
APIRouter.get("/questionaires", getQuestionaireController)
  .get("/questionaires/:fixtureId", getSpecificQuestionaireController)
  .post("/new-questionaire", authorize, newQuestionaireController)
  .patch(
    "/update-questionaire/:questionaireId",
    authorize,
    updateQuestionaireController
  )
  .delete(
    "/delete-questionaire/:questionaireId",
    authorize,
    deleteQuestionaireController
  );

// @note Results API Endpoints
APIRouter.get("/results", getResultController)
  .post("/new-result", authorize, newResultController)
  .patch("/update-result", authorize, updateResultController)
  .delete("/delete-result", authorize, deleteResultController);

// @note Leaderboards API Endpoints
APIRouter.post("/leaderboards", authorize, createLeaderboard)
  .patch("/leaderboards/:leaderboardId", authorize, updateLeaderboard)
  .delete("/leaderboards/:leaderboardId", authorize, deleteLeaderboard)
  .get("/leaderboards/:marketplaceSlug", getLeaderboardsByMarketplaceSlug);

// @note Active Prediction
APIRouter.post("/prediction", setPrediction)
  .get("/prediction", getPredictions)
  .get("/predictionbyid/:pid", getPredictionById);

// @note Admin Status
APIRouter.get("/admin-stats", getCountStatus).get(
  "/marketplace-stats/:marketplaceSlug",
  marketplaceStats
);

APIRouter.post("/profile", setProfile).get("/profile/:username", (req, res) =>
  console.log(req.params.username)
);

module.exports = APIRouter;
