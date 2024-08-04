const express = require("express");
const router = express.Router();
const { UserAdmin } = require("../models"); // Updated to UserAdmin
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/AuthMiddleware");

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserAdmin.create({
      username: username,
      password: hashedPassword,
    });
    res.json("Success");
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserAdmin.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong username and password combination" });
    }

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );

    res.json({
      token: accessToken,
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Auth Route
router.get("/auth", validateToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
