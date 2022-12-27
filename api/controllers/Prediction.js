const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");
const socket = require("../../utils/socket");
const Questionaire = require("../models/Questionaire");
const { default: mongoose, isValidObjectId, isObjectIdOrHexString } = require("mongoose");

module.exports = {
  setPrediction: expressAsyncHandler(async (req, res) => {
    const {questionaireId, answers} = req.body.data;
    const question = await Questionaire.findById(questionaireId);
    const all = question.questionaires.questions;
    let _prediction = await Prediction.create(req.body.data);
    _prediction = await Prediction.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "predictedBy",
          foreignField: "walletID",
          as: "user",
        },
      },
      {
        $match: {
          _id: _prediction._id,
        },
      },
    ]).exec();
    socket.trigger("prediction-channel", "new-prediction", {
      data: _prediction,
    });
    res.status(200).json({
      status: "success",
      prediction: _prediction,
      message: "Prediction created successfully!",
    });
  }),
  getPredictions: expressAsyncHandler(async (req, res) => {
    const userid = req.query.userid || "";
    const fixtureid = req.query.fixtureid || "";
    const data = userid
      ? await Prediction.find({ predictedBy: userid }).populate('fixtureId')
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
            $match: {
              fixtureId: mongoose.Types.ObjectId(fixtureid),
            },
          },
        ]).exec()
      : await Prediction.find();
     let _data = [];
      if(fixtureid && data.length===0){
        _data = await Prediction.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "predictedBy",
            foreignField: "walletID",
            as: "user",
          },
        },
        {
          $match: {
            fixtureId: fixtureid,
          },
        },
      ]).exec()
      
      }
    res.status(200).json({
      status: "success",
      message: "Predictions fetched successfully!",
      data: data.concat(_data),
    });
  }),
  getPredictionById: expressAsyncHandler(async (req, res) => {
    const pid = req.params.pid;
    const data =  await Prediction.aggregate([
          {
            $lookup: {
              from: "profiles",
              localField: "predictedBy",
              foreignField: "walletID",
              as: "user",
            },
          },
          {
            $match: {
              _id: mongoose.Types.ObjectId(pid),
            },
          },
        ]).exec()
    const questions = await Questionaire.findById(data[0].questionaireId)

    res.status(200).json({
      status: "success",
      message: "Predictions fetched successfully!",
      data: [...data, questions],
    });
  }),
};
