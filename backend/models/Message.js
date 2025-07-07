const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatRoom = require("./ChatRoom");

const messageSchema = new Schema({
    sender: {type: String, required: true},
    chatRoom: {type: Schema.Types.ObjectId, ref: "ChatRoom", required: true},
    content: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Message", messageSchema)