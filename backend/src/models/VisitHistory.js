const mongoose = require('mongoose');

const VisitHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  siteName: {
    type: String,
    required: true,
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HeritageSite',
    required: false,
  },
  confidence: {
    type: Number,
    required: true,
  },
  isConfident: {
    type: Boolean,
    default: true,
  },
  imageFilename: {
    type: String,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VisitHistory', VisitHistorySchema);
