let io = null;

const { Server } = require("socket.io");

function init(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      credentials: true,
      origin: allowedOrigins,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST"],
    },
  });
  return io;
}

function getIo() {
  return io ? io : new Error("Could not find socket.io");
}

module.exports = { init, getIo };
