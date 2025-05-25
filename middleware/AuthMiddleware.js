const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    // Remove unnecessary logging
    // console.log("Token:", res.accessToken);
    // console.log("Username and Password:", this.username, this.password);

    const validToken = verify(accessToken, "importantsecret");
    
    // Check token expiration
    const tokenTimestamp = new Date(validToken.timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - tokenTimestamp) / (1000 * 60 * 60); // difference in hours

    if (timeDiff > 24) {
      return res.status(401).json({ error: "Token expired" });
    }

    req.user = validToken; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
