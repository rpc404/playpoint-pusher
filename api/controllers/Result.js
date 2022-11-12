const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const Result = require("../models/Result");

module.exports = {
  /**
   * ****************************************************************
   *                  @dev Get All Results
   * ****************************************************************
   */
  getResultController: expressAsyncHandler(async (req, res) => {
    const results = await Result.find();
    res.status(200).json({ data: results });
  }),
  /**
   * ****************************************************************
   *                  @dev New Results
   * ****************************************************************
   */
  newResultController: expressAsyncHandler(async (req, res) => {
    const { questionaireId, results } = req.body;

    const newResult = new Result({
      questionaireId,
      results,
    });

    await newResult.save();
    res.status(200).json({ message: "Results Created Successfully!" });
  }),
  /**
   * ****************************************************************
   *                  @dev Update Results
   * ****************************************************************
   */
  updateResultController: expressAsyncHandler(async (req, res) => {
    const { _id, questionaireId, results } = req.body;
    const tempData = await Result.findOne({ _id: sanitizeQueryInput(_id) });

    await Result.updateOne(
      { _id: sanitizeQueryInput(_id) },
      {
        $set: {
          questionaireId: questionaireId || tempData.questionaireId,
          results: results || tempData.results,
        },
      }
    );
    res.status(200).json({ message: "Result updated successfully!" });
  }),
  /**
   * ****************************************************************
   *                  @dev Delete Result
   * ****************************************************************
   */
  deleteResultController: expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;

    await Result.deleteOne({ _id: sanitizeQueryInput(_id) });
    res.status(200).json({ message: "Result deleted successfully!" });
  }),
};
