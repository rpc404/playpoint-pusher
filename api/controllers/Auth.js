const expressAsyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/emaiService");
const Profile = require("../models/Profile");
const Token = require("../models/Token");
const url =
  process.env.ENV == "development"
    ? "http://localhost:5173/verify"
    : "https://playpoint.ai/verify";
const _EthWallet = require("ethereumjs-wallet");
const TronWebNode = require("tronweb");
const { uniqueNamesGenerator, adjectives, names  } = require('unique-names-generator');
const Wallet = require("../models/Wallet");
var jwt = require('jsonwebtoken');
const socket = require("../../utils/socket");


module.exports = {
  handleEmail: expressAsyncHandler(async (request, response) => {
    const { email } = request.body;

    // find email
    const _email = await Profile.findOne({ email: email });
    const _tokenSent = await Token.findOne({ email: email });
    if (_tokenSent) {
      return response.json({
        msg: "You have just reqested for the OTP. please verify or try after a moment",
      });
    }
    let _exist = true;
    let token;
    while (_exist) {
      token = Math.floor(Math.random() * 1000000).toFixed(0);
      _exist = await Token.findOne({ token: token });
    }
    if (!_email) {
      const _token = await Token.create({ email: email, token: token });
      const html = `<h2>Your email verification code is ${token}</h2><h4>Or click on the link below to verify your account</h4><a href="${url}/${_token._id}" target="_blank">Verify Account</a>`;
      await sendEmail({ to: email, subject: "Email Verification", html: html });
      response.json({ msg: "Verification code sent", variant:"0" });
    }
    if(_email){
        // handler for existing user
        await Token.create({email:email, token: token});
        const html = `<h2>Your OTP is ${token}</h2>`;
        await sendEmail({ to: email, subject: "Login OTP", html: html });
        response.json({ msg: "OTP Sent", variant:"1" });
    }
    // sendEmail();
  }),
  handleToken: expressAsyncHandler(async (request, response) => {
    const { token, email } = request.body;
    const _verify = await Token.findOneAndDelete({ email, token });
    if (_verify) {
      response.json({ msg: "Account verified" });
      // create wallet
      const EthWallet = _EthWallet.default.generate();
      const TronWallet = TronWebNode.createRandom();
      const wallet = [
        {
          address: EthWallet.getAddressString(),
          privateKey: EthWallet.getPrivateKeyString(),
          ref:"ERC"
        },
        {
            address: TronWallet.publicKey,
            privateKey: TronWallet.privateKey,
            ref:"TRC"
        }
      ];
      const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, names] }); 
      const _newUser = await Profile.create({username: randomName, walletID:"", email:email});
      const _wallets = await Wallet.create({wallets: wallet,userid: _newUser._id});
      _newUser.walletID = _wallets._id;
      await _newUser.save();
      const token = jwt.sign(_newUser.toObject(),"sshh")
      socket.trigger(`verifiction-${email}`,"verified",{token,_wallets,_newUser});
      return;
    } else {
      return response.json({ msg: "Invalid Token" });
    }
  }),

  handleOTP: expressAsyncHandler(async(request,response)=>{
    const { token, email } = request.body;
    const _verify = await Token.findOneAndDelete({ email, token });
    if (_verify) {
        const _user = await Profile.findOne({email: email})
        const token = jwt.sign(_user.toObject(),"sshh")
        const _wallet = await Wallet.findById(_user.walletID);
        return response.json({_user, accessToken:token, _wallet})
    }else{
        return response.status(400).json({msg:"Invalid OTP"});
    }
  })
};
