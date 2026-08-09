const mongoose = require('mongoose');

const HeritageSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Site name is required'],
    unique: true,
    trim: true,
  },
  location: {
    type: String,
    default: 'Nepal',
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  historicalSignificance: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  imageUrl: {
    type: String,
  },
  embeddingsRef: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HeritageSite', HeritageSiteSchema);
