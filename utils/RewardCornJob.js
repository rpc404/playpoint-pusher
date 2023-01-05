const BetaFactory = require("./BetaFactoryABI.json");
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonicPhrase = process.env.MNEMONICS;

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl: process.env.INFURA,
});
const Web3Provider = new ethers.providers.Web3Provider(provider);
const PredictionContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  BetaFactory,
  Web3Provider
).connect(Web3Provider.getSigner());

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}

module.exports = {
  sendReward: async (points, predictionId, wallet, amount) => {
    const reward =
      amount > 0
        ? await PredictionContract.functions.rewardUser(
            points,
            predictionId,
            wallet,
            true,
            ethers.utils.parseEther(String(amount))
          )
        : { msg: "send" };
    return reward;
  },
  sendChallengeReward: async (type, challengeId, wallet, amount) => {
    const reward =
      amount > 0
        ? await PredictionContract.functions.sendChallengeReward(
            type,
            challengeId,
            wallet,
            ethers.utils.parseEther(String(amount))
          )
        : { msg: "send" };
    return reward;
  },
};
