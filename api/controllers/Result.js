const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const Result = require("../models/Result");
const Questionaires = require("../models/Questionaire")
const Prediction = require("../models/Prediction")
const {distance, closest} = require("fastest-levenshtein")


module.exports = {
  /**
   * @dev Get All Results
   */
  getResultController: expressAsyncHandler(async (req, res) => {
    const results = await Result.find();
    res.status(200).json({ data: results });
  }),
  /**
   * @dev New Results
   */
  newResultController: expressAsyncHandler(async (req, res) => {
    let { questionaireId, results } = req.body;
    results = results.split(",")
    const _questions = await Questionaires.findById(questionaireId);
    const predictions = await Prediction.find({ fixtureId: _questions.fixtureId}).exec();
    const { points } = _questions.questionaires;
    let result__ = [];

    for (let index = 0; index < predictions.length; index++) {
      const {_id,answers} = predictions[index];
        // console.log(answers)
       let _points = 0;
       for (let index2 = 0; index2 < results.length; index2++) {
        let _a = String(answers[index2]).replace(/\s/g, '').replace("-","").trim().toLowerCase()
        let _b = String(results[index2]).replace(/\s/g, '').replace("-","").trim().toLowerCase()
       // if exact match => includes: ENG2-JPN3,eng2-jpn3, eng 2 jpn 3, eng-2 jpn-3,
        if(_a == _b){
        _points += parseInt(points[index2]);
        continue;
        }
        // ENG2-JPN3 => jpn3-eng2, JPN3 - ENG2
        let __a = String(answers[index2]).replace(/\s/g, '').trim().toLowerCase()
        let __b = String(results[index2]).replace(/\s/g, '').trim().toLowerCase()
        if(__a.search("-") && __b.search("-")){
          const [__a1,__a2] = __a.split("-");
          const [__b1,__b2] = __b.split("-");
          if(__a1==__b2 && __a2==__b1){
            _points += parseInt(points[index2]);
            continue;
          }
        }
        // ENG2-JPN3 =>  jpn3 eng2
        let a_ = String(answers[index2]).trim().toLowerCase()
        let b_ = String(results[index2]).replace(/\s/g, '').trim().toLowerCase()
        if(a_.search(" ")){
          let [a1_,a2_] = a_.split(" ");
          let [b1_,b2_] = b_.split("-");
          if(a1_==b2_ && a2_ == b1_){
            _points += parseInt(points[index2]);
            continue;
          }
        }      
       }
    result__[index] = { points: _points,predictionId:_id}
    }
    result__ = result__.sort((a,b)=> b.points - a.points)
    console.log(result__)
    const newResult = new Result({
      questionaireId,
      results,
    });

    // await newResult.save();
    res.status(200).json({ message: "Results Created Successfully!" });
  }),
  /**
   * @dev Update Results
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
   * @dev Delete Result
   */
  deleteResultController: expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;

    await Result.deleteOne({ _id: sanitizeQueryInput(_id) });
    res.status(200).json({ message: "Result deleted successfully!" });
  }),
};
