const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ChatRoom = require("./ChatRoom");
const JoinCode = require("./JoinCode")
const { Schema } = mongoose

//rules for the new Schema
const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    currentChat: {type: Schema.Types.ObjectId, ref: "ChatRoom", default: null},
    profilePic: {type: String},
    joinCode: {type: String, required: true}
}, {timestamps: true})

//run this before the "save" function
userSchema.pre('save', async function (next) {
    if(!(this.isModified('password'))) return next(); //Continue to whatever the backend was doing before if the password isn't modified
    this.password = await bcrypt.hash(this.password, 10); //if the password is modified, hash that
    next();
})


//function that compares the password associated with this user to the password entered in the argument
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//export the model. The first argument is where the model will go (users collection), and the schema itself
module.exports = mongoose.model("User", userSchema);