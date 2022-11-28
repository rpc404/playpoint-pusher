const Pusher = require("pusher");

const socket = new Pusher({
  appId: "1514858",
  key: "e6640b48a82cccbb13d0",
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "ap2",
  useTLS: true
});

module.exports = socket;
