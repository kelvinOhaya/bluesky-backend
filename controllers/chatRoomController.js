const utils = require("../utils/utils");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const mongoose = require("mongoose");
const JoinCode = require("../models/JoinCode");
const Message = require("../models/Message");
const OnlineId = require("../models/OnlineId");
const { getIo } = require("../io");
const { ObjectId } = require("mongodb");
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

//For making new DMs
exports.findUser = async (req, res) => {
  let { joinCode } = req.body;
  joinCode = joinCode.trim();
  const senderId = new ObjectId(req.user.id);

  //look for the other user. If they don't exist, return an error
  const foundUser = await User.exists({ joinCode });
  if (!foundUser) {
    return res.status(404).json({ message: "Error: User not found" });
  }

  //debug message to ensure foundUser exists
  //console.log(`The following User ID was found: ${JSON.stringify(foundUser)}`);

  //look for the user's corresponding onlineID. If it doesn't exist, return an error
  const foundOnlineId = await OnlineId.findOne({ userId: foundUser._id });

  //debug message to ensure OnlineId exists
  //console.log(`The following online ID was found: ${foundOnlineId}`);

  //aggregation for the foundRoom Document
  const foundRoom = await ChatRoom.aggregate([
    {
      $match: {
        isDm: true,
        $or: [
          //check if any of these are true
          { members: { $all: [senderId, foundUser._id] } }, //both user's ids are in members[]
          //the sender's id is in members[], and the other person's id is in exMembers[]
          {
            $and: [
              //senderId needs to be converted to ab objectId because right now its just a string
              { members: { $in: [senderId] } }, //check to see if senderId is in the members array
              { exMembers: { $in: [foundUser._id] } }, //follows ^this logic
            ],
          },
          //the other person's id is in members[], and the sender's id is in exMembers[]
          {
            $and: [
              { members: { $in: [foundUser._id] } },
              { exMembers: { $in: [senderId] } },
            ],
          },
        ],
      },
    },
    {
      //changes for the client
      $set: {
        //set members and exMembers arrays
        members: {
          //if senderId is in exMembers, add senderId to members. Otherwise, just return members
          $cond: {
            if: { $in: [senderId, "$exMembers"] },
            then: { $setUnion: ["$members", [senderId]] },
            else: "$members",
          },
        },
        //make a new exMembers array excluding senderId (since this is a dm, should make it empty)
        exMembers: {
          $filter: {
            input: "$exMembers",
            as: "exMember",
            cond: { $ne: ["exMember._id", senderId] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { memberIds: "$members" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
          { $project: { username: 1, profilePicture: 1, joinCode: 1 } },
        ],
        as: "members",
      },
    },
    {
      $addFields: {
        otherUser: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$members",
                as: "member",
                cond: { $ne: ["$$member._id", senderId] },
                limit: 1,
              },
            },
            0,
          ],
        },
        memberCount: { $size: "$members" },
      },
    },
    { $unset: ["members", "exMembers"] },
  ]);

  //if such a room exists, update that room
  if (foundRoom.length > 0) {
    await ChatRoom.findOneAndUpdate(
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
    );

    console.log("Here is the found room:\n", foundRoom); //check if the client room exists or not

    //SEND SOCKET EVENT TO INCREASE MEMBER COUNT AS WELL (only if onlineId is found, otherwise the other person isn't online, so there's no point)
    if (foundOnlineId) {
      getIo()
        .to(foundOnlineId.socketId)
        .emit("increase-member-count", { updatedRoomId: foundRoom._id }); //make this a new event called "increase-member-count" for clarity
    }

    //send the new room and the id of the other user to the client
    return res
      .status(200)
      .json({ otherUserId: foundUser._id, newRoom: foundRoom });
  } else {
    //if the foundRoom doesn't exist, make a new one and save it to mongodb
    const newJoinCode = await utils.generateJoinCode(6);
    const newDm = new ChatRoom({
      isDm: true,
      creator: null,
      members: [senderId, foundUser._id],
      joinCode: newJoinCode,
      profilePicture: null,
    });

    await newDm.save();

    //find the chat room that was just created
    const foundDm = await ChatRoom.aggregate([
      { $match: { joinCode: newJoinCode } }, //find the room with the matching value
      {
        //look in the user's field and make the following aggregation pipeline
        $lookup: {
          from: "users",
          let: { memberIds: "$members" }, //variable for our sub-pipeline
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } }, //get all users where their id matches the memberId (members field)
            { $project: { username: 1, profilePicture: 1, joinCode: 1 } }, //fields we want to project (1=include, 0=exclude)
          ],
          as: "members",
        },
      },
      {
        //add the otherUsers field
        $addFields: {
          //get the first element from the following array
          otherUser: {
            $arrayElemAt: [
              {
                //filter down the array from members to elements
                $filter: {
                  input: "$members", //expression that becomes an array (members field)
                  as: "member", //name for individual array elem

                  //make a new array with member elements where _id does not equal the sender's id
                  cond: {
                    $ne: ["$$member._id", senderId],
                  },
                  limit: 1, //sanity check, as there should only be one otherUser
                },
              },
              0, //take the first element of the filtered array
            ],
          },
          memberCount: { $size: "$members" }, //make memberCount the size of the members array
        },
      },
      { $unset: ["members", "exMembers"] },
    ]);

    //send the socketEvent "add-room"
    if (foundOnlineId) {
      getIo()
        .to(foundOnlineId.socketId)
        .emit("update-chat-client", { updatedRoom: foundDm }); //make this a new event called "add-room" for clarity
    }

    //send status 200 with the otherUserId and the new room
    return res
      .status(200)
      .json({ otherUserId: foundUser._id, newRoom: foundDm });
  }
};

exports.sendInfo = async (req, res) => {
  const senderId = req.user.id;
  // console.log(`IO constructor name: ${getIo().constructor.name}`);

  //find all chat rooms where the user's Id is in there
  try {
    const [foundUser, filteredChatRooms] = await Promise.all([
      User.findById(senderId),

      ChatRoom.aggregate([
        {
          $match: {
            members: new ObjectId(senderId),
          },
        },
        {
          $lookup: {
            from: "users",
            let: { memberId: "$members" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$memberId"] } } },
              { $project: { username: 1, profilePicture: 1, joinCode: 1 } },
            ],
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { exMemberIds: "$exMembers" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $cond: [
                      { $gt: [{ $size: "$$exMemberIds" }, 0] },
                      { $in: ["$_id", "$$exMemberIds"] },
                      false,
                    ],
                  },
                },
              },
              { $project: { username: 1, profilePicture: 1 } },
            ],
            as: "exMembers",
          },
        },
      ]),
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
