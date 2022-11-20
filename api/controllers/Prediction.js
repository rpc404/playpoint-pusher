const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");

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
        const data = userid ? await Prediction.find({predictedBy:userid}) : await Prediction.find()
        res.status(200).json({
            status: "success",
            message: "Predictions fetched successfully!",
            data: data
        });
    }
    )
};
