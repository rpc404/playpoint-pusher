const Pusher = require("pusher");
const socket = new Pusher({
  app_id: "1467437",
  key: "8e288ec562dedee863e7",
  secret: "6c76638e2291fb94a4a0",
  cluster: "ap2",
  useTLS: true,
});

module.exports = socket;
