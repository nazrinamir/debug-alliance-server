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
    req.user = validToken; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
