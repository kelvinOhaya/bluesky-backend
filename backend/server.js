const express = require('express') //imports express.js
const http = require('http') // needed for http server and client
const cors = require('cors')
const connectDB = require('./db')
connectDB()
const app = express() //creates an express application
const server = http.createServer(app) //creates a local server
//-------Importing and initializing socket.io--------
const { Server } = require('socket.io')
require('dotenv').config()
//CORS configuration for express and socket.io in that order
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())


const rooms = []
const members = []







//function to add an id for each message in rooms

function assignIDs(room) {
    room.chatHistory.forEach((item, index) => {
        item.id = `${rooms.name}-${index + 1}`
    })
}



const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})



//Socket.IO connections and event listneners
io.on('connection', (socket) => {
    socket.broadcast.emit('memberConnected', socket.id)
    

    const newMember = {
        id: socket.id,
        currentRoom: ""
    }

    members.push(newMember)

    



    socket.on('sending', (newMessage, currentRoomID) => {
        console.log(currentRoomID)
        
        const currentRoom = rooms.find(room => room.id === currentRoomID)
       
        currentRoom.chatHistory.push(newMessage)
        assignIDs(currentRoom)

        socket.broadcast.to(currentRoom.id).emit('recieving', newMessage)
    })





    socket.on('createGroupChat', (newRoom) => {
        socket.join(newRoom.id)
        rooms.push(newRoom)
        io.to(socket.id).emit('newGroupChat', newRoom)
        // console.log(newRoom)
        console.log(rooms)
    })

    socket.on('joinRoom', (roomID) => {
        const requestedRoom = rooms.find(room => room.id === roomID)

        if (requestedRoom) {
            socket.join(requestedRoom.id)
            io.to(socket.id).emit('joinRoomSuccess', requestedRoom)
            console.log("Room Exists")
        } else {
            io.to(socket.id).emit('404roomError', 'Room doesn\'t exist')
            console.log("Room doesnt exist")
        }
    })
})



// Let the user know the server is working
const PORT  = process.env.SERVER_PORT || 3000//cool
server.listen(PORT, ()=> {
    console.log(`Running on http://localhost:${PORT}`)
})