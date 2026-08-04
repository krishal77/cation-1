const express = require('express');
const router = express.Router();
const multer = require('multer');
const { recognizeSite } = require('../controllers/recognitionController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
});

// Public route — no auth required for image recognition
router.post('/', upload.single('image'), recognizeSite);

module.exports = router;
