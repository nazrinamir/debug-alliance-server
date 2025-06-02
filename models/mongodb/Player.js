const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, 'Please add a nickname'],
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please add a position'],
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
  },
  foot: {
    type: String,
    required: [true, 'Please specify preferred foot'],
    enum: ['Left', 'Right', 'Both']
  },
  age: {
    type: Number,
    required: [true, 'Please add age']
  },
  yellow_card: {
    type: Number,
    default: 0
  },
  red_card: {
    type: Number,
    default: 0
  },
  injuries: [{
    type: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  appearance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema); 