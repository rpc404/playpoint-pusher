module.exports = {
  socketConfig: (http) => {
    global.socketIO = require("socket.io")(http, {
      cors: {
        origin: "*",
      },
    });

    socketIO.on("connection", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);
      socket.on("disconnect", () => {
        console.log("🔥: A user disconnected!");
      });
    });
  },
};
