const Profile = require("../models/Profile");
const expressAsyncHandler = require("express-async-handler");
const { sanitizeQueryInput } = require("../../utils/QuerySanitizer");
const { uniqueNamesGenerator, adjectives, names  } = require('unique-names-generator');
const Admin = require("../models/Admin");
var jwt = require('jsonwebtoken');


module.exports = {
  /**
   * @dev Get Specific Marketplaces
   */
  setProfile: expressAsyncHandler(async (req, res) => {
    let profile = await Profile.findOne({walletID:req.body.userPublicAddress})
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, names] }); 
    if(req.body.username && profile){
        profile.username = req.body.username
        await profile.save();
    }
    if(profile && !profile.username){
        profile.username = randomName;
        await profile.save();  
        profile = await Profile.findOne({walletID:req.body.userPublicAddress})
    }
    if(!profile){
        profile = await Profile.create({walletID:req.body.userPublicAddress,username:randomName})
    }
    res.status(200).send({profile: profile});
  }),

  getAdmins: expressAsyncHandler( async(req,res)=>{
    const data = await Admin.find({})
    res.status(200).json(data)
  }),

  addAdmin: expressAsyncHandler( async(req,res)=>{
    const {wallet, role, name} = req.body;
    const existing = await Admin.findOne({wallet: wallet})
    if(!existing){
      const newAdmin = await Admin.create({wallet, role, name});
      return res.status(201).json(newAdmin)
    }
    return res.status(200).json({msg:"Already Exist"})
    
  }),

  removeAdmin: expressAsyncHandler( async(req, res)=>{
    const {wallet} = req.body;
    const _ = await Admin.deleteOne({_id: wallet})
    res.status(200).json({_})
  }),

  getAdmin: expressAsyncHandler( async(req, res)=>{
    const {wallet} = req.params;
    const admin = await Admin.findOne({wallet: wallet})
    if(!admin){
      return res.status(200).json({msg: "Not authorized"})
    }else{
      const token = jwt.sign(admin.wallet,"sshh")
      return res.status(201).send({admin, token})
    }
  })

}
