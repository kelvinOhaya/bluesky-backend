//importing express, cors, routes, the cookie parser, and the environment variable decoder
const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const path = require("path");
const { init } = require("./io");
const initSocket = require("./sockets/chatSocket");
const allowedOrigins = [
  `http://localhost:${process.env.FRONTEND_PORT}`,
  process.env.FRONTEND_URL,
  process.env.FRONTEND_NETWORK_URL,
];

//connect to mongodb (consult db.js)
connectDB();

//make an express instance
const app = express();

//connect to socket.io
const server = http.createServer(app);
const io = init(server, allowedOrigins);
initSocket(io);

//allows use for json, parsing cookies, and cors
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true, //allows us to use cookies in our requests
    origin: true, // Allow all origins for development/mobile testing
    //allow the frontend to make requests to this server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//initialize socketio's logic

//mount all the routers
app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatRoomRoutes);
app.use("/api/upload", uploadRoutes);

//listen on this port, and do the following function once listening.
server.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port} on all interfaces`);
});
