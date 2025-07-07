const express = require("express");
const multer = require("multer");
const {storage} = require("../config/cloudinary")
const upload = multer({storage})

const router = express.Router();

router.post("/profile-picture", upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file.path;
        res.status(200).json({url: imageUrl})
    } catch (error) {
        res.status(500).json({error: "Failed to upload image to cloudinary"})
    }
})