const { generateCulturalStory } = require('../services/storyService');

// @desc    Generate cultural story / audio guide details for a site
// @route   POST /api/story
// @access  Public
const getStory = async (req, res, next) => {
  try {
    const { siteName, customPrompt } = req.body;

    if (!siteName) {
      return res.status(400).json({ message: 'Please provide siteName in request body.' });
    }

    const storyData = await generateCulturalStory(siteName, customPrompt);
    res.json(storyData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStory,
};
