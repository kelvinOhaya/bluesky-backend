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

  //store refresh token in secure http cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/",
  });

  const foundUser = await User.findOne({ username }).select("");
  await ChatRoom.findByIdAndUpdate("68c0671711b70a88b9b0cd90", {
    $addToSet: { members: foundUser._id },
  });

  //send the access token to the client
  return res.status(200).json({ accessToken: accessToken });
};

//login logic
exports.login = async (req, res) => {
  console.log("=== LOGIN START ===");
  const { username, password } = req.body;
  console.log("Received data:", { username, passwordLength: password?.length });

  try {
    //check if the user exists and the password matches
    console.log("1. Looking for user...");
    const foundUser = await User.findOne({ username });
    console.log("2. User found:", !!foundUser);

    if (!foundUser) {
      console.log("3. User not found, returning 401");
      return res.status(401).json({ error: "invalid credentials" });
    }

    //check if the password entered matches with the password in the database
    console.log("4. Checking password...");
    const match = await foundUser.matchPassword(password);
    console.log("5. Password match:", match);

    if (!match) {
      console.log("6. Password mismatch, returning 401");
      return res.status(401).json({ error: "invalid credentials" });
    }

    //grant access and refresh tokens (check jwt.js for details)
    console.log("7. Creating tokens...");
    const accessToken = createAccessToken(foundUser);
    console.log("8. Access token created");
    const refreshToken = createRefreshToken(foundUser);
    console.log("9. Refresh token created");

    //store refresh token in secure http cookie
    console.log("10. Setting cookie...");
    const cookieOptions = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    };
    console.log("Cookie options:", cookieOptions);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    console.log(
      "11. Cookie set with token:",
      refreshToken.substring(0, 20) + "..."
    );

    //send the access token to the client
    console.log("12. Sending response...");
    console.log("=== LOGIN END ===");

    // result headers
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

//for when we ned to refresh the access tokens
exports.refreshToken = (req, res) => {
  //import the jsonwebtoken library for verification
  const jwt = require("jsonwebtoken");

  console.log("=== REFRESH TOKEN START ===");
  console.log("All cookies:", req.cookies);
  console.log("RefreshToken cookie exists:", !!req.cookies.refreshToken);

  //take the refresh token from the client's cookies
  //if there is no token, send a 401 status to the client
  const token = req.cookies.refreshToken;
  if (!token) {
    console.log("No refresh token found in cookies");
    return res.sendStatus(401);
  }

  console.log("Found refresh token:", token.substring(0, 20) + "...");

  //verify the refresh token, and sent the user a new access token if it is valid. Otherwise send a 403 status error telling the user they are unauthorized
  jwt.verify(token, process.env.REFRESH_SECRET, (error, user) => {
    if (error) {
      console.log(error);
      return res.sendStatus(403);
    }
    const accessToken = createAccessToken({ _id: user.id });
    console.log("Login finished!");
    res.json({ accessToken });
  });
};

//logout logic
exports.logout = (req, res) => {
  //try to clear the refresh token cookie
  //if there's an error, log it in the console
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error: ", error);
  }
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
