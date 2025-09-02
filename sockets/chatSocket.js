const Message = require("../models/Message");
const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const OnlineId = require("../models/OnlineId");

function initSocket(io) {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log("No Id found");
    }

    socket.userId = userId;
    next();
  });

  io.on("connection", async (socket) => {
    console.log(`User ${socket.userId} has connected`);

    const alreadyOnline = await OnlineId.exists({ userId: socket.userId });

    if (!alreadyOnline) {
      await OnlineId.create({
        userId: socket.userId,
        socketId: socket.id,
      });
    }

    //shows that a user has entered a room with their id (debugging)
    socket.on("join-room", (data) => {
      console.log(data);
      socket.leave(data.prevRoom);
      socket.join(data.newRoom);

      console.log("User has joined");
    });

    //for sending messages to everyone in the room
    socket.on("send-message", async (message) => {
      console.log(message);
      const newMessage = new Message({
        sender: message.sender._id,
        chatRoom: message.chatRoomId,
        content: message.content,
      });
      const clientMessage = {
        sender: {
          username: message.sender.username,
          profilePicture: message.sender.profilePicture,
        },
        chatRoom: message.chatRoomId,
        content: message.content,
      };

      console.log("The new message: ", clientMessage);
      await newMessage.save();
      io.to(message.chatRoomId).emit("receive-message", clientMessage);
    });

    socket.on("update-profile-picture", (data) => {
      const foundUser = data.user;
      console.log("Event received with the following user: \n", foundUser);

      io.to(data.currentRoomId).emit("receive-photo-update", foundUser);
    });
    //add the socket event for group events
    socket.on("update-group-profile-picture", (currentChat) => {
      console.log("GROUP SOCKET STARTING\n--CURRENT CHAT: \n", currentChat);
      io.to(currentChat._id).emit("receive-group-photo-update", currentChat);
    });

    socket.on("leave-room", async (data) => {
      console.log("Leave room event triggered");
      const foundRoom = await ChatRoom.findById(data.currentRoomId);
      if (foundRoom) {
        console.log("LEAVE ROOM EVENT found the following room:,\n", foundRoom);
        const newMemberCount = foundRoom.members.length;
        socket.leave(data.currentRoomId);
        io.to(data.currentRoomId).emit("update-member-count", {
          roomId: data.currentRoomId,
          newMemberCount,
        });
      }
    });

    //for changing the group name for everybody
    socket.on("change-room-name", (foundChatRoom) => {
      console.log(
        `Found chat room: ${foundChatRoom}\n New name: ${foundChatRoom.name}\nCurrent Chat Id: ${foundChatRoom._id}`
      );
      io.to(foundChatRoom._id).emit("update-room-name", foundChatRoom);
    });

    //for showing people joining chat rooms and increasing member count live
    socket.on("update-chat-room", async (data) => {
      const { otherUserId, currentRoomId, isDm } = data;
      console.log(
        `The other user's ID is: ${otherUserId}\nThe current room Id is: ${currentRoomId}\nIs this a DM? ${isDm}`
      );
      //find the room and establish the member count
      const foundRoom = await ChatRoom.findById(currentRoomId)
        .populate({
          path: "members",
          select: "username profilePicture joinCode",
        })
        .lean();

      if (foundRoom) {
        foundRoom.memberCount = foundRoom?.members.length;

        //if the room is a dm, find the other user from OnlineIds and make foundRoom.otherUser equal to the member that matches that userId
        //after that, send the room to the client via the otheruser's id
        if (isDm === true) {
          const foundOnlineId = await OnlineId.findOne({ userId: otherUserId });
          foundRoom.otherUser = foundRoom.members.find(
            (user) => user._id != foundOnlineId.userId
          );
          delete foundRoom.members;

          if (foundOnlineId && foundRoom) {
            console.log(`We found the room: ${JSON.stringify(foundRoom)}`);
            io.to(foundOnlineId.socketId).emit("update-chat-room-client", {
              updatedRoom: foundRoom,
            });
          } else {
            console.log("No other user could be found");
          }
        } else {
          delete foundRoom.members;
          console.log("We found the room: \n", foundRoom);
          io.to(currentRoomId).emit("update-chat-room-client", {
            updatedRoom: foundRoom,
          });
        }
      } else return;
    });
    socket.on("increase-member-count", (data) => {
      io.to(data.currentRoomId).emit("increase-member-count-client", {
        roomId: data.currentRoomId,
      });
    });

    socket.on("leave-room", async (data) => {
      const { currentRoomId } = data;

      const foundRoom = await ChatRoom.findById(currentRoomId).lean();

      const onlineMembers = await OnlineId.find({
        userId: { $in: foundRoom.members },
      }).lean();

      onlineMembers.forEach((onlineUser) => {
        io.to(onlineUser.socketId).emit("user-left", { currentRoomId });
      });

      //event wil be called user-left
    });

    socket.on("disconnect", async () => {
      await OnlineId.findOneAndDelete({ userId: socket.userId });
      console.log("Successfully Disconnected!");
    });
  });
}

module.exports = initSocket;
