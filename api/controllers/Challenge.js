const expressAsyncHandler = require("express-async-handler");
const Challenge = require("../models/Challenge");




module.export = {


    // @dev creates a duo or trio challenge
    createChallege: expressAsyncHandler( async(req,res)=>{
        const { predictionId, owner, type, participants } = req.body;
        const existingChallenge = await Challenge.findOne({predictionId: predictionId})
        if(existingChallenge){
            if( existingChallenge.participants.length<1 && type=="duo"){
                existingChallenge.participants.push(participants);
                existingChallenge.status = "active";
                await existingChallenge.save();
                res.status(201).json({"msg":"Duo challenge created"});
                return;
            }
        }
        //if not exist create a challenege
        const newChallenge  = await Challenge.create(req.body);
        if(newChallenge){
            return res.status(201).json({"msg":`New ${newChallenge.type} Challenge created`})
        }

    })
}