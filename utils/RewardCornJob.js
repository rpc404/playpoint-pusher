const BetaFactory = require("./BetaFactoryABI.json");
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonicPhrase = process.env.MNEMONICS;

let provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonicPhrase,
    },
    providerOrUrl:
      "https://sepolia.infura.io/v3/bea174ca9f4644698c47aff0b526774c",
  });
const Web3Provider = new ethers.providers.Web3Provider(provider);
const PredictionContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    BetaFactory,
    Web3Provider
  ).connect(Web3Provider.getSigner());


module.exports = {
    sendReward:(async (points, predictionId, wallet, amount) => {     
          const reward = await PredictionContract.functions
            .rewardUser(
              points,
              predictionId,
              wallet,
              true,
              (amount*1e18).toString()
            )
            return reward;
        })
}
