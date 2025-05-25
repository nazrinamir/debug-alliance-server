const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/AuthMiddleware");
const { PLAYERS_FILE, readXlsxFile, writeXlsxFile } = require("../utils/xlsxUtils");

// Get all players with filtering
router.get("/", validateToken, (req, res) => {
  try {
    const players = readXlsxFile(PLAYERS_FILE);
    let filteredPlayers = players.filter(p => !p.deletedAt);

    // Add debugging logs
    console.log("Query parameters:", req.query);
    console.log("First player data:", players[0]);

    // Filter by query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (key !== 'page' && key !== 'limit') {
          filteredPlayers = filteredPlayers.filter(player => {
            if (typeof player[key] === 'string') {
              return player[key].toLowerCase().includes(req.query[key].toLowerCase());
            }
            return player[key] == req.query[key];
          });
        }
      });
    }

    // Select only specific fields matching your Excel columns
    const sanitizedPlayers = filteredPlayers.map(player => ({
      id: player.id,
      src: player.src,
      name: player.name,
      fullName: player.fullName,
      pos: player.pos,
      foot: player.foot,
      age: player.age,
      yellow_card: player.yellow_card,
      red_card: player.red_card,
      injuries: player.injuries,
      appearances: player.appearances,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }));

    // Optional: Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedPlayers = sanitizedPlayers.slice(startIndex, endIndex);

    res.json({
      total: sanitizedPlayers.length,
      page,
      limit,
      data: paginatedPlayers
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// Get player by ID (excluding soft deleted)
router.get("/:id", validateToken, (req, res) => {
  try {
    const players = readXlsxFile(PLAYERS_FILE);
    const player = players.find(p => p.id === parseInt(req.params.id) && !p.deletedAt);
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

// Create new player
router.post("/", validateToken, (req, res) => {
  try {
    const players = readXlsxFile(PLAYERS_FILE);
    const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    
    const newPlayer = {
      id: newId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };
    
    players.push(newPlayer);
    writeXlsxFile(PLAYERS_FILE, players);
    
    res.json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create player" });
  }
});

// Update player
router.put("/:id", validateToken, (req, res) => {
  try {
    const players = readXlsxFile(PLAYERS_FILE);
    const index = players.findIndex(p => p.id === parseInt(req.params.id) && !p.deletedAt);
    
    if (index === -1) {
      return res.status(404).json({ error: "Player not found" });
    }
    
    players[index] = { 
      ...players[index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    writeXlsxFile(PLAYERS_FILE, players);
    
    res.json(players[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
});

// Soft delete player
router.delete("/:id", validateToken, (req, res) => {
  try {
    const players = readXlsxFile(PLAYERS_FILE);
    const index = players.findIndex(p => p.id === parseInt(req.params.id) && !p.deletedAt);
    
    if (index === -1) {
      return res.status(404).json({ error: "Player not found" });
    }
    
    players[index] = {
      ...players[index],
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    writeXlsxFile(PLAYERS_FILE, players);
    res.json({ 
      message: "Player deleted successfully",
      deletedAt: players[index].deletedAt 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete player" });
  }
});

module.exports = router; 