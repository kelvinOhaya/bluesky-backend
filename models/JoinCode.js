const mongoose = require("mongoose")
const { Schema } = mongoose

const joinCodeSchema = new Schema({
    content: {type: String, required: true},
}, {timestamps: true})

module.exports = mongoose.model("JoinCode", joinCodeSchema)