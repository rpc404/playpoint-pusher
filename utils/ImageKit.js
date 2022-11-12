var ImageKit = require("imagekit");

module.exports = {
  imageKit: new ImageKit({
    publicKey: "public_3/B9kNFqtIBgBbGafyW4nAE5AGo=",
    privateKey: process.env.IMAGEKIT_PK,
    urlEndpoint: "https://ik.imagekit.io/domsan",
  }),
};
