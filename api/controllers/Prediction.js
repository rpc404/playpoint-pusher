const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");
const socket = require("../../utils/socket")

module.exports = {
  setPrediction: expressAsyncHandler(async (req, res) => {
    await Prediction.create(req.body.data);
    socket.default.trigger("prediction-channel","new-prediction",{data:req.body.data})
    res.status(200).json({
      status: "success",
      message: "Prediction created successfully!",
    });
  }),
  getPredictions: expressAsyncHandler(async (req, res) => {
    const userid = req.query.userid || "";
    const fixtureid = req.query.fixtureid || "";
    const data = userid
      ? await Prediction.find({ predictedBy: userid })
      : fixtureid
      ? await Prediction.aggregate([
          {
            $lookup: {
              from: "profiles",
              localField: "predictedBy",
              foreignField: "walletID",
              as: "user",
            },
          },
          {
            $match:{
                 'fixtureId': fixtureid 
            }
          }
        ]).exec()
      : await Prediction.find();


    res.status(200).json({
      status: "success",
      message: "Predictions fetched successfully!",
      data: data,
    });
  }),
};
