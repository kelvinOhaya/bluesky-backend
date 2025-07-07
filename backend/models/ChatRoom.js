const mongoose = require("mongoose");
const User = require("./User");
const { Schema } = mongoose

//redo the rooms
const chatRoomSchema = new Schema({
    name: {type: String, required: true, default: "Empty ChatRoom"},
    isGroup: {type: Boolean, default: false},
    creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    joinCode: {type: String, required: true},
    groupPic: {type: String}},
    {timestamps: true}
);

chatRoomSchema.pre('save', function(next) {

     if(this.members.length >= 3) {
        this.isGroup = true
    }
    next();
})

module.exports = mongoose.model("ChatRoom", chatRoomSchema);