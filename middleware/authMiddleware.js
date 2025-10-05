const jwt = require("jsonwebtoken");

//the middleware for authentication routes that should check that the user has an accessToken before accessing the route
const authMiddleware = (req, res, next) => {
  //look for an authorization header
  const authHeader = req.headers.authorization;

  // Debug logging
  console.log("🔍 Auth middleware - Headers:", {
    authorization: authHeader,
    userAgent: req.headers["user-agent"]?.substring(0, 50),
    origin: req.headers.origin,
  });

  //if there is no authorization header, or it doesn't start with "Bearer " (as the header should), return a 401 error telling the user no token was provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🔴 Auth middleware - No valid token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  //If the token looks like "Bearer (token)", we want the token part, so we split it into an array by the space character, and get the part with the token
  const token = authHeader.split(" ")[1];

  console.log("🔍 Auth middleware - Token:", token?.substring(0, 20) + "...");

  //get the decoded jwt token and set the req.user property of the route to the decoded token. then continue to the route originally intended
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("✅ Auth middleware - Token valid for user:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("🔴 Auth middleware - Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" }); // if this doesn't work, the token must be expired, so tell the user so.
  }
};

module.exports = authMiddleware;
