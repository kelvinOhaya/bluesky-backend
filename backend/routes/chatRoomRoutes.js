const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers/chatRoomController");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/", authMiddleware, chatRoomController.createRoom);
router.post("/join", authMiddleware, chatRoomController.joinRoom);
router.post("/verify-join-code", authMiddleware, chatRoomController.verifyJoinCode)
router.post("/find-user", authMiddleware, chatRoomController.findUser);
router.post("/load-messages", authMiddleware, chatRoomController.loadMessages)
router.get("/send-info", authMiddleware, chatRoomController.sendInfo);
router.put("/change-name", authMiddleware, chatRoomController.changeName);
router.put("/update-current-room", authMiddleware, chatRoomController.updateCurrentRoom)
router.delete("/leave-room", authMiddleware, chatRoomController.leaveRoom)

module.exports = router