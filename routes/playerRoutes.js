const express = require('express');
const router = express.Router();
const Player = require('../models/mongodb/Player');
const { validateToken } = require('../middleware/AuthMiddleware');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create player (protected route)
router.post('/', validateToken, async (req, res) => {
  const player = new Player({
    nickname: req.body.nickname,
    fullName: req.body.fullName,
    position: req.body.position,
    foot: req.body.foot,
    age: req.body.age,
    yellow_card: req.body.yellow_card || 0,
    red_card: req.body.red_card || 0,
    injuries: req.body.injuries || [],
    appearance: req.body.appearance || 0
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update player (protected route)
router.put('/:id', validateToken, async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete player (protected route)
router.delete('/:id', validateToken, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 