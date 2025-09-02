const utils = require("../utils/utils");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const mongoose = require("mongoose");
const JoinCode = require("../models/JoinCode");
const Message = require("../models/Message");
const OnlineId = require("../models/OnlineId");
const { getIo } = require("../io");
// const Message = require("../models/Message");

exports.createRoom = async (req, res) => {
  const { name, senderId } = req.body;
  const joinCode = await utils.generateJoinCode(6);

  const newChatRoom = new ChatRoom({
    name: name,
    creator: senderId,
    members: [senderId],
    joinCode: joinCode,
  });

  await newChatRoom.save();

  const clientChatRoom = await ChatRoom.findOne({ joinCode }).lean();
  clientChatRoom.memberCount = clientChatRoom.members.length;

  return res.json({ newRoom: clientChatRoom });
};

exports.joinRoom = async (req, res) => {
  const senderId = req.user.id;
  let { joinCode } = req.body;
  joinCode = joinCode.trim();
  console.log(senderId);

  //look for a room, and if one is not found, send error to client
  const foundRoom = await ChatRoom.findOneAndUpdate(
    { joinCode },
    { $addToSet: { members: senderId } },
    { new: true }
  ).lean();
  if (!foundRoom) {
    res.status(400).json({ error: "incorrect join code" });
  }
  foundRoom.memberCount = foundRoom.members.length;
  console.log(foundRoom);

  return res.json({ newRoom: foundRoom });
};

//check for exmembers
exports.findUser = async (req, res) => {
  let { joinCode } = req.body;
  joinCode = joinCode.trim();
  const senderId = req.user.id;

  const foundUser = await User.findOne({ joinCode });

  if (!foundUser) {
    return res.status(404).json({ message: "Error: User not found" });
  }

  const dmAlreadyExists = await ChatRoom.exists({
    exMembers: { $in: [senderId] },
    members: { $in: [foundUser._id] },
    idDm: true,
  });

  if (dmAlreadyExists) {
    const foundRoom = await ChatRoom.findOneAndUpdate(
      {
        isDm: true,
        $or: [
          { members: { $all: [senderId, foundUser._id] } },
          { members: senderId, exMembers: foundUser._id },
          { members: foundUser._id, exMembers: senderId },
        ],
      },
      {
        $pull: { exMembers: senderId },
        $addToSet: { members: senderId },
      }
    ).populate({ path: "members", select: "username profilePicture joinCode" });
    const clientRoom = foundRoom.toObject();
    await foundRoom.save();

    clientRoom.otherUser = clientRoom.members.find(
      (user) => user.username === foundUser.username //in this case, the found user is actually the other user
    );
    clientRoom.memberCount = 2;
    delete clientRoom.members;

    console.log("AAAAA\n", clientRoom);
    return res
      .status(200)
      .json({ otherUserId: foundUser._id, newRoom: clientRoom });
  } else {
    const newJoinCode = await utils.generateJoinCode(6);
    const newDm = new ChatRoom({
      isDm: true,
      creator: null,
      members: [senderId, foundUser._id],
      joinCode: newJoinCode,
      profilePicture: null,
    });

    await newDm.save();
    //optomize with promise.all soon
    const foundOnlineId = await OnlineId.findOne({ userId: foundUser._id });

    const foundDm = await ChatRoom.findOne({ joinCode: newJoinCode })
      .populate({ path: "members", select: "username profilePicture joinCode" })
      .lean();

    foundDm.otherUser = foundDm.members.find(
      (user) => user.username === foundUser.username
    );
    foundDm.memberCount = foundDm.members.length;
    delete foundDm.members;

    getIo()
      .to(foundOnlineId.socketId)
      .emit("update-chat-client", { updatedRoom: foundDm });

    return res
      .status(200)
      .json({ otherUserId: foundUser._id, newRoom: foundDm });
  }
};

