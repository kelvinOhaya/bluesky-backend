const utils = require("../utils/utils")
const ChatRoom = require("../models/ChatRoom")
const User = require("../models/User")
const mongoose = require("mongoose")
const JoinCode = require("../models/JoinCode")
const Message = require("../models/Message")
// const Message = require("../models/Message");


exports.createRoom = async (req, res) => {
    const { name, senderId} = req.body;
    const joinCode = await utils.generateJoinCode(6);

    const newChatRoom = new ChatRoom ({name: name, creator: senderId, members: [senderId], joinCode: joinCode});
    await newChatRoom.save();

    return res.json({newRoom: newChatRoom});
}

exports.joinRoom = async (req, res) => {
    const senderId = req.user.id
    const { joinCode} = req.body;
    const trimmedCode = joinCode.trim();
    console.log(senderId)

    //look for a room, and if one is not found, send error to client
    const foundRoom = await ChatRoom.findOneAndUpdate({joinCode: trimmedCode},
        {$addToSet: {members: senderId}},
        {new: true}
    );
    if (!foundRoom) { res.status(400).json({error: "incorrect join code"})}
    console.log(foundRoom)

    return res.json({newRoom: foundRoom})
}

exports.findUser = async (req, res) => {
    const { joinCode } = req.body

    const foundJoinCode = User.findOne({joinCode})

    if(!foundJoinCode) {
        return res.status(500).json({error: "User doesn't exist"})
    }

    const newJoinCode = await utils.generateJoinCode(6)

    const foundUser = await User.findOne({joinCode});

    if (!foundUser) {
        return res.status(404).json({message: "Error: User not found"})
    }

    const senderId = req.user.id;

    const newDm = new ChatRoom ({
        isGroup: true,
        creator: null,
        members: [senderId, foundUser._id],
        joinCode: newJoinCode,
        profilePicture: null
    })

    await newDm.save();
    return res.sendStatus(200)
}


exports.sendInfo = async (req, res) => {
    const senderId = req.user.id


    //find all chat rooms where the user's Id is in there
    try {
        const [foundUser, filteredChatRooms] = await Promise.all([
            User.findById(senderId),
            ChatRoom.find({"members": {$in: [senderId]}}).populate({
                path: "members",
                select: "username profilePicture -_id"
            }).lean(),
        ])

        filteredChatRooms.forEach(room => {
            if(room.isGroup === true) {
                room.otherUser = room.members.find((user) => user.username != foundUser.username)
                if(!room.otherUser) { console.log ("No other user could be found")}
            }
            delete room.members;
        })

        const currentChat = filteredChatRooms.find((room) => (room._id.toString() === foundUser.currentChat.toString()));

        if(!currentChat) { console.log("No current chat found") }

        if(filteredChatRooms.length === 0) return res.status(200).json({message: "empty"})
        return res.status(200).json({chatRooms: filteredChatRooms, currentChat})

    } catch (error) {
        console.log(error);
    }

    //FUTURE: filter through messages based on userId (wait for creation of messages)
}



exports.loadMessages = async (req, res) => {
    const {currentChatId} = req.body;
    try {
        const foundMessages = await Message.find({chatRoom: currentChatId}).populate("sender", "username profilePicture")
        res.status(200).json({messages: foundMessages})
    } catch (error) {
        console.log("Error loading the chat rooms: ", error)
    }
}



exports.verifyJoinCode = async (req, res) => {
    const {joinCode} = req.body

    const foundRoom = await ChatRoom.findOne({joinCode})

    return res.json({isValid: foundRoom !== null})
}



exports.changeName = async (req, res) => {
    const { newName, currentRoomId } = req.body;

    try {
        const foundChatRoom = await ChatRoom.findById(currentRoomId);

        foundChatRoom.name = newName;
        await foundChatRoom.save();
        return res.json({foundChatRoom});
    } catch (error) {
        console.log("Error in the changeName function: ", error);
    }
}

exports.updateCurrentRoom = async (req, res) => {
    const userId = req.user.id;
    const {currentRoomId} = req.body;

    try {
        await User.findByIdAndUpdate(userId, {currentChat: currentRoomId}, {new: true});
        return res.sendStatus(200);
    } catch(error) {
        console.log("Error trying to find the user: ", error)
    }
}


//delete chat room
exports.leaveRoom = async (req, res) => {
    const senderId = req.user.id;
    const { currentRoomId } = req.body;

    //find the chat room and if the members array only has one person, delete the room. Else, remove the user's userId from the members array
    try {
        const foundChatRoom = await ChatRoom.findById(currentRoomId);
        if(foundChatRoom?.members.length < 1) {
            await Promise.all([
                ChatRoom.findByIdAndDelete(currentRoomId),
                Message.deleteMany({chatRoom: foundChatRoom._id}),
                JoinCode.findOneAndDelete({content: foundChatRoom.joinCode})])
        } else {
            await ChatRoom.findOneAndUpdate({_id: currentRoomId}, {$pull: {members: senderId}});
        }
        await User.findOneAndUpdate({_id: senderId}, {$set: {currentChat: null}});
        console.log("Successfully removed!");

        return res.json({success: true})
    } catch (error) {
        console.log(error)
    }

}

