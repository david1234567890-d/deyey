javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const { sendVerificationEmail } = require('../utils/emailService');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user
      const user = await User.create(name, email, password);

      // Generate verification token
      const verificationToken = await VerificationToken.create(user.id);

      // Send verification email
      await sendVerificationEmail(email, verificationToken.token);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.is_verified
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.is_verified) {
        return res.status(400).json({ 
          message: 'Please verify your email before logging in' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.is_verified
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;

      // Find valid token
      const verificationToken = await VerificationToken.findByToken(token);
      if (!verificationToken) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      // Verify user
      const user = await User.verify(verificationToken.user_id);

      // Delete used token
      await VerificationToken.delete(token);

      res.json({ 
        message: 'Email verified successfully', 
        user 
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;