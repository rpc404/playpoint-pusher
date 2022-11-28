const Pusher = require("pusher");
const socket = new Pusher({
  appId: "1514841",
  key: "4dd831b4f90804d6ebf4",
  secret: "daf1a93f424b0666a500",
  cluster: "ap2",
  useTLS: true
});

module.exports = socket;
