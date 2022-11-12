var ImageKit = require("imagekit");

module.exports = {
  imageKit: new ImageKit({
    publicKey: "public_vK8CfQFU5C/depSFZoKnSb7iSdE=",
    privateKey: process.env.IMAGEKIT_PK,
    urlEndpoint: "https://ik.imagekit.io/theboringschool",
  }),
};
