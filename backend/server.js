//importing express, cors, routes, the cookie parser, and the environment variable decoder
const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")
const authRoutes = require("./routes/authRoutes")
const chatRoomRoutes = require("./routes/chatRoomRoutes")
const uploadRoutes = require("./routes/upload")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
require("dotenv").config()
const port = process.env.BACKEND_PORT
const initSocket = require("./sockets/chatSocket")

//connect to mongodb (consult db.js)
connectDB();

//make an express instance
const app = express()

//connect to socket.io
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
        allowedHeader: ["Content-Type", "Authorization"],
        methods: ["GET", "POST"]
    }
})

//initialize socketio's logic
initSocket(io)
server.listen(port)

//allows use for json, parsing cookies, and cors
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,//allows us to use cookies in our requests
    origin: process.env.FRONTEND_URL,//allow the frontend to make requests to this server
    allowedHeader: ["Content-Type", "Authorization"]
}))

//mount all the authentication routes (consult authRoutes.js)
app.use("/api/auth", authRoutes)
app.use("/api/chatroom", chatRoomRoutes)
app.use("/api/upload", uploadRoutes)

//intro code
app.get("/", (req, res) => {
    res.json({intro: "Hello Express!"})
})



//listen on this port, and do the following function once listening.
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})