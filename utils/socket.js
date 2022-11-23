const Pusher = require('pusher');
const socket = new Pusher({
  appId: "1202226",
  key: "2142cda6d39765cba2a9",
  secret: "93c2b88777c4c5d29975",
  cluster: "ap2",
  useTLS: true
});

module.exports = socket;
