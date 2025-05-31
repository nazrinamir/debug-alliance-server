const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/AuthMiddleware");
const { USERS_FILE, readXlsxFile, writeXlsxFile } = require("../utils/xlsxUtils");

// Get all users
router.get("/", (req, res) => {
  try {
    const users = readXlsxFile(USERS_FILE);
    // Remove password from response
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const users = readXlsxFile(USERS_FILE);
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ 
        error: "Username already exists",
        status: false 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      username,
      password: hashedPassword,
      isAdmin: isAdmin === true, // Convert to boolean
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeXlsxFile(USERS_FILE, users);

    // Return more detailed response
    res.json({
      message: "User created successfully",
      status: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ 
      error: "Failed to sign up",
      status: false 
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = readXlsxFile(USERS_FILE);
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: "User doesn't exist!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong username and password combination" });
    }

    // Add timestamp and expiration
    const timestamp = new Date();
    const expiresIn = '24h'; // Token expires in 24 hours

    const accessToken = sign(
      { 
        username: user.username, 
        id: user.id,
        isAdmin: user.isAdmin,
        timestamp: timestamp.toISOString(),
      },
      "importantsecret",
      { expiresIn }
    );

    res.json({
      token: accessToken,
      username: user.username,
      id: user.id,
      isAdmin: user.isAdmin,
      timestamp: timestamp.toISOString(),
      expiresIn
    });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Update user
router.put("/:id", validateToken, async (req, res) => {
  try {
    const users = readXlsxFile(USERS_FILE);
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // If updating password, hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    
    users[index] = { ...users[index], ...req.body };
    writeXlsxFile(USERS_FILE, users);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = users[index];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
router.delete("/:id", validateToken, (req, res) => {
  try {
    const users = readXlsxFile(USERS_FILE);
    const filteredUsers = users.filter(u => u.id !== parseInt(req.params.id));
    
    if (filteredUsers.length === users.length) {
      return res.status(404).json({ error: "User not found" });
    }
    
    writeXlsxFile(USERS_FILE, filteredUsers);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Auth check route with timestamp verification
router.get("/auth", validateToken, (req, res) => {
  try {
    const tokenTimestamp = new Date(req.user.timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - tokenTimestamp) / (1000 * 60 * 60); // difference in hours

    if (timeDiff > 24) {
      return res.status(401).json({ error: "Token expired" });
    }

    res.json({
      ...req.user,
      tokenAge: `${Math.round(timeDiff * 100) / 100} hours`
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Verify token route
router.get("/verify-token", validateToken, (req, res) => {
  try {
    const tokenTimestamp = new Date(req.user.timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - tokenTimestamp) / (1000 * 60 * 60); // difference in hours

    res.json({
      valid: true,
      user: {
        username: req.user.username,
        id: req.user.id,
        isAdmin: req.user.isAdmin
      },
      tokenAge: `${Math.round(timeDiff * 100) / 100} hours`
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false,
      error: "Invalid token" 
    });
  }
});

module.exports = router;
