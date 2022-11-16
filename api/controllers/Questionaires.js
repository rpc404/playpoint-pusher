const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const expressAsyncHandler = require("express-async-handler");
const Questionaire = require("../models/Questionaire");

module.exports = {
  getSpecificQuestionaireController: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      questionaire: await Questionaire.find({
        fixtureId: sanitizeQueryInput(req.params["fixtureId"]),
      }),
    });
  }),
  /**
   * @dev Get All Questionaires
   */
  getQuestionaireController: expressAsyncHandler(async (req, res) => {
    res.status(200).json({ questionaires: await Questionaire.find() });
  }),
  /**
   * @dev New Questionaires
   */
  newQuestionaireController: expressAsyncHandler(async (req, res) =>
    res.status(200).json({
      message: "New Questionaire created successfully!",
      response: await Questionaire.create(req.body),
    })
  ),
  /**
   * @dev Update Questionaire
   */
  updateQuestionaireController: expressAsyncHandler(async (req, res) => {
    const query = {
      _id: sanitizeQueryInput(req.params["questionaireId"]),
    };

    const tempQuestionaire = Questionaire.findOne(query);

    res.status(200).json({
      message: "Questionaire updated successfully!",
      response: await Questionaire.updateOne(query, {
        $set: {
          fixtureId: req.body.fixtureId || tempQuestionaire.fixtureId,
          questionaireType:
            req.body.questionaireType || tempQuestionaire.questionaireType,
          questionairePrice:
            req.body.questionairePrice || tempQuestionaire.questionairePrice,
          questionaires:
            req.body.questionaires || tempQuestionaire.questionaires,
          poolType: req.body.poolType || tempQuestionaire.poolType,
        },
      }),
    });
  }),
  /**
   * @dev Delete Questionaire
   */
  deleteQuestionaireController: expressAsyncHandler(async (req, res) => {
    res.status(200).json({
      message: "Questionaire deleted successfully!",
      response: await Questionaire.deleteOne({
        _id: sanitizeQueryInput(req.params["questionaireId"]),
      }),
    });
  }),
};
