const mongoose = require("mongoose");
const JoinCode = require("../models/JoinCode");
const OnlineId = require("../models/OnlineId");
const { getIo } = require("../io");

//generates a join code of the desired length, while chekcing that the code doesn't already exist in the database
exports.generateJoinCode = async (charLength) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let validatedJoinCode = false;
  let result = "";

  while (!validatedJoinCode) {
    result = "";
    for (let i = 0; i < charLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    const existingJoinCode = await JoinCode.findOne({ content: result });
    validatedJoinCode = !existingJoinCode;
  }

  await new JoinCode({ content: result }).save();
  return result;
};
/**
 * Shortcut function to find the list of people online in a room and send them all events
 * @param {Object} chatRoomObj - "ChatRoom Object you want to check for members, when using await.find(), ensure it at least has the members array"
 * @param {String} socketMessage - "name of the socket event you want to emit"
 * @param {Object} dataObj - "Json data you want to send"
 */
exports.findOnlineIdsAndSend = async (chatRoomObj, socketMessage, dataObj) => {
  const foundOnlineIds = await OnlineId.find({
    userId: { $in: chatRoomObj.members },
  });

  console.log(
    `All reported onlineIds:\n ${JSON.stringify(foundOnlineIds, null, 2)}`
  );

  foundOnlineIds.forEach((onlineId) => {
    getIo().to(onlineId.socketId).emit(socketMessage, dataObj);
  });
};
