const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided!" });
  }

  try {
    // Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    const validToken = verify(token, "importantsecret");
    
    // Check token expiration
    const tokenTimestamp = new Date(validToken.timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - tokenTimestamp) / (1000 * 60 * 60); // difference in hours

    if (timeDiff > 24) {
      return res.status(401).json({ error: "Token expired" });
    }

    req.user = validToken;
    next();
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
