const Profile = require("../models/Profile");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  setProfile: expressAsyncHandler(async (req, res) => {
    let profile = await Profile.findOne({walletID:req.body.userPublicAddress})
    if(req.body.username && profile){
        profile.username = req.body.username
        await profile.save();
    }
    if(profile && !profile.username){
        await fetch("https://api.namefake.com/").then(res=>res.json()).then(async res=>{
            profile.username = res.username;
            await profile.save();  
        })
        profile = await Profile.findOne({walletID:req.body.userPublicAddress})
    }
    if(!profile){
        await fetch("https://api.namefake.com/").then(res=>res.json()).then(async res=>{
            profile = await Profile.create({walletID:req.body.userPublicAddress,username:res.username})
        })
    }
    res.status(200).send({profile: profile});
  })

}
