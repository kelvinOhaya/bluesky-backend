const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User"); //import the user model
const { createAccessToken, createRefreshToken } = require("../utils/jwt"); //import the functions for making access and refresh tokens
const { generateJoinCode } = require("../utils/utils");
const { ObjectId } = require("mongodb");
require("dotenv").config();

//controller for verifying the sign up input
exports.verifySignUp = async (req, res) => {
  //destructured names (same as saying "username = req.body.username" etc...)
  const { username, password, confirmedPassword } = req.body;

  /*
    Checks that:
        - the fields aren't empty
        - the passwords match
        - the username isn't already taken
    */
  const newErrors = {
    fieldsAreEmpty:
      username === "" || password === "" || confirmedPassword === "",
    passwordsDoNotMatch: password != confirmedPassword,
    passwordUnderEightCharacters: password.length < 8,
    usernameIsAlreadyTaken: (await User.findOne({ username })) != null,
  };

  //send any errors found to the client as an object
  res.json({ newErrors });
};

//sign up logic
exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  const joinCode = await generateJoinCode(8);

  //make a new user with the request from the user
  const newUser = new User({
    username, // <- a shortcut that means "username: username"
    currentChat: new ObjectId("68c0671711b70a88b9b0cd90"),
    password,
    joinCode, // same as the line above
  });

  await newUser.save(); //save the user to mongoDB

  //grant access and refresh tokens (check jwt.js for details)
  const accessToken = createAccessToken(newUser);
  const refreshToken = createRefreshToken(newUser);

  const foundUser = await User.findOne({ username }).select("");
  await ChatRoom.findByIdAndUpdate("68c0671711b70a88b9b0cd90", {
    $addToSet: { members: foundUser._id },
  });

  //send both tokens to the client
  return res.status(200).json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

//login logic
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //check if the user exists and the password matches
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    //check if the password entered matches with the password in the database
    const match = await foundUser.matchPassword(password);

    if (!match) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    //grant access and refresh tokens (check jwt.js for details)
    const accessToken = createAccessToken(foundUser);
    const refreshToken = createRefreshToken(foundUser);

    //send both tokens to the client
    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

//for when we ned to refresh the access tokens
exports.refreshToken = (req, res) => {
  //import the jsonwebtoken library for verification
  const jwt = require("jsonwebtoken");

  //take the refresh token from the request body or headers
  const token = req.body.refreshToken || req.headers["x-refresh-token"];
  if (!token) {
    return res.sendStatus(401);
  }

  //verify the refresh token, and sent the user a new access token if it is valid. Otherwise send a 403 status error telling the user they are unauthorized
  jwt.verify(token, process.env.REFRESH_SECRET, (error, user) => {
    if (error) {
      return res.sendStatus(403);
    }
    const accessToken = createAccessToken({ _id: user.id });
    const newRefreshToken = createRefreshToken({ _id: user.id });
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  });
};

//logout logic
exports.logout = (req, res) => {
  // Since we're not using cookies, logout is handled client-side
  // Just return success - the client will remove the tokens
  return res.sendStatus(204);
};

//  logic for when the client requests their user data
//  (must go through authentication middleware first)
exports.me = async (req, res) => {
  //req will come from the middleware set in authMiddleware.js
  // find the user by the id in the database and give everything but the password
  // if there is an error, print it
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user }); //send the user data to the client
  } catch (error) {
    res.status(500).json({ error: `Unexpected Server Error: ${error}` });
  }
};
