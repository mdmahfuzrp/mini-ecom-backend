// Auth routes
const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    register,
);

// Login route
router.post('/login', [body('email').isEmail().withMessage('Please include a valid email'), body('password').exists().withMessage('Password is required')], login);

// Get current user route
router.get('/me', authenticate, getMe);

module.exports = router;
