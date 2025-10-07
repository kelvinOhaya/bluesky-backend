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
  `http://localhost:${process.env.FRONTEND_PORT}`, // Vite dev server
  process.env.FRONTEND_URL, // Production Netlify
  "http://localhost:3000", // Alternative dev port
  "http://127.0.0.1:5173", // Alternative localhost format
];

//connect to mongodb (consult db.js)
connectDB();

//make an express instance
const app = express();

// Trust proxy for Railway/Netlify deployment
app.set("trust proxy", 1);

//connect to socket.io
const server = http.createServer(app);
const io = init(server, allowedOrigins);
initSocket(io);

//allows use for json, parsing cookies, and cors
app.use(express.json());
app.use(cookieParser());

// Debug middleware (remove in production)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
  });
}

app.use(
  cors({
    credentials: true, //allows us to use cookies in our requests
    origin: allowedOrigins,
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
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
