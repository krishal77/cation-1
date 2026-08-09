const express = require('express');
const router = express.Router();
const { getStory, chatWithGuideController } = require('../controllers/storyController');

router.post('/', getStory);
router.post('/chat', chatWithGuideController);

module.exports = router;
