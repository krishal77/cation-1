const { predictSiteFromImage } = require('../services/aiService');
const VisitHistory = require('../models/VisitHistory');

const recognizeSite = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const aiResponse = await predictSiteFromImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    if (aiResponse.success && aiResponse.site_name) {
      try {
        await VisitHistory.create({
          user: req.user ? req.user._id : null,
          siteName: aiResponse.site_name,
          confidence: aiResponse.confidence,
          isConfident: aiResponse.is_confident,
          imageFilename: req.file.originalname,
        });
      } catch (logErr) {
        console.warn('Could not log visit history to DB:', logErr.message);
      }
    }

    res.json({
      success: aiResponse.success,
      siteName: aiResponse.site_name,
      confidence: aiResponse.confidence,
      isConfident: aiResponse.is_confident,
      threshold: aiResponse.threshold_used,
      allScores: aiResponse.all_scores,
      metadata: aiResponse.metadata,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recognizeSite,
};

