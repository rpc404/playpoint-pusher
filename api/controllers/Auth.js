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
const { uniqueNamesGenerator } = require("unique-names-generator");
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
    if (!_email) {
      let _exist = true;
      let token;
      while (_exist) {
        token = Math.floor(Math.random() * 1000000).toFixed(0);
        _exist = await Token.findOne({ token: token });
      }
      const _token = await Token.create({ email: email, token: token });
      const html = `<h2>Your email verification code is ${token}</h2><h4>Or click on the link below to verify your account</h4><a href="${url}/${_token._id}" target="_blank">Verify Account</a>`;
      await sendEmail({ to: email, subject: "Email Verification", html: html });
      response.json({ msg: "Token send for verification" });
    }
    // if(_email){
    //     // handler for existing user
    //     const token  = parseInt(Math.random() * 100000);
    //     await Token.create({email:email, token: token});
    //     await sendEmail({recipent: email, token: token})
    // }
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
      const _newUser = await Profile.create({username: randomName, walletID:""});
      const _wallets = await Wallet.create({wallets: wallet,userid: _newUser._id});
      _newUser.walletID = _wallets._id;
      await _newUser.save();
      const token = jwt.sign(admin.wallet,"sshh")
      socket.trigger(`verifiction-${email}`,"verified",{token,_wallets,_newUser});
      return;
    } else {
      return response.json({ msg: "Invalid Token" });
    }
  }),
};
