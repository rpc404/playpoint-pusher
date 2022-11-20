const expressAsyncHandler = require("express-async-handler");
const Prediction = require("../models/Prediction");

module.exports = {
    setPrediction: expressAsyncHandler(async (req, res) => {
        await Prediction.create(req.body.data);
        res.status(200).json({
            status: "success",
            message: "Prediction created successfully!",
        });
    })

};