exports.sendInfo = async (req, res) => {
  const senderId = req.user.id;
  console.log(`IO constructor name: ${getIo().constructor.name}`);

  //find all chat rooms where the user's Id is in there
  try {
    const [foundUser, filteredChatRooms] = await Promise.all([
      User.findById(senderId),
      ChatRoom.find({ members: { $in: [senderId] } })
        .populate({
          path: "members",
          select: "username profilePicture joinCode",
        })
        .populate({
          path: "exMembers",
          select: "username profilePicture -_id",
        })
        .lean(),
    ]);

    filteredChatRooms.forEach((room) => {
      room.memberCount = room.members.length;

      if (room.isDm === true) {
        if (room.members.length > 1) {
          room.otherUser = room.members.find(
            (user) => user.username != foundUser.username
          );
        } else {
          room.otherUser = room.exMembers.find(
            (user) => user.username != foundUser.username
          );
        }
        if (!room.otherUser) {
          console.log("No other user could be found");
        }
      }
      delete room.members;
    });

    //MAKE IT SO THAT USERS CANT FIND A USER TWICE!!! SAME FOR GROUP CHATS
    const currentChat =
      filteredChatRooms.find(
        (room) => room._id.toString() === foundUser.currentChat?.toString()
      ) || null;

    !currentChat && console.log("No current chat found");

    if (filteredChatRooms.length === 0) {
      return res.status(200).json({ message: "empty" });
    }
    return res.status(200).json({ chatRooms: filteredChatRooms, currentChat });
  } catch (error) {
    console.log(error);
  }
};

exports.loadMessages = async (req, res) => {
  const { currentChatId } = req.body;
  try {
    const foundMessages = await Message.find({
      chatRoom: currentChatId,
    }).populate("sender", "username profilePicture");
    res.status(200).json({ messages: foundMessages });
  } catch (error) {
    console.log("Error loading the chat rooms: ", error);
  }
};

exports.verifyJoinCode = async (req, res) => {
  const { joinCode } = req.body;

  const foundRoom = await ChatRoom.findOne({ joinCode });

  return res.json({ isValid: foundRoom !== null });
};

exports.changeName = async (req, res) => {
  const { newName, currentRoomId } = req.body;

  try {
    const foundChatRoom = await ChatRoom.findById(currentRoomId);

    foundChatRoom.name = newName;
    const clientChatRoom = foundChatRoom.toObject();
    await foundChatRoom.save();

    clientChatRoom.memberCount = clientChatRoom.members.length;
    return res.json({ foundChatRoom: clientChatRoom });
  } catch (error) {
    console.log("Error in the changeName function: ", error);
  }
};

exports.updateCurrentRoom = async (req, res) => {
  const userId = req.user.id;
  const { currentRoomId, socketId } = req.body;
  console.log(`Socket Id: ${socketId}`);

  try {
    await User.findByIdAndUpdate(
      userId,
      { currentChat: currentRoomId },
      { new: true }
    );
    getIo().to(socketId).emit("print-success");
    return res.sendStatus(200);
  } catch (error) {
    console.log("Error trying to find the user: ", error);
  }
};

//delete chat room
exports.leaveRoom = async (req, res) => {
  const senderId = req.user.id;
  const { currentRoomId } = req.body;
  console.log(`Current Room Id: ${currentRoomId}`);

  //find the chat room and if the members array only has one person, delete the room. Else, remove the user's userId from the members array
  try {
    const foundChatRoom = await ChatRoom.findById(currentRoomId);
    if (!foundChatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    if (!Array.isArray(foundChatRoom.members)) {
      foundChatRoom.members = [];
    }
    const memberCount = foundChatRoom.members.length;

    if (memberCount === 1) {
      await Promise.all([
        ChatRoom.findByIdAndDelete(currentRoomId),
        Message.deleteMany({ chatRoom: foundChatRoom._id }),
      ]);
    } else {
      await Promise.all([
        ChatRoom.findOneAndUpdate(
          { _id: currentRoomId },
          { $pull: { members: senderId }, $addToSet: { exMembers: senderId } }
        ),
        User.findOneAndUpdate(
          { _id: senderId },
          { $set: { currentChat: null } }
        ),
      ]);
      console.log("Successfully removed!");

      // Re-fetch the updated room for emitting to clients
      const updatedRoom = await ChatRoom.findById(currentRoomId).lean();
      if (updatedRoom) {
        updatedRoom.memberCount = updatedRoom.members
          ? updatedRoom.members.length
          : 0;
        delete updatedRoom.members;
        getIo()
          .to(currentRoomId)
          .emit("update-chat-room-client", { updatedRoom });
      }

      return res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while leaving the room." });
  }
};
