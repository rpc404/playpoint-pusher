const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const { redis } = require("../../utils/Redis");
const Challenge = require("../models/Challenge");

module.exports = {
  // @dev creates a duo or trio challenge
  createChallege: expressAsyncHandler(async (req, res) => {
    try {
      const { predictionId, participants } = req.body;
      const existingChallenge = await Challenge.findOne({
        predictionId: predictionId,
      });
      redis.del("prediction"+predictionId);
      if (existingChallenge) {
        if (existingChallenge.participants.length < existingChallenge.slot) {
          existingChallenge.participants.push(participants);
          existingChallenge.status = "active";
          await existingChallenge.save();
          res.status(201).json({ challenge: existingChallenge });
          return;
        }
      } else {
        //if not exist create a challenege

        const newChallenge = await Challenge.create(req.body);
        if (newChallenge) {
          return res.status(201).json({ newChallenge });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }),

  /**
   * @dev Get user challenges
   */
  getChallengesByUser: expressAsyncHandler(async (request, response) => {
    redis.get(`challenges-${request.params.user}`, async (err, result) => {
      if (err) throw err;
      if (result) {
        return response.status(200).json({
          challenges: JSON.parse(result),
        });
      } else {
        const challenges = await Challenge.find({
          owner: request.params.user,
        });
        redis.set(
          `challenges-${request.params.user}`,
          JSON.stringify(challenges)
        );
        response.status(200).json(challenges);
      }
    });
  }),

  /**
   * @dev Get challenges by participants
   */


  getChallengesByChallenger: expressAsyncHandler(async (request, response) => {
    redis.get(`challenges-${request.params.userid}`, async (err, result) => {
      if (err) throw err;
      if (result) {
        return response.status(200).json({
          challenges: JSON.parse(result),
        });
      } else {
        const challenges = await Challenge.find({
          participants: { $elemMatch: { userid: request.params.userid } },
        });
        redis.set(
          `challenges-${request.params.userid}`,
          JSON.stringify(challenges)
        );
        response.status(200).json(challenges);
      }
    })
  }),

  /**
   * @dev get all chaleenges filter by duo and trio
   */

  getChallengesByFilter: expressAsyncHandler(async (req, res) => {
    console.log(req.body);
  }),
};
