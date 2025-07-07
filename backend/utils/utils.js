const mongoose = require("mongoose")
const JoinCode = require("../models/JoinCode")

//generates a join code of the desired length, while chekcing that the code doesn't already exist in the database
exports.generateJoinCode = async (charLength) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let validatedJoinCode = false
    let result = ""

    while(!validatedJoinCode) {
        result = ""
        for(let i = 0; i < charLength; i++) {
            result += characters.charAt(Math.floor(Math.random()*characters.length));
        };
        const existingJoinCode = await JoinCode.findOne({content: result});
        validatedJoinCode=!existingJoinCode;
    }

    await new JoinCode({content: result}).save();
    return result;
}