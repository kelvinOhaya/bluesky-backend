const User = require("../models/User"); //import the user model
const { createAccessToken, createRefreshToken } = require("../utils/jwt"); //import the functions for making access and refresh tokens
const { generateJoinCode } = require("../utils/utils");

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

  //send the access token to the client
  return res.status(200).json({ accessToken: accessToken });
};

//login logic
exports.login = async (req, res) => {
  const { username, password } = req.body;

  //check if the user exists and the password matches
  //if not, send an 401 error with the following error message
  const foundUser = await User.findOne({ username });
  if (!foundUser) return res.status(401).json({ error: "invalid credentials" });

  //check if the password entered matches with the password in the database
  //if not, send a 401 error with the following error message
  const match = await foundUser.matchPassword(password);
  if (!match) return res.status(401).json({ error: "invalid credentials" });

  //grant access and refresh tokens (check jwt.js for details)
  const accessToken = createAccessToken(foundUser);
  const refreshToken = createRefreshToken(foundUser);

  //store refresh token in secure http cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/",
  });

  //send the access token to the client
  return res.status(200).json({ accessToken });
};

//for when we ned to refresh the access tokens
exports.refreshToken = (req, res) => {
  //import the jsonwebtoken library for verification
  const jwt = require("jsonwebtoken");

  //take the refresh token from the client's cookies
  //if there is no token, send a 401 status to the client
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  //verify the refresh token, and sent the user a new access token if it is valid. Otherwise send a 403 status error telling the user they are unauthorized
  jwt.verify(token, process.env.REFRESH_SECRET, (error, user) => {
    if (error) {
      console.log(error);
      return res.sendStatus(403);
    }
    const accessToken = createAccessToken({ _id: user.id });
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
