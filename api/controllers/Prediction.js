const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");
const Profile = require("../models/Profile");

module.exports = {
  setPrediction: expressAsyncHandler(async (req, res) => {
    await Prediction.create(req.body.data);
    res.status(200).json({
      status: "success",
      message: "Prediction created successfully!",
    });
  }),
  getPredictions: expressAsyncHandler(async (req, res) => {
    const userid = req.query.userid || "";
    const fixtureid = req.query.fixtureid || "";
    let data = userid
      ? await Prediction.find({ predictedBy: userid })
      : fixtureid
      ? await Prediction.aggregate([
          {
            $match:{
                 'fixtureId': fixtureid 
            }
          }
        ])
      : await Prediction.find();
    
    data = data.forEach(async d=>{
      d.username = await Profile.findOne({walletID:d.predictedBy})
      return d;
    });
    console.log(data);
    res.status(200).json({
      status: "success",
      message: "Predictions fetched successfully!",
      data: data,
    });
  }),
};
