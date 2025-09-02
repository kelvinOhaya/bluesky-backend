const jwt = require("jsonwebtoken")
require("dotenv").config()


//both of them are basically the same function, just that the expiration date is different
//sign the token and return said token
const createAccessToken = (user) => {
    const token = jwt.sign({id: user._id}, process.env.ACCESS_SECRET, {expiresIn: "15m"})
    return token
}

const createRefreshToken = (user) => {
    const token = jwt.sign({id: user._id}, process.env.REFRESH_SECRET, {expiresIn: "1d"})
    return token
}

module.exports = {createAccessToken, createRefreshToken}