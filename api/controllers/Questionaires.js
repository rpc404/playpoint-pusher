const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const expressAsyncHandler = require("express-async-handler");
const Questionaire = require("../models/Questionaire");

module.exports = {
  /**
   * ****************************************************************
   *                  @dev Get All Questionaires
   * ****************************************************************
   */
  getQuestionaireController: expressAsyncHandler(async (req, res) => {
    // const questionaires = await Questionaire.find().populate("fixtureId");
    const questionaires = await Questionaire.find();
    res.status(200).json({ data: questionaires });
  }),
  /**
   * ****************************************************************
   *                     @dev New Questionaires
   * ****************************************************************
   */
  newQuestionaireController: expressAsyncHandler(async (req, res) => {
    const {
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    } = req.body;

    console.log(questionaires)

    const newQuestionaire = new Questionaire({
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    });

    await newQuestionaire.save();

    res.status(200).json({ message: "New Questionaire created successfully!" });
  }),
  /**
   * ****************************************************************
   *                     @dev Update Questionaire
   * ****************************************************************
   */
  updateQuestionaireController: expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;

    const {
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    } = req.body;

    const tempQuestionaire = Questionaire.findOne({
      _id: sanitizeQueryInput(_id),
    });

    await Questionaire.updateOne(
      { _id: sanitizeQueryInput(_id) },
      {
        $set: {
          fixtureId: fixtureId || tempQuestionaire.fixtureId,
          questionaireType:
            questionaireType || tempQuestionaire.questionaireType,
          questionairePrice:
            questionairePrice || tempQuestionaire.questionairePrice,
          questionaires: questionaires || tempQuestionaire.questionaires,
          poolType: poolType || tempQuestionaire.poolType,
        },
      }
    );

    res.status(200).json({ message: "Questionaire updated successfully!" });
  }),
  /**
   * ****************************************************************
   *                     @dev Delete Questionaire
   * ****************************************************************
   */
  deleteQuestionaireController: expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;

    await Questionaire.deleteOne({ _id: sanitizeQueryInput(_id) });
    res.status(200).json({ message: "Questionaire deleted successfully!" });
  }),
};
