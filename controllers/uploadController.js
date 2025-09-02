const {cloudinary} = require("../config/cloudinary")
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");

exports.updateProfilePicture =  async (req, res) => {
        try {
            const foundUser = await User.findById(req.user.id)
            const imageUrl = req.file.path;
            console.log("Current User: ", foundUser, "\nImage Url: ", imageUrl)

            if(foundUser.profilePicture != null) {
                await cloudinary.uploader.destroy(foundUser.profilePicture.public_Id)
            }

            const newProfilePicture = {url: imageUrl, public_Id: req.file.filename}

            await User.findByIdAndUpdate(req.user.id, {profilePicture: newProfilePicture})

            return res.status(200).json({foundUser})
        } catch (error) {
            console.log("Failed to upload image to cloudinary: ", error)
            return res.status(500).json({error: "Failed to upload image to cloudinary"})
        }
    }

 exports.updateGroupProfilePicture = async (req, res) => { 
    const {roomId} = req.body;
    const imageUrl = req.file.path;

    try {
        // console.log(roomId)
        const newGroupProfilePicture = {url: imageUrl, public_Id: req.file.filename}
        const foundChatRoom = await ChatRoom.findById(roomId)

        if(foundChatRoom.profilePicture != null) {
                await cloudinary.uploader.destroy(foundChatRoom.profilePicture.public_Id)
        }

        console.log("NEW GROUP PROFILE PIC: ", newGroupProfilePicture, "\n")
        foundChatRoom.profilePicture = newGroupProfilePicture;
        console.log("FOUND CHAT ROOM: ", foundChatRoom)
        await foundChatRoom.save();


        return res.status(200).json({foundChatRoom})

    } catch (error) {
        console.log("Failed to upload the group Profile to cloudinary: ", error)
        return res.status(500).json({error})
    }
 }