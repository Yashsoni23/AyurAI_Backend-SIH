export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (req.path === "/api/users/signup" || req.path === "/api/users/login") {
    return next();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: No token provided",
    });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: Invalid token",
      });
    }

    req.user = decoded;
    next();
  });
};
