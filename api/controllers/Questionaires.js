const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const expressAsyncHandler = require("express-async-handler");
const Questionaire = require("../models/Questionaire");
const { redis } = require("../../utils/Redis");

module.exports = {
  getSpecificQuestionaireController: expressAsyncHandler(async (req, res) => {
    redis.get("questionaire"+sanitizeQueryInput(req.params["fixtureId"]), async (err, result) => {
      if (err) throw err;
      if (JSON.parse(result)) {
        return res.status(200).json({
          questionaire: JSON.parse(result),
        });
      } else {
        const questionaire = await Questionaire.find({
          fixtureId: sanitizeQueryInput(req.params["fixtureId"]),
        });
     
        redis.set("questionaire"+sanitizeQueryInput(req.params["fixtureId"]), JSON.stringify(questionaire));
        res.status(200).json({
          questionaire,
        });
      }
    });
  }),
  /**
   * @dev Get All Questionaires
   */
  getQuestionaireController: expressAsyncHandler(async (req, res) => {
    redis.get("questionaires", async (err, result) => {
      if (err) throw err;
      if (result) {
        return res.status(200).json({
          questionaires: JSON.parse(result),
        });
      } else {
        const questionaires = await Questionaire.aggregate([
          {
            $lookup: {
              from: "fixtures",
              localField: "fixtureId",
              foreignField: "_id",
              as: "fixtures",
            },
          },
        ]).exec();
        redis.set("questionaires", JSON.stringify(questionaires));
        res.status(200).json({ questionaires });
      }
    });
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
    redis.del("questionaire"+tempQuestionaire.fixtureId);
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
