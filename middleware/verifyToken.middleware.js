const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSecret;

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization; // Extract the full Authorization header
  const token = authorizationHeader?.replace("Bearer ", "");

  if (
    req.path === "/" ||
    req.path === "/api/users/signup" ||
    req.path === "/api/users/login"
  ) {
    return next();
  }

  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      error: "Unauthorized: No token provided",
    });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    console.log(token, decoded);
    if (err) {
      return res.status(403).json({
        status: 403,
        success: false,
        error: `Unauthorized: Invalid token,${err.message}`,
      });
    }
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp <= currentTime) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: "Unauthorized: Token has expired",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
};
