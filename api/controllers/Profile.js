const Profile = require("../models/Profile");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const {
  uniqueNamesGenerator,
  adjectives,
  names,
} = require("unique-names-generator");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  setProfile: expressAsyncHandler(async (req, res) => {
    let profile = await Profile.findOne({
      walletID: req.body.userPublicAddress,
    });
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
    });
    if (req.body.username && profile) {
      profile.username = req.body.username;
      await profile.save();
    }
    if (profile && !profile.username) {
      profile.username = randomName;
      await profile.save();
      profile = await Profile.findOne({ walletID: req.body.userPublicAddress });
    }
    if (!profile) {
      profile = await Profile.create({
        walletID: req.body.userPublicAddress,
        username: randomName,
      });
    }
    res.status(200).send({ profile: profile });
  }),

  getProfile: expressAsyncHandler(async (req, res) => {
    const profile = await Profile.find({}).count();
    if (profile) {
      return res.status(200).send({ profile: profile });
    }else{
      return res.status(500).json({msg:"profile not found!"})
    }
  }),
};
