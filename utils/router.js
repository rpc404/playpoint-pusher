const { handleEmail, handleToken, handleOTP } = require("../api/controllers/Auth");

const {
    getMarketplaces,
    newMarketplace,
    updateMarketplace,
    deleteMarketplace,
    getSpecificMarketplace,
    closeMarketplace,
  } = require("../api/controllers/Marketplace"),
  {
    getSpecificFixtureController,
    getFixturesController,
    newFixtureController,
    updateFixturesController,
    deleteFixturesController,
    getFixturesByMarketplaceSlugController,
    updateFixtureStatus,
  } = require("../api/controllers/Fixture"),
  {
    getQuestionaireController,
    newQuestionaireController,
    updateQuestionaireController,
    deleteQuestionaireController,
    getSpecificQuestionaireController,
  } = require("../api/controllers/Questionaires"),
  { multerUpload } = require("./MulterConfig"),
  {
    getResultController,
    newResultController,
    updateResultController,
    deleteResultController,
    getUserResultController,
  } = require("../api/controllers/Result"),
  { getCountStatus } = require("../api/helpers/adminStats"),
  {
    getLeaderboards,
    createLeaderboard,
    updateLeaderboard,
    deleteLeaderboard,
    getLeaderboardsByMarketplaceSlug,
    getTopUsers,
  } = require("../api/controllers/Leaderboards"),
  {
    setPrediction,
    getPredictions,
    getPredictionById,
  } = require("../api/controllers/Prediction"),
  { marketplaceStats } = require("../api/helpers/marketplaceStats"),
  {
    setProfile,
    getAdmins,
    addAdmin,
    removeAdmin,
    getAdmin,
    getProfile,
  } = require("../api/controllers/Profile"),
  APIRouter = require("express").Router(),
  { authorize } = require("../api/middlewares/authorize"),
  {
    getChallengesByUser,
    getChallengesByChallenger,
    createChallege,
    getChallengesById,
    getChallenges,
  } = require("../api/controllers/Challenge");

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
  .delete("/delete-marketplace/:marketplaceSlug", deleteMarketplace)
  .patch("/close-marketplace/:slug", closeMarketplace);

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
  .get("/results/:walletID", getUserResultController)
  .post("/new-result", authorize, newResultController)
  .patch("/update-result", authorize, updateResultController)
  .delete("/delete-result", authorize, deleteResultController);

// @note Leaderboards API Endpoints
APIRouter.post("/leaderboards", authorize, createLeaderboard)
  .patch("/leaderboards/:leaderboardId", authorize, updateLeaderboard)
  .delete("/leaderboards/:leaderboardId", authorize, deleteLeaderboard)
  .get("/leaderboards/:marketplaceSlug", getLeaderboardsByMarketplaceSlug)
  .get("/topusers/", getTopUsers);

// @note Active Prediction
APIRouter.post("/prediction", setPrediction)
  .get("/prediction", getPredictions)
  .get("/predictionbyid/:pid", getPredictionById);

// @note Admin Status
APIRouter.get("/admin-stats", getCountStatus).get(
  "/marketplace-stats/:marketplaceSlug",
  marketplaceStats
);

/**
 * @dev challenge API
 */

APIRouter.get("/challenges-by-user/:userid", getChallengesByUser)
  .get("/challenges-by-participants/:userid", getChallengesByChallenger)
  .post("/new-challenge", createChallege)
  .get("/get-challenges/", getChallenges)
  .get("/get-challenge/:id", getChallengesById);

APIRouter.post("/profile", setProfile);
APIRouter.get("/admins", authorize, getAdmins)
  .post("/admin-add", authorize, addAdmin)
  .post("/delete-admin", authorize, removeAdmin)
  .get("/admin/:wallet", authorize, getAdmin);


APIRouter.post("/authenticate", handleEmail);
APIRouter.post("/verify", handleToken);
APIRouter.post("/otplogin", handleOTP);




module.exports = APIRouter;
