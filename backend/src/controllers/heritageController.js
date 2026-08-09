const HeritageSite = require('../models/HeritageSite');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const getHeritageSites = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const sites = await HeritageSite.find({});
        if (sites.length > 0) {
          return res.json(sites);
        }
      } catch (dbErr) {
        console.warn('MongoDB query failed, using static catalog:', dbErr.message);
      }
    }

    const jsonPath = path.join(__dirname, '../../ai-service/data/heritage.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return res.json(Object.values(data));
    }

    res.json([]);
  } catch (error) {
    next(error);
  }
};

const getHeritageSiteById = async (req, res, next) => {
  try {
    const param = req.params.id;

    if (mongoose.connection.readyState === 1) {
      try {
        if (param.match(/^[0-9a-fA-F]{24}$/)) {
          const site = await HeritageSite.findById(param);
          if (site) return res.json(site);
        }

        const siteByName = await HeritageSite.findOne({
          name: { $regex: new RegExp(param, 'i') },
        });
        if (siteByName) return res.json(siteByName);
      } catch (dbErr) {
        console.warn('MongoDB lookup failed, using static catalog:', dbErr.message);
      }
    }

    const jsonPath = path.join(__dirname, '../../ai-service/data/heritage.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const foundKey = Object.keys(data).find(
        (k) => k.toLowerCase() === param.toLowerCase() || k.replace(/\s+/g, '_').toLowerCase() === param.toLowerCase()
      );
      if (foundKey) {
        return res.json(data[foundKey]);
      }
    }

    res.status(404).json({ message: `Heritage site '${param}' not found` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHeritageSites,
  getHeritageSiteById,
};

