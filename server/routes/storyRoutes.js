const express = require('express');
const router = express.Router();
const { getStory } = require('../controllers/storyController');

router.post('/', getStory);

module.exports = router;
