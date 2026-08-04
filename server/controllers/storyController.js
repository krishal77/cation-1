const { generateCulturalStory, chatWithGuide } = require('../services/storyService');

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

// @desc    Interactive voice conversation with heritage guide Ara
// @route   POST /api/story/chat
// @access  Public
const chatWithGuideController = async (req, res, next) => {
  try {
    const { siteName, userMessage, history } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: 'Please provide userMessage in request body.' });
    }

    const response = await chatWithGuide(siteName, userMessage, history);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStory,
  chatWithGuideController,
};
