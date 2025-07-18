//importing express, cors, routes, the cookie parser, and the environment variable decoder
const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")
const authRoutes = require("./routes/authRoutes")
const chatRoomRoutes = require("./routes/chatRoomRoutes")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
require("dotenv").config()
const port = process.env.PORT || 5000
const path = require("path")
const initSocket = require("./sockets/chatSocket")
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://solo-chat-app.onrender.com"]
  : ["http://localhost:5173"];


//connect to mongodb (consult db.js)
connectDB();

//make an express instance
const app = express()

//connect to socket.io
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        credentials: true,
        origin: allowedOrigins,
  },
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST"]
    }
)
const uploadRoutes = require("./routes/upload")(io)

//allows use for json, parsing cookies, and cors
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,//allows us to use cookies in our requests
    origin:  allowedOrigins,
  //allow the frontend to make requests to this server
    allowedHeaders: ["Content-Type", "Authorization"]
}))

//initialize socketio's logic
initSocket(io)

//mount all the routers
app.use("/api/auth", authRoutes)
app.use("/api/chatroom", chatRoomRoutes)
app.use("/api/upload", uploadRoutes)


app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});





//listen on this port, and do the following function once listening.
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = { io }