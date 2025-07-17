const express = require("express");
const multer = require("multer");
const {storage, cloudinary} = require("../config/cloudinary")
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const upload = multer({storage})


module.exports = (io) => {
    const router = express.Router();

    router.post("/profile-picture", authMiddleware, upload.single('image'), async (req, res) => {
        try {
            const foundUser = await User.findById(req.user.id)
            const currentChat = await ChatRoom.findById(foundUser.currentChat)
            const imageUrl = req.file.path;
            console.log("Current User: ", foundUser)

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
    })

    return router;
}