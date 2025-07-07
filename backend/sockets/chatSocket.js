const Message = require("../models/Message")


function initSocket (io) {

    /* When a user sends a message:
        Backend:
        - Receives the "sendMessage" event
        - A message model should be saved to the database
        - Emit a "newMessage" event to all the users in the room
        Frontend:
        - The frontend Emits a "sendMessage" event
        - Receive the "newMessage" event
        - Add message data to the "messages array" */


    io.on("connection", (socket) => {
        console.log("A user has connected")
        //shows that a user has entered a room with their id (debugging)
        socket.on("join-room", (chatRoomId) => {
            console.log(chatRoomId)
            socket.join(chatRoomId)
            console.log("User has joined")
        })

        //for sending messages to everyone in the room
        socket.on("send-message", async (message)=> {
            const newMessage = new Message({
                sender: message.sender,
                chatRoom: message.chatRoomId,
                content: message.content
            })

            console.log("The new message: ", newMessage)
            await newMessage.save()
            io.to(message.chatRoomId).emit("receive-message", newMessage)
        })

        //for changing the group name for everybody
        socket.on("change-room-name", (foundChatRoom) => {
            console.log(`Found chat room: ${foundChatRoom}\n New name: ${foundChatRoom.name}\nCurrent Chat Id: ${foundChatRoom._id}` )
            io.to(foundChatRoom._id).emit("update-room-name", foundChatRoom);
        })
    })

}

module.exports = initSocket