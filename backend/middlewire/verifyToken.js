const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Check for token in cookies

  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // Verify token using the secret key from environment
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = verified.userId; // Attach userId from the token to the request object
    next();
  } catch (err) {
    console.error("Token verification failed", err);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = verifyToken;
