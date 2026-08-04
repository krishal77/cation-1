const axios = require('axios');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Sends image buffer to Python OpenCLIP AI service /predict endpoint.
 * @param {Buffer} fileBuffer - Image file buffer from Multer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - Image mime type
 * @returns {Promise<Object>} AI recognition result
 */
const predictSiteFromImage = async (fileBuffer, originalName, mimeType) => {
  try {
    const formData = new FormData();
    formData.append('image', fileBuffer, {
      filename: originalName || 'query.jpg',
      contentType: mimeType || 'image/jpeg',
    });

    const response = await axios.post(`${AI_SERVICE_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`AI Recognition Microservice is offline at ${AI_SERVICE_URL}`);
    }
    throw new Error(error.response?.data?.detail || error.message || 'AI service prediction error');
  }
};

module.exports = {
  predictSiteFromImage,
};
