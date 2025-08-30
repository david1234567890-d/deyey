javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validation');

// Register new user
router.post('/register', validateRegistration, handleValidationErrors, authController.register);

// Login user
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Verify email
router.get('/verify-email', authController.verifyEmail);

// Get user profile
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;