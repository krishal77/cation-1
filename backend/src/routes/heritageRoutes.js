const express = require('express');
const router = express.Router();
const { getHeritageSites, getHeritageSiteById } = require('../controllers/heritageController');

router.get('/', getHeritageSites);
router.get('/:id', getHeritageSiteById);

module.exports = router;
