const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User");

const onlineIdSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    socketId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineId", onlineIdSchema);
