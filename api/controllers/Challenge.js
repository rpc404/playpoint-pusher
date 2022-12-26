const expressAsyncHandler = require("express-async-handler");
const Challenge = require("../models/Challenge");

module.exports = {
    // @dev creates a duo or trio challenge
    createChallege: expressAsyncHandler( async(req,res)=>{
      try {
        const { predictionId, type, participants } = req.body;
        const existingChallenge = await Challenge.findOne({predictionId: predictionId})
        if(existingChallenge){
            if( existingChallenge.participants.length<1 && type=="duo"){
                existingChallenge.participants.push(participants);
                existingChallenge.status = "active";
                await existingChallenge.save();
                res.status(201).json({"msg":"Duo challenge created"});
                return;
            }
        }else{
          //if not exist create a challenege
          const newChallenge  = await Challenge.create(req.body);
          if(newChallenge){
              return res.status(201).json({newChallenge})
          }
        }
        
      } catch (error) {
          console.log(error)
      }
    

    }),
  
    /**
   * @dev Get user challenges
   */
  getChallengesByUser: expressAsyncHandler( async (request, response)=>{
    const challenges = await Challenge.find({owner: request.params.user});
    response.status(200).json(challenges);
  }),

  /**
   * @dev Get challenges by participants
   */

  getChallengesByChallenger: expressAsyncHandler( async(request, response)=>{
    const challenges = await Challenge.find({participants: { $eleMatch:{userid: request.params.userid} }})
    response.status(200).json(challenges);
  }),

  /**
   * @dev get all chaleenges filter by duo and trio 
   */

  getChallengesByFilter: expressAsyncHandler ( async (req, res)=>{
    console.log(req.body)
  })
}