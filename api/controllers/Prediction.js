const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");
const Profile = require("../models/Profile");

const getAll = async(data) =>{
  let data = [];
  index = 0;
  await data.forEach(async element => {
    element.username = await Profile.findOne({walletID:element.predictedBy})
    data[index] = element;
    index++;
  });
  return data;

}
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
    
    const data = userid
      ? await Prediction.find({ predictedBy: userid })
      : fixtureid
      ? await Prediction.aggregate([
          {
            $lookup: {
              from: Profile,
              localField: "predictedBy",
              foreignField: "walletID",
              as: "predict_user",
            },
          },
          {
            $match:{
                 'fixtureId': fixtureid 
            }
          }
        ])
      : await Prediction.find();
    console.log(getAll(data));
    
    res.status(200).json({
      status: "success",
      message: "Predictions fetched successfully!",
      data: data,
    });
  }),
};
