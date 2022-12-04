const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const Result = require("../models/Result");
const Questionaires = require("../models/Questionaire");
const Prediction = require("../models/Prediction");
const { sendReward } = require("../../utils/RewardCornJob");



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
    results = results.split(",");

    const _questions = await Questionaires.findById(questionaireId);
   
    const predictions = await Prediction.find({
      fixtureId: _questions.fixtureId,
    }).exec();
  
    const { points } = _questions.questionaires;
    let result__ = [];
    let totalPoolAmount = 0;
    for (let index = 0; index < predictions.length; index++) {
      const { _id, answers, amount, predictedBy } = predictions[index];
      totalPoolAmount += amount;
     
      let _points = 0;
      for (let index2 = 0; index2 < results.length; index2++) {
        let _a = String(answers[index2])
          .replace(/\s/g, "")
          .replace("-", "")
          .replace(",", "")
          .trim()
          .toLowerCase();
        let _b = String(results[index2])
          .replace(/\s/g, "")
          .replace("-", "")
          .replace(",", "")
          .trim()
          .toLowerCase();
          // console.log(_a)
        // if exact match => includes: ENG2-JPN3,eng2-jpn3, eng 2 jpn 3, eng-2 jpn-3,
        if (_a == _b) {
          _points += parseInt(points[index2]);
          continue;
        }
        // ENG2-JPN3 => jpn3-eng2, JPN3 - ENG2
        let __a = String(answers[index2])
          .replace(/\s/g, "")
          .trim()
          .toLowerCase();
        let __b = String(results[index2])
          .replace(/\s/g, "")
          .trim()
          .toLowerCase();
        if (__a.search("-") && __b.search("-")) {
          const [__a1, __a2] = __a.split("-");
          const [__b1, __b2] = __b.split("-");
          if (__a1 == __b2 && __a2 == __b1) {
            _points += parseInt(points[index2]);
            continue;
          }
        }
        // ENG2-JPN3 =>  jpn3 eng2
        let a_ = String(answers[index2]).trim().toLowerCase();
        let b_ = String(results[index2])
          .replace(/\s/g, "")
          .trim()
          .toLowerCase();
        if (a_.search(" ")) {
          let [a1_, a2_] = a_.split(" ");
          let [b1_, b2_] = b_.split("-");
          if (a1_ == b2_ && a2_ == b1_) {
            _points += parseInt(points[index2]);
            continue;
          }
        }
      }
      result__[index] = { points: _points, predictionId: _id, wallet:predictedBy, isPaid:false};
    }
   
    // Group wallets by points
    const ranks = result__.reduce((res, d) => {
      if (Object.keys(res).includes(d.points)) return res;
      res[d.points] = result__.filter((g) => g.points === d.points);
      return res;
    }, {});
    
    const points_ = Object.keys(ranks).sort((a, b) => b - a);
    let len = 0;
    let standing = [];
    points_.map((points__) => {
      if (len < 3) {
        standing.push(ranks[points__]);
        len += 1;
      }
      return standing;
    });
   
    // 1st = 0.55, 2nd = .25, 3rd = 0.125, jackpot = 0.25, R&D=0.15, Treasury = 0.15, operational = 0.15, charity=0.5
    const rewardAmount = {
      first: parseFloat((0.55 * totalPoolAmount).toFixed(1)),
      second: parseFloat((0.25 * totalPoolAmount).toFixed(1)),
      third: parseFloat((0.125 * totalPoolAmount).toFixed(1)),
      jackpot: parseFloat((0.025 * totalPoolAmount).toFixed(1)),
      randd: parseFloat((0.015 * totalPoolAmount).toFixed(1)),
      treasury: parseFloat((0.015 * totalPoolAmount).toFixed(1)),
      operational: parseFloat((0.015 * totalPoolAmount).toFixed(1)),
      charity: parseFloat((0.005 * totalPoolAmount).toFixed(1)),
    };
    let i = 0;
    const pseudo_final = standing.map((_st) => {
      if (i < 3) {
          if (_st.length == 1) {
            if(i==0){
              _st.reward = rewardAmount.first;
              i= 1;
              return _st;
            }
            else if(i==1){
              _st.reward = rewardAmount.second;
              i= 2;
              return _st;
            }
            else if(i==2){
              _st.reward = rewardAmount.third;
              i= 3;
              return _st;
            }
          }
        
        if (_st.length == 2) {

          if(i==0){
            _st.reward = rewardAmount.first + rewardAmount.second;
            i = 2;
            return _st;
          }

          else if(i==1){
            _st.reward = rewardAmount.second + rewardAmount.third;
            i = 3;
            return _st;
          }
          else if (i == 2) {
            _st.reward = rewardAmount.third;
            i = 3;
            return _st;
          }
        }
        
      }
      if((_st.length==3 || _st.length>=3)){
        if(i==0){
          _st.reward = rewardAmount.first+rewardAmount.second+rewardAmount.third;
          i =3;
          return _st;
        }

        else if(i==1){
          _st.reward = rewardAmount.second+rewardAmount.third;
          i = 3;
          return _st;
        }

        else if( i==2){
          _st.reward = rewardAmount.third;
          i = 3;
          return _st;
        }
      }
      return _st;
    });
   
    const final = pseudo_final.map(final=>{
      const shared_reward = final["reward"]/(final.length) || 0;
      final["reward"] = {};
      const _final = final.map(_=>{
          _.rewardAmount = shared_reward;
          return _;
      })
      return _final;
    })
   

    let final2 = [];
    final.map(final__=>{
      if(final__.length > 0){
         final__.map(_f=>{
          if(_f.rewardAmount > 0){
            return final2.push(_f)
          }
         })
      }
    })
    final2.map(async _data=>{
      const _prediction = await Result.findOne({predictionId: _data.predictionId})
      if(!_prediction){
        const bc = await sendReward(_data.points,_data.predictionId,_data.wallet,(_data.rewardAmount/0.02));
        if(bc.hash){
          _data.isPaid = true;
          await Result.create(_data);
        }
      }
    })
    
    res.status(200).json({ message:`Results Created Successfully! pool of ${totalPoolAmount}` });
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
  storeResults: async(data) => {
    data.map(async _data=>{
      console.log(_data);
      // await Result.create(_data);
    })
  }
};
