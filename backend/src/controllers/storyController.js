const { generateCulturalStory, chatWithGuide } = require('../services/storyService');

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

