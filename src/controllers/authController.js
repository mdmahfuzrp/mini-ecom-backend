// Auth controller for user registration and login

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Register new user
const register = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: 'User already exists with this email',
                error: 'Bad Request',
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            role: 'user',
        });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Remove password from response
        const { password: _, ...userData } = user.toJSON();

        res.status(201).json({
            message: 'User registered successfully',
            user: userData,
            token,
        });
    } catch (error) {
        console.log('Registration error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Server error during registration',
            error: 'Internal Server Error',
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized',
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Remove password from response
        const { password: _, ...userData } = user.toJSON();

        res.status(200).json({
            message: 'Login successful',
            user: userData,
            token,
        });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Server error during login',
            error: 'Internal Server Error',
        });
    }
};

// Get current user
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found',
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log('Get user error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Server error retrieving user data',
            error: 'Internal Server Error',
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
};
