const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const utils = require("../utils/utils");

//updates the user's profile picture
exports.updateProfilePicture = async (req, res) => {
  const senderId = req.user.id;
  const imageUrl = req.file.path;
  const public_Id = req.file.filename;

  try {
    const foundUser = await User.findById(senderId).select(
      "profilePicture members"
    );
    //console.log("Current User: ", foundUser, "\nImage Url: ", imageUrl);
    if (foundUser.profilePicture != null) {
      await cloudinary.uploader.destroy(foundUser.profilePicture.public_Id);
    }

    const newProfilePicture = { url: imageUrl, public_Id }; //now profile picture object

    //get all possible ids where other users might need to get this socket event (duplicates are expected)
    const possibleMembers = await ChatRoom.find({
      $or: [{ members: senderId }, { exMembers: senderId }],
    }).select("members");

    //make new array a set to remove duplicates
    // we want to focus on unique ids, so we'll use flat map to say so
    // why flatMap over map? Flat map *flattens all the object properties into a single array, which is useful since that's what we want.
    const uniqueMembers = [
      ...new Set(possibleMembers.flatMap((room) => room.members)),
    ];

    res.sendStatus(200);

    await Promise.all([
      User.findByIdAndUpdate(req.user.id, {
        profilePicture: newProfilePicture,
      }),
      utils.findOnlineIdsAndSend(
        //cheating a little by setting the argument to members rather than having the whole chat object
        { members: uniqueMembers },
        "update-profile-picture",
        { foundUserId: senderId, newProfilePicture }
      ),
    ]);
  } catch (error) {
    console.log("Failed to upload image to cloudinary: ", error);
    return res
      .status(500)
      .json({ error: "Failed to upload image to cloudinary" });
  }
};

//for updating group chat photos
exports.updateGroupProfilePicture = async (req, res) => {
  const { roomId } = req.body;
  const imageUrl = req.file.path;

  try {
    //find the chat room, and if there is an existing profile picture, destroy that in cloudinary
    const foundChatRoom = await ChatRoom.findById(roomId).select(
      "profilePicture members"
    );
    if (foundChatRoom.profilePicture != null) {
      await cloudinary.uploader.destroy(foundChatRoom.profilePicture.public_Id);
    }
    res.sendStatus(200);
    //new image url
    const newProfilePicture = {
      url: imageUrl,
      public_Id: req.file.filename,
    };

    //find the corresponding onlineIds

    console.log("NEW GROUP PROFILE PIC: ", newProfilePicture, "\n");
    console.log("FOUND CHAT ROOM: ", foundChatRoom);

    foundChatRoom.profilePicture = newProfilePicture;
    await Promise.all([
      foundChatRoom.save(),
      utils.findOnlineIdsAndSend(foundChatRoom, "receive-group-photo-update", {
        roomId,
        newProfilePicture,
      }),
    ]);
  } catch (error) {
    console.log("Failed to upload the group Profile to cloudinary: ", error);
    return res.status(500).json({ error });
  }
};
