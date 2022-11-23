import Pusher from 'pusher';

  const socket  = new Pusher({
    app_id:"1512765",
    key:"826722860acc3c0e18f4",
    secret:"6a7d5aa84a1dc6f10673",
    cluster:"ap2",
    useTLS: true
  });
    // global.socketIO = require("socket.io")(http, {
    //   cors: {
    //     origin: "*",
    //   },
    // });

    // socketIO.on("connection", (socket) => {
    //   console.log(`⚡: ${socket.id} user just connected!`);
    //   socket.on("disconnect", () => {
    //     console.log("🔥: A user disconnected!");
    //   });
    // });
export default socket;
