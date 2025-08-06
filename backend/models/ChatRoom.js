const mongoose = require("mongoose");
const User = require("./User");
const { Schema } = mongoose


const chatRoomSchema = new Schema({
    name: {type: String, default: "Empty ChatRoom"},
    isGroup: {type: Boolean, default: false},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    joinCode: {type: String, required: true},
    profilePicture: {
        type:  {
            url: {type: String},
            public_Id: {type: String}
        },
        default: null
    }},
    {timestamps: true}
);

chatRoomSchema.pre('save', function(next) {

     if(this.members.length >= 3) {
        this.isGroup = true
    }
    next();
})

module.exports = mongoose.model("ChatRoom", chatRoomSchema);