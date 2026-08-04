const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// In-memory user store fallback when MongoDB is offline
const memoryUsers = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretculturekey123', {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user, token) => ({
  _id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  token: token || generateToken(user._id || user.id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
          return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email: normalizedEmail, password });
        return res.status(201).json(formatUserResponse(user));
      } catch (dbErr) {
        console.warn('MongoDB register failed, using in-memory fallback:', dbErr.message);
      }
    }

    // 2. In-memory fallback when DB is disconnected
    if (memoryUsers.has(normalizedEmail)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const memUser = {
      _id: userId,
      id: userId,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    memoryUsers.set(normalizedEmail, memUser);

    return res.status(201).json(formatUserResponse(memUser));
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user && (await user.matchPassword(password))) {
          return res.json(formatUserResponse(user));
        } else if (user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
      } catch (dbErr) {
        console.warn('MongoDB login failed, using in-memory fallback:', dbErr.message);
      }
    }

    // 2. In-memory fallback when DB is disconnected
    const memUser = memoryUsers.get(normalizedEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (isMatch) {
        return res.json(formatUserResponse(memUser));
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
