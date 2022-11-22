const Profile = require("../models/Profile");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");

module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  setProfile: expressAsyncHandler(async (req, res) => {
    let profile = await Profile.findOne({walletID:req.body.userPublicAddress})
    if(profile.username===""){
        let username = "";
        fetch("https://randomuser.me/api/").then(res=>res.json()).then(res=>{
            username = res.results[0].name.first;
            console.log(username)
        })
        profile = await profile.updateOne({username:username},{new:true})
    }
    if(!profile){
        let username = "";
        fetch("https://randomuser.me/api/").then(res=>res.json()).then(res=>{
            console.log(res)
            username = res.results[0].name.first;
        })
        profile = await Profile.create({walletID:req.body.userPublicAddress,username:username})
    }
    console.log(profile)
    res.status(200).send({profile: profile});
  })

}
