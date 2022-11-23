const Pusher = require('pusher');
const socket  = new Pusher({
    app_id:"1512765",
    key:"826722860acc3c0e18f4",
    secret:"6a7d5aa84a1dc6f10673",
    cluster:"ap2",
    useTLS: true
  });

module.exports = socket;
